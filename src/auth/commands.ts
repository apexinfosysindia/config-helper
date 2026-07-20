import * as vscode from "vscode";
import { AuthManager } from "./manager";

/**
 * Command to manage the ApexOS authentication (token and instance URL)
 */
export async function manageAuth(context: vscode.ExtensionContext): Promise<void> {
  const actions = [
    "Set ApexOS Instance URL",
    "Set Token",
    "Clear Token",
    "Clear ApexOS Instance URL",
    "View Auth Details (Obscured)",
    "Test Connection",
  ];
  
  const selectedAction = await vscode.window.showQuickPick(actions, {
    placeHolder: "Select an authentication action"
  });
  
  if (!selectedAction) {
    return;
  }
  
  switch (selectedAction) {
    case "Set ApexOS Instance URL":
      await setInstanceUrl(context);
      break;
    case "Set Token":
      await setToken(context);
      break;
    case "Clear Token":
      await clearToken(context);
      break;
    case "Clear ApexOS Instance URL":
      await clearInstanceUrl(context);
      break;
    case "View Auth Details (Obscured)":
      await viewAuthDetails(context);
      break;
    case "Test Connection": 
      await testConnection(context);
      break;
  }
}

async function setToken(context: vscode.ExtensionContext): Promise<void> {
  // First, check if we need to set the instance URL
  // Try to get URL from SecretStorage first
  let currentUrl = await AuthManager.getUrl(context);
  
  // If not in SecretStorage, check settings and environment
  if (!currentUrl) {
    const config = vscode.workspace.getConfiguration("apexos");
    currentUrl = config.get<string>("hostUrl") || (process.env.APEX_SERVER || process.env.HASS_SERVER) || 
      (process.env.SUPERVISOR_TOKEN ? "http://supervisor/core" : "");
  }
  
  // Ask for instance URL if not already configured
  let instanceUrl = currentUrl;
  
  // Always ask for the instance URL for verification
  instanceUrl = await vscode.window.showInputBox({
    prompt: "Enter your ApexOS instance URL",
    placeHolder: "http://apexos.local:1702",
    value: currentUrl || "http://apexos.local:1702", // Pre-fill default if currentUrl is empty
    validateInput: (input) => {
      // Basic URL validation
      try {
        if (!input) {
          return "ApexOS instance URL is required";
        }
        
        const url = new URL(input);
        if (!url.protocol.startsWith("http")) {
          return "URL must start with http:// or https://";
        }
        
        return null; // Valid input
      } catch {
        return "Please enter a valid URL (e.g., http://apexos.local:1702)";
      }
    }
  });
  
  // User canceled the instance URL input
  if (!instanceUrl) {
    return;
  }
  
  // Save the instance URL
  if (instanceUrl !== currentUrl) {
    try {
      // Store in SecretStorage
      await AuthManager.storeUrl(context, instanceUrl);
      
      // Remove from settings if it exists
      const config = vscode.workspace.getConfiguration("apexos");
      if (config.get("hostUrl") !== undefined) {
        await config.update("hostUrl", undefined, vscode.ConfigurationTarget.Global);
      }
      
      vscode.window.showInformationMessage(`ApexOS instance URL has been securely stored: ${instanceUrl}`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to store ApexOS instance URL: ${error.message}`);
      return; // Don't proceed to token if URL failed
    }
  }

  const token = await vscode.window.showInputBox({
    prompt: "Enter your ApexOS Long-Lived Access Token",
    password: true,
    placeHolder: "eyJhbGci..."
  });
  
  if (token) {
    try {
      await AuthManager.storeToken(context, token);
      // Remove from settings if it exists
      const config = vscode.workspace.getConfiguration("apexos");
      if (config.get("longLivedAccessToken") !== undefined) {
        await config.update("longLivedAccessToken", undefined, vscode.ConfigurationTarget.Global);
      }
      vscode.window.showInformationMessage("ApexOS token has been securely stored.");
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to store token: ${error.message}`);
    }
  } else {
    vscode.window.showWarningMessage("No token was entered.");
  }
}

