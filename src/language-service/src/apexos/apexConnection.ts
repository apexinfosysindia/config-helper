import {
  CompletionItem,
  CompletionItemKind,
  MarkupContent,
} from "vscode-languageserver-protocol";
import axios, { Method } from "axios";
import {
  type Connection,
  type ApexEntities,
  type ApexServices,
  type AuthData,
  createConnection as apexCreateConnection,
  Auth as ApexAuth,
  subscribeEntities,
  subscribeServices,
} from "@apexinfosysindia/js-websocket";
import { IConfigurationService } from "../configuration";
import { createSocket } from "./socket";

export interface ApexArea {
  area_id: string;
  floor_id: string | null;
  name: string;
  picture: string | null;
  icon: string | null;
  labels: string[];
  aliases: string[];
}

export interface ApexAreas {
  [area_id: string]: ApexArea;
}

export interface ApexFloor {
  floor_id: string;
  name: string;
  level: number | null;
  icon: string | null;
  aliases: string[];
}

export interface ApexFloors {
  [floor_id: string]: ApexFloor;
}

export interface ApexLabel {
  label_id: string;
  name: string;
  icon: string | null;
  color: string | null;
  description: string | null;
}

export interface ApexDevice {
  area_id: string | null;
  configuration_url: string | null;
  config_entries: string[];
  connections: [string, string][];
  disabled_by: string | null;
  entry_type: string | null;
  hw_version: string | null;
  id: string;
  identifiers: [string, string][];
  manufacturer: string | null;
  model: string | null;
  name_by_user: string | null;
  name: string | null;
  sw_version: string | null;
  via_device_id: string | null;
  labels: string[];
}

export interface ApexDevices {
  [device_id: string]: ApexDevice;
}

export interface ApexLabels {
  [label_id: string]: ApexLabel;
}

export interface ApexEntityRegistryEntry {
  area_id: string | null;
  config_entry_id: string | null;
  device_id: string | null;
  disabled_by: string | null;
  entity_category: string | null;
  entity_id: string;
  has_entity_name: boolean;
  hidden_by: string | null;
  icon: string | null;
  id: string;
  name: string | null;
  options: Record<string, any>;
  original_name: string | null;
  platform: string;
  translation_key: string | null;
  unique_id: string | null;
  labels: string[];
}

export interface ApexEntityRegistry {
  [entity_id: string]: ApexEntityRegistryEntry;
}

// Normal require(), and cast to the static type
// const ha =

// require("@apexinfosysindia/js-websocket/dist/apexws.cjs") as typeof import("@apexinfosysindia/js-websocket");

export interface IApexConnection {
  tryConnect(): Promise<void>;
  notifyConfigUpdate(conf: any): Promise<void>;
  getAreaCompletions(): Promise<CompletionItem[]>;
  getDeviceCompletions(): Promise<CompletionItem[]>;
  getDomainCompletions(): Promise<CompletionItem[]>;
  getEntityCompletions(): Promise<CompletionItem[]>;
  getFloorCompletions(): Promise<CompletionItem[]>;
  getLabelCompletions(): Promise<CompletionItem[]>;
  getServiceCompletions(): Promise<CompletionItem[]>;
  getApexEntities(): Promise<ApexEntities>;
  getApexDevices(): Promise<ApexDevices>;
  getApexEntityRegistry(): Promise<ApexEntityRegistry>;
  getApexServices(): Promise<ApexServices>;
  resolveEntityCompletionDocumentation(entityId: string): Promise<MarkupContent | undefined>;
}

export class ApexConnection implements IApexConnection {
  private connection: Connection | undefined;

  private apexAreas!: Promise<ApexAreas>;

  private apexDevices!: Promise<ApexDevices>;

  private apexEntities!: Promise<ApexEntities>;

  private apexEntityRegistry!: Promise<ApexEntityRegistry>;

  private apexFloors!: Promise<ApexFloors>;

  private apexLabels!: Promise<ApexLabels>;

  private apexServices!: Promise<ApexServices>;

  // Cache the current entities to avoid memory churn from subscription updates
  private currentEntitiesCache: ApexEntities | undefined;
  private currentServicesCache: ApexServices | undefined;

  // Track unsubscribe functions to prevent memory leaks
  private unsubscribeEntities: (() => void) | undefined;
  private unsubscribeServices: (() => void) | undefined;

  // Track the last successful configuration to avoid unnecessary reconnections
  private lastSuccessfulConfig: {
    token?: string;
    url?: string;
    ignoreCertificates?: boolean;
  } = {};

  // Event callbacks for connection status
  public onConnectionEstablished: ((info: { name?: string; version?: string }) => void) | undefined;
  public onConnectionFailed: ((error: string) => void) | undefined;

  // Track the last entity count to avoid logging duplicate messages
  private lastEntityCount: number | undefined;

  constructor(private configurationService: IConfigurationService) {}

