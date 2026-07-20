import * as vscode from "vscode";
import { AuthManager } from "./manager";

/**
 * Repair the ApexOS authentication configuration (token and ApexOS instance URL)
 * This function addresses common migration and storage issues for both token and URL.
 */
export async function repairAuthConfiguration(context: vscode.ExtensionContext): Promise<void> {
  const config = vscode.workspace.getConfiguration("apexos");
  
  // Get current state for token
  const settingsToken = config.get<string>("longLivedAccessToken");
  const secretToken = await AuthManager.getToken(context);
  
  // Get current state for URL
  const settingsUrl = config.get<string>("hostUrl");
  const secretUrl = await AuthManager.getUrl(context);

  let issuesFixed = false;
  const messages: string[] = [];

  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBar.text = "Repairing ApexOS authentication...";
  statusBar.show();

  try {
    // --- Token Repair Logic ---
    if (settingsToken && !secretToken) {
      await AuthManager.storeToken(context, settingsToken);
      await config.update("longLivedAccessToken", undefined, vscode.ConfigurationTarget.Global);
      messages.push("Token migrated from settings to secure storage.");
      issuesFixed = true;
    } else if (settingsToken && secretToken) {
      await config.update("longLivedAccessToken", undefined, vscode.ConfigurationTarget.Global);
      messages.push("Duplicate token in settings.json removed; secure token kept.");
      issuesFixed = true;
    } else if (!settingsToken && !secretToken) {
      messages.push("No token found. Please set one using 'Manage ApexOS Authentication'.");
    } else {
      messages.push("Token is correctly stored securely.");
    }

    // --- URL Repair Logic ---
    if (settingsUrl && !secretUrl) {
      await AuthManager.storeUrl(context, settingsUrl);
      await config.update("hostUrl", undefined, vscode.ConfigurationTarget.Global);
      messages.push("ApexOS instance URL migrated from settings to secure storage.");
      issuesFixed = true;
    } else if (settingsUrl && secretUrl) {
      await config.update("hostUrl", undefined, vscode.ConfigurationTarget.Global);
      messages.push("Duplicate ApexOS instance URL in settings.json removed; secure URL kept.");
      issuesFixed = true;
    } else if (!settingsUrl && !secretUrl) {
      messages.push("No ApexOS instance URL found. Please set one using 'Manage ApexOS Authentication'.");
      // Prompt to set URL if not found at all
      const newUrl = await vscode.window.showInputBox({
        prompt: "Enter your ApexOS instance URL (e.g., http://apexos.local:1702)",
        placeHolder: "http://apexos.local:1702",
        ignoreFocusOut: true,
      });
      if (newUrl) {
        await AuthManager.storeUrl(context, newUrl);
        messages.push(`ApexOS instance URL set to: ${newUrl}`);
        issuesFixed = true;
      }
    } else {
      messages.push("ApexOS instance URL is correctly stored securely.");
    }

    if (issuesFixed) {
      vscode.window.showInformationMessage(
        `ApexOS auth repair complete: ${messages.join(" ")}`
      );
    } else {
      vscode.window.showInformationMessage(
        `ApexOS auth check complete: ${messages.join(" ")}`
      );
    }

  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to repair auth configuration: ${error.message}`
    );
  } finally {
    statusBar.dispose();
  }
}