async function clearToken(context: vscode.ExtensionContext): Promise<void> {
  const confirmation = await vscode.window.showWarningMessage(
    "Are you sure you want to clear the stored ApexOS token?",
    { modal: true },
    "Yes"
  );
  
  if (confirmation === "Yes") {
    try {
      await AuthManager.deleteToken(context);
      vscode.window.showInformationMessage("ApexOS token has been cleared.");
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to clear token: ${error.message}`);
    }
  }
}

async function viewAuthDetails(context: vscode.ExtensionContext): Promise<void> {
  const token = await AuthManager.getToken(context);
  const url = await AuthManager.getUrl(context);
  
  if (token || url) {
    let message = "Current ApexOS Authentication Details:\n";
    if (url) {
      message += `\nApexOS Instance URL: ${url}`;
    } else {
      message += "\nApexOS Instance URL: Not set";
    }
    if (token) {
      const obscuredToken = token.length <= 10 
        ? "***" 
        : `${token.substring(0, 5)}...${token.substring(token.length - 5)}`;
      message += `\nToken: ${obscuredToken}`;
    } else {
      message += "\nToken: Not set";
    }
    vscode.window.showInformationMessage(message, { modal: true });
  } else {
    vscode.window.showInformationMessage("No ApexOS token or instance URL is currently stored.");
  }
}

export async function testConnection(context: vscode.ExtensionContext): Promise<void> {
  const token = await AuthManager.getToken(context);
  const hostUrl = await AuthManager.getUrl(context);
  
  if (!hostUrl) {
    vscode.window.showErrorMessage(
      "ApexOS instance URL is not set. Please set it first."
    );
    // Optionally, prompt to set it now
    const setNow = await vscode.window.showQuickPick(["Set ApexOS Instance URL Now"], {
      placeHolder: "ApexOS instance URL is missing",
    });
    if (setNow === "Set ApexOS Instance URL Now") {
      await setInstanceUrl(context);
      // Re-check after attempting to set
      const newHostUrl = await AuthManager.getUrl(context);
      if (!newHostUrl) {
        return; // User cancelled or failed to set
      }
      // If token is also missing, prompt for that too or guide user
      if (!token) {
        vscode.window.showInformationMessage("ApexOS instance URL set. Now please ensure your token is also set via the 'Set Token' command.");
        return;
      }
      // If both are now set, continue with the test
      await testConnection(context);
    }
    return;
  }
  
  if (!token) {
    vscode.window.showErrorMessage(
      "ApexOS token is not set. Please set it first."
    );
    // Optionally, prompt to set it now
    const setNow = await vscode.window.showQuickPick(["Set Token Now"], {
      placeHolder: "Token is missing",
    });
    if (setNow === "Set Token Now") {
      await setToken(context); 
      // Re-check after attempting to set
      const newToken = await AuthManager.getToken(context);
      if (!newToken) {
        return; // User cancelled or failed to set
      }
      // If token is now set, continue with the test
      await testConnection(context); 
    }
    return;
  }
  
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Testing ApexOS Connection",
      cancellable: false,
    },
    async (progress) => {
      progress.report({ increment: 0, message: "Connecting..." });
      
      try {
        const response = await fetch(`${hostUrl}/api/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        progress.report({ increment: 50, message: "Validating response..." });
        
        if (response.ok) {
          const data: any = await response.json(); // Add type assertion to any
          if (data.message === "API running.") {
            progress.report({ increment: 100, message: "Connection successful!" });
            vscode.window.showInformationMessage(
              `Successfully connected to ApexOS at ${hostUrl}. API is running.`
            );
          } else {
            progress.report({ increment: 100, message: "Connection failed." });
            vscode.window.showErrorMessage(
              `Connected to ApexOS at ${hostUrl}, but API response was unexpected: ${data.message || "No message"}`
            );
          }
        } else {
          progress.report({ increment: 100, message: "Connection failed." });
          let errorMessage = `Failed to connect to ApexOS at ${hostUrl}. Status: ${response.status} ${response.statusText}`;
          try {
            const errorBody: any = await response.json(); // Add type assertion to any
            if (errorBody && errorBody.message) {
              errorMessage += ` - ${errorBody.message}`;
            }
          } catch {
            // Ignore if error body is not JSON or doesn't have message
          }
          vscode.window.showErrorMessage(errorMessage);
        }
      } catch (error) {
        progress.report({ increment: 100, message: "Connection error." });
        vscode.window.showErrorMessage(
          `Error connecting to ApexOS at ${hostUrl}: ${error.message}`
        );
      }
    }
  );
}

async function setInstanceUrl(context: vscode.ExtensionContext): Promise<void> {
  const currentUrl = await AuthManager.getUrl(context);
  
  const newUrl = await vscode.window.showInputBox({
    prompt: "Enter your ApexOS instance URL",
    placeHolder: "http://apexos.local:1702",
    value: currentUrl || "http://apexos.local:1702", // Pre-fill default if currentUrl is empty
    validateInput: (input) => {
      // Basic URL validation
      try {
        if (!input) {
          return "ApexOS instance URL is required";
        }
        
        const url = new URL(input);
        if (!url.protocol.startsWith("http")) {
          return "URL must start with http:// or https://";
        }
        
        return null; // Valid input
      } catch {
        return "Please enter a valid URL (e.g., http://apexos.local:1702)";
      }
    }
  });
  
  if (newUrl && newUrl !== currentUrl) {
    try {
      await AuthManager.storeUrl(context, newUrl);
      // Remove from settings if it exists
      const config = vscode.workspace.getConfiguration("apexos");
      if (config.get("hostUrl") !== undefined) {
        await config.update("hostUrl", undefined, vscode.ConfigurationTarget.Global);
      }
      vscode.window.showInformationMessage(`ApexOS instance URL has been securely stored: ${newUrl}`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to store ApexOS instance URL: ${error.message}`);
    }
  } else if (!newUrl) {
    vscode.window.showWarningMessage("No ApexOS instance URL was entered.");
  } else {
    vscode.window.showInformationMessage("ApexOS instance URL is already up to date.");
  }
}

async function clearInstanceUrl(context: vscode.ExtensionContext): Promise<void> {
  const confirmation = await vscode.window.showWarningMessage(
    "Are you sure you want to clear the stored ApexOS instance URL?",
    { modal: true },
    "Yes"
  );

  if (confirmation === "Yes") {
    try {
      await AuthManager.deleteUrl(context);
      vscode.window.showInformationMessage("ApexOS instance URL has been cleared.");
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to clear ApexOS instance URL: ${error.message}`);
    }
  }
}