  public tryConnect = async (): Promise<void> => {
    try {
      await this.createConnection();
    } catch (error) {
      console.error("Failed to create initial connection:", error);
      // Don't rethrow - we want to allow partial functionality even if connection fails
    }
  };

  private async createConnection(): Promise<void> {
    // Enhanced connection debugging
    console.log("Creating ApexOS connection...");
    console.log(`Configuration status: ${this.configurationService.isConfigured ? "Configured" : "Not Configured"}`);
    console.log(`URL configured: ${this.configurationService.url ? "Yes" : "No"}`);
    console.log(`Token available: ${this.configurationService.token ? "Yes" : "No"}`);
    
    if (!this.configurationService.isConfigured) {
      console.log("ApexOS is not configured, aborting connection attempt");
      return;
    }

    if (this.connection !== undefined) {
      console.log("Connection already exists, reusing existing connection");
      return;
    }

    // Log connection details before creating auth
    console.log(`Creating ApexOS connection to URL: ${this.configurationService.url}`);
    
    if (!this.configurationService.url) {
      console.error("No URL configured for ApexOS - connection will fail");
    }
    
    if (!this.configurationService.token) {
      console.error("No token configured for ApexOS - authentication will fail");
      console.error("Debug: ConfigurationService state:", {
        isConfigured: this.configurationService.isConfigured,
        hasURL: !!this.configurationService.url,
        hasToken: !!this.configurationService.token,
        ignoreCerts: this.configurationService.ignoreCertificates
      });
    } else {
      console.log(`Using token with length: ${this.configurationService.token.length}, first chars: ${this.configurationService.token.substring(0, 5)}...`);
    }
    
    // Create proper WebSocket URL from HTTP URL
    const apexUrl = this.configurationService.url || "";
    let wsUrl = "";
    
    if (apexUrl) {
      try {
        // Remove trailing slashes to prevent double slashes in the path
        const normalizedUrl = apexUrl.replace(/\/+$/, "");
        const url = new URL(`${normalizedUrl}/api/websocket`);
        const wsProtocol = url.protocol === "https:" ? "wss:" : "ws:";
        wsUrl = `${wsProtocol}//${url.host}${url.pathname}`;
        console.log(`Generated WebSocket URL: ${wsUrl}`);
      } catch (error) {
        console.error(`Failed to generate WebSocket URL from ${apexUrl}:`, error);
      }
    }
    
    // Log token status before connection
    console.log(`Creating ApexOS connection to URL: ${apexUrl}`);
    const hasToken = !!this.configurationService.token;
    console.log(`Token available for connection: ${hasToken ? "Yes" : "No"}`);
    if (hasToken) {
      console.log(`Token appears valid (length: ${this.configurationService.token!.length})`);
    } else {
      console.error("No token available! Authentication will fail.");
    }
    
    // Create auth object with both HTTP and WebSocket URLs
    const auth = new ApexAuth({
      access_token: this.configurationService.token || "",
      expires: +new Date(new Date().getTime() + 1e11),
      wsUrl: wsUrl,
      clientId: "",
      expires_in: +new Date(new Date().getTime() + 1e11),
      refresh_token: "",
      // Custom property for HTTP URL that may be used in custom components
      apexUrl: apexUrl,
    } as AuthData);

    try {
      // Validate required connection params before attempting connection
      if (!auth.wsUrl) {
        console.error("Missing WebSocket URL - unable to connect to ApexOS");
        this.handleConnectionError("ERR_MISSING_WS_URL");
        throw new Error("Missing WebSocket URL for ApexOS connection");
      }
      
      if (!auth.accessToken) {
        console.error("Missing access token - ApexOS authentication will fail");
        // Continue trying - the connection might work for non-secured endpoints
      }
      
      console.log("Connecting to ApexOS...");
      console.log(`Using WebSocket URL: ${auth.wsUrl}`);
      
      this.connection = await apexCreateConnection({
        auth,
        createSocket: async () =>
          createSocket(auth, this.configurationService.ignoreCertificates),
      });
      console.log("Connected to ApexOS");
      
      // Store successful connection configuration
      this.lastSuccessfulConfig = {
        token: this.configurationService.token,
        url: this.configurationService.url,
        ignoreCertificates: this.configurationService.ignoreCertificates
      };
      console.log("Stored successful connection configuration for future reference");
      
      // Notify about successful connection
      if (this.onConnectionEstablished) {
        try {
          // Get instance name if possible
          let instanceName;
          let version;
          try {
            const configResponse = await this.callApi("get", "config");
            if (configResponse && typeof configResponse === "object") {
              instanceName = configResponse.location_name;
              version = configResponse.version;
            }
          } catch (error) {
            console.log("Could not fetch ApexOS instance name:", error);
          }
          
          // Trigger connection established callback
          this.onConnectionEstablished({
            name: instanceName,
            version: version
          });
        } catch (cbError) {
          console.error("Error in connection established callback:", cbError);
        }
      }
    } catch (error) {
      console.error("Failed to connect to ApexOS:", error);
      
      // Notify about connection failure
      if (this.onConnectionFailed) {
        let errorMessage = "Unknown error";
        if (typeof error === "string") {
          errorMessage = error;
        } else if (error && typeof error === "object" && "message" in error) {
          errorMessage = error.message as string;
        }
        try {
          this.onConnectionFailed(errorMessage);
        } catch (cbError) {
          console.error("Error in connection failed callback:", cbError);
        }
      }
      
      this.handleConnectionError(error);
      throw error;
    }

    this.connection.addEventListener("ready", () => {
      console.log("(re-)connected to ApexOS");
      if (this.onConnectionEstablished) {
        this.onConnectionEstablished({ name: "ApexOS", version: "1.0" });
      }
    });

    this.connection.addEventListener("disconnected", () => {
      console.warn("Lost connection with ApexOS");
    });

    this.connection.addEventListener("reconnect-error", (data) => {
      console.error("Reconnect error with ApexOS", data);
      if (this.onConnectionFailed) {
        this.onConnectionFailed("Reconnect error");
      }
    });
  }

