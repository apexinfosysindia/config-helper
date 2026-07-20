import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  ServerCapabilities,
  TextDocumentSyncKind,
  Diagnostic,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import { getLanguageService } from "yaml-language-server/out/server/src/languageservice/yamlLanguageService";
import { ApexConnection } from "../language-service/src/apexos/apexConnection";
import { ConfigurationService } from "../language-service/src/configuration";
import { ApexOSConfiguration } from "../language-service/src/apexConfig/apexConfig";
import { ApexOSLanguageService } from "../language-service/src/apexLanguageService";
import { SchemaServiceForIncludes } from "../language-service/src/schemas/schemaService";
import { IncludeDefinitionProvider } from "../language-service/src/definition/includes";
import { ScriptDefinitionProvider } from "../language-service/src/definition/scripts";
import { SecretsDefinitionProvider } from "../language-service/src/definition/secrets";
import { VsCodeFileAccessor } from "./fileAccessor";

const connection = createConnection(ProposedFeatures.all, undefined, undefined);

console.log = connection.console.log.bind(connection.console);
console.warn = connection.window.showWarningMessage.bind(connection.window);
console.error = connection.window.showErrorMessage.bind(connection.window);

const documents = new TextDocuments(TextDocument);
documents.listen(connection);

connection.onInitialize(async (params) => {
  connection.console.log(
    `[ApexOS Language Server(${process.pid})] Started and initialize received`,
  );

  // Check if initialization contains the token in custom data
  const apexConfig =
    params.initializationOptions &&
    (params.initializationOptions["apexos"] ||
      // Legacy-compat: pre-fork clients send the old section name
      params.initializationOptions["vscode-home-assistant"]);
  
  if (apexConfig) {
    // Extract token
    if (apexConfig.longLivedAccessToken) {
      const token = apexConfig.longLivedAccessToken;
      console.log(`Token provided in initialization options (length: ${token.length}, first 5 chars: ${token.substring(0, 5)}...)`);
      process.env.APEX_TOKEN = token; // Set as environment variable for backup
    } else {
      console.log("No token provided in initialization options");
    }
    
    // Extract ApexOS instance URL
    if (apexConfig.hostUrl) {
      console.log(`ApexOS instance URL provided in initialization options: ${apexConfig.hostUrl}`);
      process.env.APEX_SERVER = apexConfig.hostUrl;
    } else {
      console.log("No ApexOS instance URL provided in initialization options");
    }
  } else {
    console.log("No ApexOS configuration in initialization options");
  }

  const configurationService = new ConfigurationService();
  const apexConnection = new ApexConnection(configurationService);
  const fileAccessor = new VsCodeFileAccessor(params.rootUri, documents);
  const apexConfigInstance = new ApexOSConfiguration(fileAccessor);

  const definitionProviders = [
    new IncludeDefinitionProvider(fileAccessor),
    new ScriptDefinitionProvider(apexConfigInstance),
    new SecretsDefinitionProvider(fileAccessor),
  ];

  const yamlLanguageService = getLanguageService({
    schemaRequestService: async () => "",
    workspaceContext: null,
    telemetry: undefined,
  });

  const sendDiagnostics = (uri: string, diagnostics: Diagnostic[]) => {
    connection.sendDiagnostics({
      uri,
      diagnostics,
    });
  };

  const discoverFilesAndUpdateSchemas = async () => {
    try {
      console.log("Discovering files and updating schemas...");
      await apexConfigInstance.discoverFiles();
      await homeAsisstantLanguageService.findAndApplySchemas();
      console.log("Files discovered and schemas updated successfully");
    } catch (e) {
      console.error(
        `Unexpected error during file discovery / schema configuration: ${e}`,
      );
    }
  };

  const homeAsisstantLanguageService = new ApexOSLanguageService(
    yamlLanguageService,
    apexConfigInstance,
    apexConnection,
    definitionProviders,
    await SchemaServiceForIncludes.create(),
    sendDiagnostics,
    async () => {
      for (const d of documents.all()) {
        const diagnostics =
          await homeAsisstantLanguageService.getDiagnostics(d);
        sendDiagnostics(d.uri, diagnostics);
      }
    },
    configurationService,
  );

  // Setup handlers to notify client about connection status
  apexConnection.onConnectionEstablished = (info) => {
    console.log("ApexOS connection established, notifying client");
    connection.sendNotification("ha_connected", info);
  };
  
  apexConnection.onConnectionFailed = (error) => {
    console.log("ApexOS connection failed, notifying client");
    connection.sendNotification("ha_connection_error", { error: error || "Unknown error" });
  };

  documents.onDidChangeContent((e) =>
    homeAsisstantLanguageService.onDocumentChange(e.document),
  );
  documents.onDidOpen((e) =>
    homeAsisstantLanguageService.onDocumentOpen(e.document),
  );
  documents.onDidClose((e) => {
    // Remove closed documents from file collection to prevent memory leaks
    apexConfigInstance.removeFile(e.document.uri);
  });

  let onDidSaveDebounce: NodeJS.Timeout;
  documents.onDidSave((e) => {
    clearTimeout(onDidSaveDebounce);

    // Only rediscover files if the saved document is likely to contain includes
    // or is a root configuration file. This significantly improves performance
    // for large ApexOS configurations.
    const uri = e.document.uri;
    const isRootConfigFile = uri.endsWith("configuration.yaml") ||
                             uri.endsWith("ui-lovelace.yaml") ||
                             uri.endsWith("automations.yaml");
    const isInBlueprintsFolder = uri.includes("/blueprints/") ||
                                 uri.includes("\\blueprints\\");

    // Check if the document content contains include directives
    const hasIncludes = e.document.getText().match(/!include(_dir_list|_dir_named|_dir_merge_list|_dir_merge_named)?/);

    // Only trigger rediscovery for files that could affect the schema
    if (isRootConfigFile || isInBlueprintsFolder || hasIncludes) {
      // Use a longer debounce timeout to reduce unnecessary rediscoveries
      // This helps when users save multiple files in quick succession
      onDidSaveDebounce = setTimeout(discoverFilesAndUpdateSchemas, 1000);
    }
  });

  connection.onDocumentSymbol((p) =>
    homeAsisstantLanguageService.onDocumentSymbol(
      documents.get(p.textDocument.uri),
    ),
  );
  connection.onDocumentFormatting((p) =>
    homeAsisstantLanguageService.onDocumentFormatting(
      documents.get(p.textDocument.uri),
      p.options,
    ),
  );
  connection.onCompletion((p) =>
    homeAsisstantLanguageService.onCompletion(
      documents.get(p.textDocument.uri),
      p.position,
    ),
  );
  connection.onCompletionResolve((p) =>
    homeAsisstantLanguageService.onCompletionResolve(p),
  );
  connection.onHover((p) =>
    homeAsisstantLanguageService.onHover(
      documents.get(p.textDocument.uri),
      p.position,
    ),
  );
  connection.onDefinition((p) =>
    homeAsisstantLanguageService.onDefinition(
      documents.get(p.textDocument.uri),
      p.position,
    ),
  );

  connection.onDidChangeConfiguration(async (config) => {
    console.log("Received configuration change from VS Code");
    
    // Check for token in incoming configuration before applying changes
    const apexConfig = config.settings && config.settings["apexos"];
    if (apexConfig) {
      if (apexConfig.longLivedAccessToken) {
        const token = apexConfig.longLivedAccessToken;
        console.log(`Token received in configuration update (length: ${token.length}, first 5 chars: ${token.substring(0, 5)}...)`);
      } else {
        console.log("No token in configuration update");
      }
      
      if (apexConfig.hostUrl) {
        console.log(`ApexOS instance URL in configuration update: ${apexConfig.hostUrl}`);
      } else {
        console.log("No ApexOS instance URL in configuration update");
      }
    } else {
      console.log("No ApexOS configuration in update");
    }
    
    // Update the configuration service with the new settings
    configurationService.updateConfiguration(config);
    
    // Notify connection handler to update connection if needed
    await apexConnection.notifyConfigUpdate();

    // Check configuration status after update
    if (!configurationService.isConfigured) {
      console.log("Configuration incomplete after update, sending no-config notification");
      connection.sendNotification("no-config");
    } else {
      console.log("Configuration is valid after update");
    }
  });

  connection.onRequest(
    "callService",
    (args: { domain: string; service: string; serviceData?: any }) => {
      void apexConnection.callService(
        args.domain,
        args.service,
        args.serviceData,
      );
    },
  );

  connection.onRequest("checkConfig", async (_) => {
    const result = await apexConnection.callApi(
      "post",
      "config/core/check_config",
    );
    connection.sendNotification("configuration_check_completed", result);
  });
  connection.onRequest("getErrorLog", async (_) => {
    const result = await apexConnection.callApi("get", "error_log");
    connection.sendNotification("get_eror_log_completed", result);
  });
  connection.onRequest("renderTemplate", async (args: { template: string }) => {
    const timePrefix = `[${new Date().toLocaleTimeString()}] `;
    let outputString = `${timePrefix}Rendering template:\n${args.template}\n\n`;
    
    try {
      const result = await apexConnection.callApi("post", "template", {
        template: args.template,
        strict: true,
      });
      
      // Check if the result is an error object
      if (result && typeof result === "object") {
        if (result.error) {
          // Direct error message
          outputString += `Error:\n${result.error}`;
        } else if (result.message) {
          // Error message in message field
          outputString += `Error:\n${result.message}`;
        } else if (Object.keys(result).length > 0) {
          // For other types of error objects, get a formatted representation
          const errorMessage = JSON.stringify(result, null, 2);
          outputString += `Error:\n${errorMessage}`;
        } else {
          // Just a string representation as fallback
          outputString += `Result:\n${result}`;
        }
      } else {
        outputString += `Result:\n${result}`;
      }
    } catch (error) {
      // Handle API errors or exceptions
      let errorMessage = "Unknown error occurred";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        try {
          // Try to convert error object to a readable string
          errorMessage = JSON.stringify(error, null, 2);
        } catch {
          // If JSON conversion fails, try to extract properties
          if ("message" in error) {
            errorMessage = error.message;
          } else if ("toString" in error && typeof error.toString === "function") {
            errorMessage = error.toString();
          }
        }
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      
      outputString += `Error:\n${errorMessage}`;
    }

    connection.sendNotification("render_template_completed", outputString);
  });

  // fire and forget
  setTimeout(discoverFilesAndUpdateSchemas, 0);

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Full,
      completionProvider: { triggerCharacters: [" "], resolveProvider: true },
      hoverProvider: true,
      documentSymbolProvider: true,
      documentFormattingProvider: true,
      definitionProvider: true,
    } as ServerCapabilities,
  };
});

connection.listen();
