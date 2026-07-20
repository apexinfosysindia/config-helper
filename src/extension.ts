import * as path from "path";
import * as vscode from "vscode";
import { LanguageClientOptions } from "vscode-languageclient";
import {
  LanguageClient,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";
import { AuthManager } from "./auth/manager";
import { AuthMiddleware } from "./auth/middleware";
import { manageAuth, testConnection } from "./auth/commands";
import { debugAuthSettings } from "./auth/debug";
import { repairAuthConfiguration } from "./auth/repair";
import { ApexOSStatusBar } from "./status/statusBar";
import { registerReloadCommands } from "./commands/reloadCommands";


const documentSelector = [
  { language: "apexos", scheme: "file" },
  { language: "apexos", scheme: "untitled" },
];

export async function activate(
  context: vscode.ExtensionContext,
): Promise<void> {
  console.log("ApexOS Extension has been activated!");

  // Initialize status bar
  const statusBar = new ApexOSStatusBar(context);
  context.subscriptions.push(statusBar);

  // Attempt to migrate token from settings to SecretStorage if needed
  try {
    const migratedToken = await AuthManager.migrateTokenFromSettings(context);
    if (migratedToken) {
      console.log("Successfully migrated token from settings to SecretStorage");
    }

    // Attempt to migrate ApexOS instance URL from settings to SecretStorage if needed
    const migratedUrl = await AuthManager.migrateUrlFromSettings(context);
    if (migratedUrl) {
      console.log("Successfully migrated ApexOS instance URL from settings to SecretStorage");
    }
  } catch (error) {
    console.error("Failed to migrate credentials:", error);
  }

  const serverModule = path.join(
    context.extensionPath,
    "out",
    "server",
    "server.js",
  );

  const debugOptions = { execArgv: ["--nolazy", "--inspect=6003"] };

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  };

  // Create file system watcher and register for disposal to prevent memory leaks
  const fileWatcher = vscode.workspace.createFileSystemWatcher("**/*.?(e)y?(a)ml");
  context.subscriptions.push(fileWatcher);

  const clientOptions: LanguageClientOptions = {
    documentSelector,
    synchronize: {
      // Legacy-compat: also sync the pre-fork section name
      configurationSection: ["apexos", "vscode-home-assistant"],
      fileEvents: fileWatcher,
    },
    initializationOptions: async () => {
      // Pass token and URL directly in initialization options
      try {
        const token = await AuthManager.getToken(context);
        const url = await AuthManager.getUrl(context);
        const config = vscode.workspace.getConfiguration("apexos");
        // Legacy-compat: pre-fork settings section (native values win)
        const legacyConfig = vscode.workspace.getConfiguration(
          "vscode-home-assistant",
        );

        console.log("Setting up initialization options for ApexOS language server");
        console.log(`Token available: ${token ? "Yes" : "No"}`);
        console.log(`ApexOS instance URL available: ${url ? "Yes" : "No"}`);

        // Use SecretStorage values first, then fallback to settings
        return {
          "apexos": {
            longLivedAccessToken: token || "",
            hostUrl:
              url ||
              config.get<string>("hostUrl") ||
              legacyConfig.get<string>("hostUrl") ||
              "",
            ignoreCertificates: !!(
              config.get<boolean>("ignoreCertificates") ??
              legacyConfig.get<boolean>("ignoreCertificates")
            )
          }
        };
      } catch (error) {
        console.error("Failed to set initialization options:", error);
        return {};
      }
    },
  };

  const client = new LanguageClient(
    "apexos",
    "ApexOS Language Server",
    serverOptions,
    clientOptions,
  );

  // is this really needed?
  vscode.languages.setLanguageConfiguration("apexos", {
    wordPattern: /("(?:[^\\"]*(?:\\.)?)*"?)|[^\s{}[\],:]+/,
  });


  try {
    // Start the client
    await client.start();
    context.subscriptions.push({ dispose: () => client.stop() });

    // Install our auth middleware to inject the token and URL from SecretStorage
    try {
      // @ts-expect-error - We need to access the connection which is private
      const connection = client._connection || client;
      await AuthMiddleware.install(context, connection);
      console.log("Auth middleware successfully installed");

      // Force an initial configuration refresh to ensure token and URL are set
      const config = vscode.workspace.getConfiguration("apexos");

      // Get the token and URL directly and explicitly trigger a configuration update
      const token = await AuthManager.getToken(context);
      const url = await AuthManager.getUrl(context); // Also check URL

      if (token && url) { // Ensure both token and URL are present
        console.log("Token and ApexOS instance URL found, explicitly sending configuration update");
        // Force update some setting to trigger a configuration refresh
        await config.update("triggerConfigRefresh", Date.now(), vscode.ConfigurationTarget.Global);

        // Check the status bar connection
        statusBar.checkConnectionStatus();
      }
    } catch (error) {
      console.error("Error setting up auth middleware:", error);
    }
  } catch (error: unknown) {
    console.error("Failed to start the client:", error);
    if (error instanceof Error) {
      void vscode.window.showErrorMessage(`Failed to start ApexOS Language Server: ${error.message}`);
    }
  }

  // Register all notification handlers and add them to subscriptions to prevent memory leaks
  context.subscriptions.push(
    client.onNotification("no-config", async (): Promise<void> => {
      if (await AuthManager.hasCredentials(context)) {
        console.log("'no-config' notification received from server, but credentials (token and/or ApexOS instance URL) found in SecretStorage. Ignoring pop-up.");
        return;
      }
      const manageAuthCommand = "Manage Authentication";
      const optionClicked = await vscode.window.showInformationMessage(
        "No ApexOS authentication (token and/or ApexOS instance URL) found. Please set authentication.",
        manageAuthCommand,
      );
      if (optionClicked === manageAuthCommand) {
        await vscode.commands.executeCommand(
          "apexos.manageAuth",
        );
      }

      // Update status bar to show disconnected state
      statusBar.checkConnectionStatus();
    })
  );

  // Add handler for connection established event
  context.subscriptions.push(
    client.onNotification("ha_connected", async (data: { name?: string; version?: string }): Promise<void> => {
      console.log("ApexOS connection established notification received");
      // Get instance information if available
      const instanceInfo = {
        name: data.name || "ApexOS",
        version: data.version
      };
      // Update status bar with connection information
      statusBar.setConnectionStatus("connected", instanceInfo);
    })
  );

  // Add handler for connection error event
  context.subscriptions.push(
    client.onNotification("ha_connection_error", async (data: { error?: string }): Promise<void> => {
      console.log(`ApexOS connection error notification received: ${data.error || "Unknown error"}`);
      // Update status bar to show error state
      statusBar.setConnectionStatus("error");
    })
  );

  context.subscriptions.push(
    client.onNotification("configuration_check_completed", async (result) => {
      if (result && result.result === "valid") {
        await vscode.window.showInformationMessage(
          "ApexOS Configuration Checked, result: 'Valid'!",
        );
      } else {
        await vscode.window.showErrorMessage(
          `ApexOS Configuration check resulted in an error: ${result.error}`,
        );
      }
    })
  );

  let apexOutputChannel: vscode.OutputChannel;
  context.subscriptions.push(
    client.onNotification("get_eror_log_completed", (result) => {
      if (!apexOutputChannel) {
        apexOutputChannel = vscode.window.createOutputChannel(
          "ApexOS Error Log",
        );
        // Register the output channel for disposal to prevent memory leaks
        context.subscriptions.push(apexOutputChannel);
      }
      apexOutputChannel.appendLine(result);
      apexOutputChannel.show();
    })
  );

  let apexTemplateRendererChannel: vscode.OutputChannel;
  context.subscriptions.push(
    client.onNotification("render_template_completed", (result) => {
      if (!apexTemplateRendererChannel) {
        apexTemplateRendererChannel = vscode.window.createOutputChannel(
          "ApexOS Template Renderer",
        );
        // Register the output channel for disposal to prevent memory leaks
        context.subscriptions.push(apexTemplateRendererChannel);
      }
      apexTemplateRendererChannel.clear();
      apexTemplateRendererChannel.appendLine(result);
      apexTemplateRendererChannel.show();
    })
  );

  const commandMappings = [
    new CommandMappings(
      "apexos.reloadAll",
      "apexos",
      "reload_all",
    ),
    new CommandMappings(
      "apexos.scriptReload",
      "script",
      "reload",
    ),
    new CommandMappings("apexos.groupReload", "group", "reload"),
    new CommandMappings(
      "apexos.apexosReloadCoreConfig",
      "apexos",
      "reload_core_config",
    ),
    new CommandMappings(
      "apexos.apexosRestart",
      "apexos",
      "restart",
    ),
    new CommandMappings(
      "apexos.automationReload",
      "automation",
      "reload",
    ),
    new CommandMappings(
      "apexos.conversationReload",
      "conversation",
      "reload",
    ),
    new CommandMappings("apexos.sceneReload", "scene", "reload"),
    new CommandMappings(
      "apexos.themeReload",
      "frontend",
      "reload_themes",
    ),
    new CommandMappings(
      "apexos.homekitReload",
      "homekit",
      "reload",
    ),
    new CommandMappings(
      "apexos.filesizeReload",
      "filesize",
      "reload",
    ),
    new CommandMappings(
      "apexos.minMaxReload",
      "min_max",
      "reload",
    ),
    new CommandMappings(
      "apexos.genericThermostatReload",
      "generic_thermostat",
      "reload",
    ),
    new CommandMappings(
      "apexos.genericCameraReload",
      "generic",
      "reload",
    ),
    new CommandMappings("apexos.pingReload", "ping", "reload"),
    new CommandMappings("apexos.trendReload", "trend", "reload"),
    new CommandMappings(
      "apexos.historyStatsReload",
      "history_stats",
      "reload",
    ),
    new CommandMappings(
      "apexos.universalReload",
      "universal",
      "reload",
    ),
    new CommandMappings(
      "apexos.statisticsReload",
      "statistics",
      "reload",
    ),
    new CommandMappings(
      "apexos.filterReload",
      "filter",
      "reload",
    ),
    new CommandMappings("apexos.restReload", "rest", "reload"),
    new CommandMappings(
      "apexos.commandLineReload",
      "command_line",
      "reload",
    ),
    new CommandMappings(
      "apexos.bayesianReload",
      "bayesian",
      "reload",
    ),
    new CommandMappings(
      "apexos.telegramReload",
      "telegram",
      "reload",
    ),
    new CommandMappings("apexos.smtpReload", "smtp", "reload"),
    new CommandMappings("apexos.mqttReload", "mqtt", "reload"),
    new CommandMappings(
      "apexos.rpioGpioReload",
      "rpi_gpio",
      "reload",
    ),
    new CommandMappings("apexos.knxReload", "knx", "reload"),
    new CommandMappings(
      "apexos.templateReload",
      "template",
      "reload",
    ),
    new CommandMappings(
      "apexos.customTemplatesReload",
      "apexos",
      "reload_custom_templates",
    ),
    new CommandMappings(
      "apexos.supervisorAddonRestartGitPull",
      "supervisor",
      "addon_restart",
      { addon: "core_git_pull" },
    ),
    new CommandMappings(
      "apexos.supervisorHostReboot",
      "supervisor",
      "host_reboot",
    ),
  ];

  // Register all reload commands from the reloadCommands module
  registerReloadCommands(context, commandMappings, client);

  // Register restart and reboot commands
  const restartCommands = commandMappings.filter(mapping => {
    const commandId = mapping.commandId.toLowerCase();
    return commandId.includes("restart") || commandId.includes("reboot");
  });
  
  restartCommands.forEach((mapping) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(mapping.commandId, async (_) => {
        await client.sendRequest("callService", {
          domain: mapping.domain,
          service: mapping.service,
          serviceData: mapping.serviceData,
        });
        await vscode.window.showInformationMessage(
          `ApexOS service ${mapping.domain}.${mapping.service} called!`,
        );
      })
    );
  });

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "apexos.apexosCheckConfig",
      async () => {
        await client.sendRequest("checkConfig");
      },
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "apexos.getErrorLog",
      async () => {
        await client.sendRequest("getErrorLog");
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "apexos.renderTemplate",
      async () => {
        const editor = vscode.window.activeTextEditor;
        const selectedText = editor.document.getText(editor.selection);
        await client.sendRequest("renderTemplate", { template: selectedText });
      },
    ),
  );

  // Register command to open ApexOS in browser
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "apexos.openInBrowser",
      async () => {
        await statusBar.openInBrowser();
      }
    )
  );

  // Register the token management command with status bar update
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "apexos.manageAuth",
      async () => {
        await manageAuth(context);
        // Update status bar after auth changes
        statusBar.checkConnectionStatus();
      }
    )
  );

  // Register the debug token command
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "apexos.debugAuth",
      () => debugAuthSettings(context)
    )
  );

  // Register the token repair command with status bar update
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "apexos.repairAuth",
      async () => {
        await repairAuthConfiguration(context);
        // Update status bar after repair
        statusBar.checkConnectionStatus();
      }
    )
  );

  // Register the test connection command with status bar update
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "apexos.testConnection",
      async () => {
        await testConnection(context);
        // Update status bar after connection test
        statusBar.checkConnectionStatus();
      }
    )
  );

  // Check configuration setting to see if automatic file association is disabled
  const config = vscode.workspace.getConfiguration("apexos");
  const disableAutomaticFileAssociation =
    config.get<boolean>("disableAutomaticFileAssociation", false) ||
    // Legacy-compat: pre-fork settings section
    vscode.workspace
      .getConfiguration("vscode-home-assistant")
      .get<boolean>("disableAutomaticFileAssociation", false);
  
  if (disableAutomaticFileAssociation) {
    console.log("Automatic file association is disabled by user setting - skipping file associations");
  } else if (await isApexOSWorkspace()) {
    const fileAssociations = vscode.workspace
      .getConfiguration()
      .get("files.associations") as { [key: string]: string };
    if (
      !fileAssociations["*.yaml"] &&
      Object.values(fileAssociations).indexOf("apexos") === -1
    ) {
      console.log("ApexOS workspace detected, setting YAML file associations");
      // Set general YAML files to apexos, but exclude docker-compose and esphome files
      await vscode.workspace
        .getConfiguration()
        .update("files.associations", {
          "*.yaml": "apexos",
          // Modern Docker Compose filenames (compose.yaml is the preferred format)
          "compose.yml": "yaml",
          "compose.yaml": "yaml",
          "compose.*.yml": "yaml",
          "compose.*.yaml": "yaml",
          // Legacy Docker Compose filenames (for backward compatibility)
          "docker-compose.yml": "yaml",
          "docker-compose.yaml": "yaml",
          "docker-compose.*.yml": "yaml",
          "docker-compose.*.yaml": "yaml",
          // ESPHome configuration files (for ESPHome extension)
          "esphome/**/*.yml": "esphome",
          "esphome/**/*.yaml": "esphome"
        }, false);
    }
  } else {
    console.log("Configuration.yaml found but this doesn't appear to be a ApexOS workspace - skipping file associations");
  }

  // Listen for configuration changes that might affect the connection
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(async (event) => {
      const apexConfigChanged =
        event.affectsConfiguration("apexos") ||
        event.affectsConfiguration("vscode-home-assistant");
      
      if (apexConfigChanged) {
        console.log("ApexOS configuration changed, updating status bar");
        statusBar.checkConnectionStatus();
      }
    })
  );

  // Initial check for credentials
  if (!(await AuthManager.hasCredentials(context))) {
    // Delay the message slightly to avoid race conditions with other startup messages
    setTimeout(() => {
      const manageAuthCommandText = "Manage Authentication";
      vscode.window.showInformationMessage(
        "Welcome to the ApexOS VS Code Extension! To get started, please set your ApexOS token and instance URL.",
        manageAuthCommandText
      ).then(selection => {
        if (selection === manageAuthCommandText) {
          vscode.commands.executeCommand("apexos.manageAuth");
        }
      });
    }, 1000);
  } else {
    // Check status bar connection if we have credentials
    statusBar.checkConnectionStatus();
  }
}