  private handleConnectionError = (error: any) => {
    this.connection = undefined;
    
    // Ensure we have some token to use for debugging
    let tokenIndication = "(no token)";
    if (this.configurationService.token) {
      tokenIndication = `${this.configurationService.token}`.substring(0, 5) + "...";
    }
    
    // Get a more descriptive error message
    let errorText = error;
    let detailedError = "";
    
    switch (error) {
      case 1:
        errorText = "ERR_CANNOT_CONNECT";
        detailedError = "Cannot connect to the server. Check your network connection and server URL.";
        break;
      case 2:
        errorText = "ERR_INVALID_AUTH";
        detailedError = "Authentication failed. Your token may be invalid or expired.";
        break;
      case 3:
        errorText = "ERR_CONNECTION_LOST";
        detailedError = "Connection was established but then lost. The server might be restarting.";
        break;
      case 4:
        errorText = "ERR_APEX_HOST_REQUIRED";
        detailedError = "No ApexOS host URL configured. Please set a valid host URL.";
        break;
      case "ERR_MISSING_WS_URL":
        errorText = "ERR_MISSING_WS_URL";
        detailedError = "Failed to generate WebSocket URL. Check your Host URL configuration.";
        break;
      default:
        // If it's an object with a message property, use that
        if (error && typeof error === "object" && "message" in error) {
          detailedError = error.message;
        } else if (error && typeof error === "object" && "code" in error) {
          // Node.js networking errors
          errorText = `Network Error: ${error.code}`;
          if (error.code === "ENOTFOUND") {
            detailedError = "Host not found. Check your server URL and network connection.";
          } else if (error.code === "ECONNREFUSED") {
            detailedError = "Connection refused. Verify the server is running and accessible.";
          } else {
            detailedError = `Error connecting to server: ${error.code}`;
          }
        }
    }
    
    // Log detailed diagnostics
    console.error(`Error connecting to ApexOS Server at ${this.configurationService.url || "(no URL)"}`);
    console.error(`Token: ${tokenIndication}`);
    console.error(`Error code: ${errorText}`);
    console.error(`Details: ${detailedError || "No additional details"}`);
    
    // Also log the full message for backwards compatibility
    const message = `Error connecting to your ApexOS Server at ${this.configurationService.url || "(no URL)"} and token '${tokenIndication}', check your network or update your VS Code Settings, make sure to (also) check your workspace settings! Error: ${errorText} - ${detailedError}`;
    console.error(message);
  };

  public notifyConfigUpdate = async (): Promise<void> => {
    console.log("Configuration update detected, checking if reconnection is needed...");
    
    // Check if the token or URL has changed since last successful connection
    const tokenChanged = this.lastSuccessfulConfig.token !== this.configurationService.token;
    const urlChanged = this.lastSuccessfulConfig.url !== this.configurationService.url;
    const certSettingChanged = this.lastSuccessfulConfig.ignoreCertificates !== this.configurationService.ignoreCertificates;
    
    if (!tokenChanged && !urlChanged && !certSettingChanged) {
      console.log("No relevant configuration changes detected, skipping reconnection");
      return;
    }
    
    console.log("Configuration changes detected, reconnecting to ApexOS...");
    if (tokenChanged) {
      console.log("Token has changed, reconnection required");
    }
    if (urlChanged) {
      console.log("Server URL has changed, reconnection required");
    }
    if (certSettingChanged) {
      console.log("Certificate settings changed, reconnection required");
    }
    
    this.disconnect();

    // Reset connection state to force full reconnection
    this.connection = undefined;
    this.apexAreas = undefined as any;
    this.apexDevices = undefined as any;
    this.apexEntities = undefined as any;
    this.apexEntityRegistry = undefined as any;
    this.apexFloors = undefined as any;
    this.apexLabels = undefined as any;
    this.apexServices = undefined as any;

    // Clear caches to release memory
    this.currentEntitiesCache = undefined;
    this.currentServicesCache = undefined;
    
    try {
      await this.tryConnect();
      console.log("Successfully reconnected to ApexOS after configuration update");
      
      // Update last successful configuration
      this.lastSuccessfulConfig = {
        token: this.configurationService.token,
        url: this.configurationService.url,
        ignoreCertificates: this.configurationService.ignoreCertificates
      };
      
      // Notify about successful reconnection
      if (this.onConnectionEstablished) {
        try {
          // Get instance name if possible
          let instanceName;
          let version;
          try {
            const configResponse = await this.callApi("get", "config");
            if (configResponse && typeof configResponse === "object") {
              instanceName = configResponse.location_name;
              version = configResponse.version;
            }
          } catch (error) {
            console.log("Could not fetch ApexOS instance name after reconnection:", error);
          }
          
          this.onConnectionEstablished({
            name: instanceName,
            version: version
          });
        } catch (cbError) {
          console.error("Error in connection established callback after config update:", cbError);
        }
      }
    } catch (error) {
      console.error("Failed to reconnect after configuration update:", error);
      
      // Notify about connection failure
      if (this.onConnectionFailed) {
        let errorMessage = "Unknown error";
        if (typeof error === "string") {
          errorMessage = error;
        } else if (error && typeof error === "object" && "message" in error) {
          errorMessage = error.message as string;
        }
        try {
          this.onConnectionFailed(errorMessage);
        } catch (cbError) {
          console.error("Error in connection failed callback after config update:", cbError);
        }
      }
      // Error is already displayed in logs via error handler
    }
  };

  private getApexAreas = async (): Promise<ApexAreas> => {
    if (this.apexAreas !== undefined) {
      return this.apexAreas;
    }

    await this.createConnection();

    this.apexAreas = new Promise<ApexAreas>(
      // eslint-disable-next-line no-async-promise-executor
      async (resolve, reject) => {
        if (!this.connection) {
          return reject();
        }
        this.connection
          ?.sendMessagePromise<ApexArea[]>({
            type: "config/area_registry/list",
          })
          .then((areas) => {
            console.log(`Got ${areas.length} areas from ApexOS`);
            const repacked_areas: ApexAreas = {};
            areas.forEach((area) => {
              repacked_areas[area.area_id] = area;
            });
            return resolve(repacked_areas);
          });
      },
    );
    return this.apexAreas;
  };

  public async getAreaCompletions(): Promise<CompletionItem[]> {
    const areas = await this.getApexAreas();

    if (!areas) {
      return [];
    }

    const completions: CompletionItem[] = [];

    for (const [, value] of Object.entries(areas)) {
      const completionItem = CompletionItem.create(`${value.area_id}`);
      completionItem.detail = value.name;
      completionItem.kind = CompletionItemKind.Variable;
      completionItem.filterText = `${value.area_id} ${value.name}`;
      completionItem.insertText = value.area_id;
      completionItem.data = {};
      completionItem.data.isArea = true;

      completionItem.documentation = {
        kind: "markdown",
        value: `**${value.area_id}** \r\n \r\n`,
      } as MarkupContent;

      let floor = value.floor_id;
      if (!floor) {
        floor = "No floor assigned";
      }
      completionItem.documentation.value += `Floor: ${floor} \r\n \r\n`;

      completions.push(completionItem);
    }
    return completions;
  }

  private getApexFloors = async (): Promise<ApexFloors> => {
    if (this.apexFloors !== undefined) {
      return this.apexFloors;
    }

    await this.createConnection();

    this.apexFloors = new Promise<ApexFloors>(
      // eslint-disable-next-line no-async-promise-executor
      async (resolve, reject) => {
        if (!this.connection) {
          return reject();
        }
        this.connection
          ?.sendMessagePromise<ApexFloor[]>({
            type: "config/floor_registry/list",
          })
          .then((floors) => {
            console.log(`Got ${floors.length} floors from ApexOS`);
            const repacked_floors: ApexFloors = {};
            floors.forEach((floor) => {
              repacked_floors[floor.floor_id] = floor;
            });
            return resolve(repacked_floors);
          });
      },
    );
    return this.apexFloors;
  };

  public async getFloorCompletions(): Promise<CompletionItem[]> {
    const floors = await this.getApexFloors();

    if (!floors) {
      return [];
    }

    const completions: CompletionItem[] = [];

    for (const [, value] of Object.entries(floors)) {
      const completionItem = CompletionItem.create(`${value.floor_id}`);
      completionItem.detail = value.name;
      completionItem.kind = CompletionItemKind.Variable;
      completionItem.filterText = `${value.floor_id} ${value.name}`;
      completionItem.insertText = value.floor_id;
      completionItem.data = {};
      completionItem.data.isFloor = true;

      completionItem.documentation = {
        kind: "markdown",
        value: `**${value.floor_id}** \r\n`,
      } as MarkupContent;
      completions.push(completionItem);
    }
    return completions;
  }