export async function deactivate(): Promise<void> {
  // nothing to dispose
}


export class CommandMappings {
  constructor(
    public commandId: string,
    public domain: string,
    public service: string,
    public serviceData?: {
      [key: string]: any;
    },
  ) {}
}

/**
 * Determines if the current workspace is actually a ApexOS configuration directory
 * by checking for ApexOS-specific indicators beyond just configuration.yaml
 */
async function isApexOSWorkspace(): Promise<boolean> {
  const { workspaceFolders } = vscode.workspace;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return false;
  }

  for (const folder of workspaceFolders) {
    const workspacePath = folder.uri.fsPath;
    
    try {
      // Check for configuration.yaml first
      const configPath = path.join(workspacePath, "configuration.yaml");
      const configExists = await vscode.workspace.fs.stat(vscode.Uri.file(configPath))
        .then(() => true, () => false);
      
      if (configExists) {
        // Look for .storage folder next to configuration.yaml
        const storagePath = path.join(workspacePath, ".storage");
        const storageExists = await vscode.workspace.fs.stat(vscode.Uri.file(storagePath))
          .then(() => true, () => false);
        
        if (storageExists) {
          console.log(`ApexOS workspace detected: found .storage folder at ${storagePath}`);
          return true;
        }
        
        // Additional checks for other ApexOS-specific indicators
        const apexIndicators = [
          "apexos_v2.db",      // ApexOS database
          "apexos.log",        // Log file
          ".APEX_VERSION",     // Version file
          // Legacy-compat: pre-fork artifacts may survive in migrated configs
          "home-assistant_v2.db",
          "home-assistant.log",
          ".HA_VERSION",
          "automations.yaml",          // Common config file
          "scripts.yaml",              // Common config file
          "scenes.yaml",               // Common config file
          "ui-lovelace.yaml"           // Dashboard configuration
        ];
        
        for (const indicator of apexIndicators) {
          const indicatorPath = path.join(workspacePath, indicator);
          const indicatorExists = await vscode.workspace.fs.stat(vscode.Uri.file(indicatorPath))
            .then(() => true, () => false);
          
          if (indicatorExists) {
            console.log(`ApexOS workspace detected: found ${indicator} at ${indicatorPath}`);
            return true;
          }
        }
        
        // Check for configuration.yaml content - look for 'apexos:' key
        try {
          const configContent = await vscode.workspace.fs.readFile(vscode.Uri.file(configPath));
          const configText = Buffer.from(configContent).toString("utf8");
          
          // Simple regex to check for apexos key (with various spacing/formatting)
          // legacy-compat: also match the pre-fork core section key
          if (/^\s*(?:apexos|homeassistant)\s*:/m.test(configText)) {
            console.log("ApexOS workspace detected: found \"apexos:\" key in configuration.yaml");
            return true;
          }
        } catch (error) {
          console.log(`Could not read configuration.yaml content: ${error}`);
        }
        
        console.log(`Found configuration.yaml at ${configPath} but no ApexOS indicators - skipping file associations`);
      }
    } catch (error) {
      console.log(`Error checking workspace ${workspacePath}: ${error}`);
    }
  }
  
  return false;
}