  private getApexDevicesInternal = async (): Promise<ApexDevices> => {
    if (this.apexDevices !== undefined) {
      return this.apexDevices;
    }

    await this.createConnection();

    this.apexDevices = new Promise<ApexDevices>(
      // eslint-disable-next-line no-async-promise-executor
      async (resolve, reject) => {
        if (!this.connection) {
          return reject();
        }
        this.connection
          ?.sendMessagePromise<ApexDevice[]>({
            type: "config/device_registry/list",
          })
          .then((devices) => {
            console.log(`Got ${devices.length} devices from ApexOS`);
            const repacked_devices: ApexDevices = {};
            devices.forEach((device) => {
              repacked_devices[device.id] = device;
            });
            return resolve(repacked_devices);
          });
      },
    );
    return this.apexDevices;
  };

  public async getApexDevices(): Promise<ApexDevices> {
    return this.getApexDevicesInternal();
  }

  public async getDeviceCompletions(): Promise<CompletionItem[]> {
    const devices = await this.getApexDevices();

    if (!devices) {
      return [];
    }

    const completions: CompletionItem[] = [];

    for (const [, value] of Object.entries(devices)) {
      const completionItem = CompletionItem.create(`${value.id}`);
      completionItem.detail = value.name || value.id;
      completionItem.kind = CompletionItemKind.Variable;
      completionItem.filterText = `${value.id} ${value.name || ""}`;
      completionItem.insertText = value.id;
      completionItem.data = {};
      completionItem.data.isDevice = true;

      completionItem.documentation = {
        kind: "markdown",
        value: `**${value.id}** \r\n \r\n`,
      } as MarkupContent;

      if (value.name) {
        completionItem.documentation.value += `Name: ${value.name} \r\n \r\n`;
      }

      if (value.manufacturer) {
        completionItem.documentation.value += `Manufacturer: ${value.manufacturer} \r\n \r\n`;
      }

      if (value.model) {
        completionItem.documentation.value += `Model: ${value.model} \r\n \r\n`;
      }

      let area = value.area_id;
      if (!area) {
        area = "No area assigned";
      }
      completionItem.documentation.value += `Area: ${area} \r\n \r\n`;

      completions.push(completionItem);
    }
    return completions;
  }

  public async getApexEntities(): Promise<ApexEntities> {
    // If we have a cached value, return it immediately
    // This is updated in real-time by the subscription callback
    if (this.currentEntitiesCache !== undefined) {
      return this.currentEntitiesCache;
    }

    // If we already have a promise waiting for initial load, return it
    if (this.apexEntities !== undefined) {
      return this.apexEntities;
    }

    await this.createConnection();

    this.apexEntities = new Promise<ApexEntities>(
      // eslint-disable-next-line no-async-promise-executor
      async (resolve, reject) => {
        if (!this.connection) {
          return reject();
        }

        // Unsubscribe from previous subscription to prevent memory leak
        if (this.unsubscribeEntities) {
          this.unsubscribeEntities();
          this.unsubscribeEntities = undefined;
        }

        // Subscribe to entities and update cache on every change
        // This prevents memory churn from creating new promise values on each update
        this.unsubscribeEntities = subscribeEntities(this.connection, (entities) => {
          const entityCount = Object.keys(entities).length;

          // Only log if the entity count has changed
          if (this.lastEntityCount !== entityCount) {
            if (this.lastEntityCount === undefined) {
              // Initial load
              console.log(`Got ${entityCount} entities from ApexOS`);
            } else {
              const diff = entityCount - this.lastEntityCount;
              if (diff > 0) {
                console.log(`Got ${diff} new entities from ApexOS (total: ${entityCount})`);
              } else {
                console.log(`${Math.abs(diff)} entities have been removed from ApexOS (total: ${entityCount})`);
              }
            }
            this.lastEntityCount = entityCount;
          }

          // Update the cache with the latest entities
          // This is more memory-efficient than creating new promises on each update
          this.currentEntitiesCache = entities;

          // Only resolve the promise once (on first load)
          resolve(entities);
        });
      },
    );
    return this.apexEntities;
  }

  private getApexEntityRegistryInternal = async (): Promise<ApexEntityRegistry> => {
    if (this.apexEntityRegistry !== undefined) {
      return this.apexEntityRegistry;
    }

    await this.createConnection();

    this.apexEntityRegistry = new Promise<ApexEntityRegistry>(
      // eslint-disable-next-line no-async-promise-executor
      async (resolve, reject) => {
        if (!this.connection) {
          return reject();
        }
        this.connection
          ?.sendMessagePromise<ApexEntityRegistryEntry[]>({
            type: "config/entity_registry/list",
          })
          .then((entityEntries) => {
            console.log(`Got ${entityEntries.length} entity registry entries from ApexOS`);
            const repacked_entities: ApexEntityRegistry = {};
            entityEntries.forEach((entry) => {
              repacked_entities[entry.entity_id] = entry;
            });
            return resolve(repacked_entities);
          });
      },
    );
    return this.apexEntityRegistry;
  };

  public async getApexEntityRegistry(): Promise<ApexEntityRegistry> {
    return this.getApexEntityRegistryInternal();
  }

  private getApexLabels = async (): Promise<ApexLabels> => {
    if (this.apexLabels !== undefined) {
      return this.apexLabels;
    }

    await this.createConnection();

    this.apexLabels = new Promise<ApexLabels>(
      // eslint-disable-next-line no-async-promise-executor
      async (resolve, reject) => {
        if (!this.connection) {
          return reject();
        }
        this.connection
          ?.sendMessagePromise<ApexLabel[]>({
            type: "config/label_registry/list",
          })
          .then((labels) => {
            console.log(`Got ${labels.length} labels from ApexOS`);
            const repacked_labels: ApexLabels = {};
            labels.forEach((label) => {
              repacked_labels[label.label_id] = label;
            });
            return resolve(repacked_labels);
          });
      },
    );
    return this.apexLabels;
  };

  public async getLabelCompletions(): Promise<CompletionItem[]> {
    const labels = await this.getApexLabels();

    if (!labels) {
      return [];
    }

    const completions: CompletionItem[] = [];

    for (const [, value] of Object.entries(labels)) {
      const completionItem = CompletionItem.create(`${value.label_id}`);
      completionItem.detail = value.name;
      completionItem.kind = CompletionItemKind.Variable;
      completionItem.filterText = `${value.label_id} ${value.name}`;
      completionItem.insertText = value.label_id;
      completionItem.data = {};
      completionItem.data.isLabel = true;

      completionItem.documentation = {
        kind: "markdown",
        value: `**${value.label_id}** \r\n`,
      } as MarkupContent;
      completions.push(completionItem);
    }
    return completions;
  }

  private async getAreaName(areaId: string | undefined): Promise<string | null> {
    if (!areaId) {
      return null;
    }

    try {
      const areaCompletions = await this.getAreaCompletions();
      const area = areaCompletions.find(a => a.label === areaId);
      return area?.detail || areaId;
    } catch (error) {
      console.log("Error getting area name:", error);
      return areaId;
    }
  }

  private async getFloorName(areaId: string | undefined): Promise<string | null> {
    if (!areaId) {
      return null;
    }

    try {
      // First get the floor_id from the area
      const areaCompletions = await this.getAreaCompletions();
      const area = areaCompletions.find(a => a.label === areaId);
      
      if (!area?.documentation) {
        return null;
      }

      // Extract floor info from area documentation
      const docValue = typeof area.documentation === "string" 
        ? area.documentation 
        : area.documentation.value;
        
      const floorMatch = docValue.match(/Floor:\s*([^\r\n]+)/);
      if (!floorMatch || floorMatch[1].trim() === "No floor assigned") {
        return null;
      }

      const floorId = floorMatch[1].trim();
      
      // Get human-readable floor name
      const floorCompletions = await this.getFloorCompletions();
      const floor = floorCompletions.find(f => f.label === floorId);
      return floor?.detail || floorId;
    } catch (error) {
      console.log("Error getting floor name:", error);
      return null;
    }
  }

  private async getDeviceForEntity(entityId: string): Promise<{ area_id: string | null; id: string } | null> {
    if (!entityId) {
      return null;
    }

    try {
      // Get the entity registry entry to find device_id
      const entityRegistry = await this.getApexEntityRegistry();
      const entityEntry = entityRegistry[entityId];
      
      if (!entityEntry || !entityEntry.device_id) {
        return null;
      }

      // Get the device information
      const devices = await this.getApexDevices();
      const device = devices[entityEntry.device_id];
      
      if (!device) {
        return null;
      }

      return {
        area_id: device.area_id,
        id: device.id
      };
    } catch (error) {
      console.log("Error getting device for entity:", error);
      return null;
    }
  }

  public async getEntityCompletions(): Promise<CompletionItem[]> {
    const entities = await this.getApexEntities();

    if (!entities) {
      return [];
    }

    const completions: CompletionItem[] = [];

    for (const [, value] of Object.entries(entities)) {
      const completionItem = CompletionItem.create(`${value.entity_id}`);
      completionItem.detail = value.attributes.friendly_name;
      completionItem.kind = CompletionItemKind.Variable;
      completionItem.filterText = `${value.entity_id} ${value.attributes.friendly_name}`;
      completionItem.insertText = value.entity_id;
      completionItem.data = {
        isEntity: true,
        entityId: value.entity_id,
      };

      // Don't generate documentation upfront - this causes massive performance issues
      // with hundreds/thousands of entities. Documentation will be lazy-loaded on-demand
      // in onCompletionResolve when the user actually selects/focuses the completion item.

      completions.push(completionItem);
    }
    return completions;
  }

  private safeStringify(value: any, maxLength = 200): string {
    try {
      // Handle primitives
      if (value === null || value === undefined) {
        return String(value);
      }
      if (typeof value === "string") {
        return value.length > maxLength ? value.substring(0, maxLength) + "..." : value;
      }
      if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
      }

      // Handle arrays
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return "[]";
        }
        // Only show first few items to avoid very long strings
        const items = value.slice(0, 3).map(item => {
          if (typeof item === "object") {
            return "[object]";
          }
          return String(item);
        });
        const result = items.join(", ");
        const suffix = value.length > 3 ? ` ... (${value.length - 3} more)` : "";
        return result + suffix;
      }

      // Handle objects with circular reference protection
      if (typeof value === "object") {
        try {
          const seen = new WeakSet();
          const str = JSON.stringify(value, (_key, val) => {
            if (typeof val === "object" && val !== null) {
              if (seen.has(val)) {
                return "[Circular]";
              }
              seen.add(val);
            }
            return val;
          });
          return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
        } catch {
          return "[object]";
        }
      }

      return String(value);
    } catch (error) {
      return "[error converting value]";
    }
  }

  private async createEntityCompletionMarkdown(entity: any): Promise<string> {
    // Show friendly name on top, fallback to entity_id if missing
    let markdown = "";

    // Get device and area information for contextual display
    const deviceInfo = await this.getDeviceForEntity(entity.entity_id);
    const areaName = deviceInfo ? await this.getAreaName(deviceInfo.area_id) : null;
    const floorName = deviceInfo ? await this.getFloorName(deviceInfo.area_id) : null;

    // Add contextual information (device, area, floor) right after entity name
    if (areaName || floorName) {
      if (areaName) {
        markdown += `📍 ${areaName}\n`;
      }
      if (floorName) {
        markdown += `🏠 ${floorName}\n`;
      }
      markdown += "\n";
    }

    // Current state
    if (entity.state !== undefined) {
      let stateDisplay = `**Current State:** \`${entity.state}\``;

      // Add unit of measurement if available
      if (entity.attributes?.unit_of_measurement) {
        stateDisplay += ` ${entity.attributes.unit_of_measurement}`;
      }
      markdown += stateDisplay + "\n\n";
    }

    // Last changed/updated information
    if (entity.last_changed) {
      try {
        const lastChanged = new Date(entity.last_changed);
        markdown += `**Last Changed:** ${lastChanged.toLocaleString()}\n\n`;
      } catch {
        // If date parsing fails, show raw value
        markdown += `**Last Changed:** ${entity.last_changed}\n\n`;
      }
    }

    // All attributes table (excluding useless ones)
    const attributeEntries: [string, string][] = [];

    // Add all attributes except filtered ones
    if (entity.attributes) {
      for (const [attr, value] of Object.entries(entity.attributes)) {
        // Filter out useless or redundant attributes
        if (attr === "supported_features" || attr === "friendly_name") {
          continue;
        }

        if (value !== undefined && value !== null) {
          const displayValue = this.safeStringify(value);
          attributeEntries.push([attr, displayValue]);
        }
      }
    }

    if (attributeEntries.length > 0) {
      // Sort attributes alphabetically
      attributeEntries.sort((a, b) => a[0].localeCompare(b[0]));

      markdown += "| Attribute | Value |\n";
      markdown += "|:----------|:------|\n";

      for (const [attr, displayValue] of attributeEntries) {
        markdown += `| ${attr} | ${displayValue} |\n`;
      }
      markdown += "\n";
    }

    return markdown;
  }

  public async resolveEntityCompletionDocumentation(entityId: string): Promise<MarkupContent | undefined> {
    try {
      const entities = await this.getApexEntities();
      if (!entities) {
        return undefined;
      }

      const entity = Object.values(entities).find((e: any) => e.entity_id === entityId);
      if (!entity) {
        return undefined;
      }

      return {
        kind: "markdown",
        value: await this.createEntityCompletionMarkdown(entity),
      } as MarkupContent;
    } catch (error) {
      console.error(`Error resolving entity completion documentation for ${entityId}:`, error);
      return undefined;
    }
  }

  public async getDomainCompletions(): Promise<CompletionItem[]> {
    const entities = await this.getApexEntities();
    let domains = [];

    if (!entities) {
      return [];
    }

    for (const [, value] of Object.entries(entities)) {
      domains.push(value.entity_id.split(".")[0]);
    }
    domains = [...new Set(domains)];

    const completions: CompletionItem[] = [];
    for (const domain of domains) {
      const completionItem = CompletionItem.create(domain);
      completionItem.kind = CompletionItemKind.Variable;
      completionItem.data = {};
      completionItem.data.isDomain = true;
      completions.push(completionItem);
    }
    return completions;
  }

  public async getApexServices(): Promise<ApexServices> {
    // If we have a cached value, return it immediately
    // This is updated in real-time by the subscription callback
    if (this.currentServicesCache !== undefined) {
      return this.currentServicesCache;
    }

    // If we already have a promise waiting for initial load, return it
    if (this.apexServices !== undefined) {
      return this.apexServices;
    }

    await this.createConnection();

    this.apexServices = new Promise<ApexServices>(
      // eslint-disable-next-line no-async-promise-executor
      async (resolve, reject) => {
        if (!this.connection) {
          return reject();
        }

        // Unsubscribe from previous subscription to prevent memory leak
        if (this.unsubscribeServices) {
          this.unsubscribeServices();
          this.unsubscribeServices = undefined;
        }

        // Subscribe to services and update cache on every change
        // This prevents memory churn from creating new promise values on each update
        this.unsubscribeServices = subscribeServices(this.connection, (services: ApexServices) => {
          console.log(
            `Got ${Object.keys(services).length} services from ApexOS`,
          );

          // Update the cache with the latest services
          // This is more memory-efficient than creating new promises on each update
          this.currentServicesCache = services;

          // Only resolve the promise once (on first load)
          return resolve(services);
        });
      },
    );
    return this.apexServices;
  };

  public async getServiceCompletions(): Promise<CompletionItem[]> {
    const services = await this.getApexServices();

    if (!services) {
      return [];
    }

    const completions: CompletionItem[] = [];

    for (const [domainKey, domainValue] of Object.entries(services)) {
      for (const [serviceKey, serviceValue] of Object.entries(domainValue)) {
        const completionItem = CompletionItem.create(
          `${domainKey}.${serviceKey}`,
        );
        completionItem.kind = CompletionItemKind.EnumMember;
        completionItem.filterText = `${domainKey}.${serviceKey}`;
        completionItem.insertText = completionItem.filterText;
        completionItem.data = {};
        completionItem.data.isService = true;

        const fields = Object.entries(serviceValue.fields);

        if (fields.length > 0) {
          completionItem.documentation = {
            kind: "markdown",
            value: `**${domainKey}.${serviceKey}:** \r\n \r\n`,
          } as MarkupContent;

          completionItem.documentation.value +=
            "| Field | Description | Example | \r\n";
          completionItem.documentation.value +=
            "| :---- | :---- | :---- | \r\n";

          for (const [fieldKey, fieldValue] of fields) {
            completionItem.documentation.value += `| ${fieldKey} | ${fieldValue.description} |  ${fieldValue.example} | \r\n`;
          }
        }
        completions.push(completionItem);
      }
    }

    return completions;
  }

  public disconnect(): void {
    if (!this.connection) {
      return;
    }
    console.log("Disconnecting from ApexOS");

    // Unsubscribe from all subscriptions to prevent memory leaks
    if (this.unsubscribeEntities) {
      this.unsubscribeEntities();
      this.unsubscribeEntities = undefined;
    }
    if (this.unsubscribeServices) {
      this.unsubscribeServices();
      this.unsubscribeServices = undefined;
    }

    // Clear caches to release memory immediately on disconnect
    this.currentEntitiesCache = undefined;
    this.currentServicesCache = undefined;

    this.connection.close();
    this.connection = undefined;

    // Notify about disconnection if handler exists
    if (this.onConnectionFailed) {
      try {
        this.onConnectionFailed("Disconnected");
      } catch (error) {
        console.error("Error in connection failed callback during disconnect:", error);
      }
    }
  }

  public callApi = async (
    method: Method,
    api: string,
    requestBody?: any,
  ): Promise<any> => {
    try {
      const resp = await axios.request({
        method,
        url: `${this.configurationService.url}/api/${api}`,
        headers: {
          Authorization: `Bearer ${this.configurationService.token}`,
        },
        data: requestBody,
      });

      return resp.data;
    } catch (error) {
      console.error(`Error calling API ${api}:`, error);
      
      // Extract error information for better error messages
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx range
        console.error(`Response status: ${error.response.status}`);
        console.error(`Response data:`, error.response.data);
        
        // Return the error data to allow the caller to handle it
        return error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        return { error: "No response received from ApexOS" };
      } else {
        // Something happened in setting up the request
        if (typeof error === "object" && error !== null) {
          if (error.message) {
            return { error: error.message };
          }
          try {
            return { error: JSON.stringify(error) };
          } catch {
            return { error: "Unknown error occurred" };
          }
        }
        return { error: String(error) };
      }
    }
    return Promise.resolve("");
  };

  public callService = async (
    domain: string,
    service: string,

    serviceData: any,
  ): Promise<any> => {
    try {
      const resp = await axios.request({
        method: "POST",
        url: `${this.configurationService.url}/api/services/${domain}/${service}`,
        headers: {
          Authorization: `Bearer ${this.configurationService.token}`,
        },
        data: serviceData,
      });

      console.log(
        `Service Call ${domain}.${service} made succesfully, response:`,
      );
      console.log(JSON.stringify(resp.data, null, 1));
    } catch (error) {
      console.error(error);
    }
    return Promise.resolve();
  };
}
