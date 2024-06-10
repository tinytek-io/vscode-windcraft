import * as vscode from "vscode";
import type { PluginConfiguration } from "../plugin/PluginConfiguration";

type ApiV0 = {
  configurePlugin(pluginId: string, configuration: PluginConfiguration): void;
  onCompletionAccepted: vscode.Event<vscode.CompletionItem>;
};

type TsLanguageFeatures = {
  getAPI(version: 0): ApiV0 | undefined;
};

const TYPESCRIPT_EXTENSION_ID = "vscode.typescript-language-features";
const WINDCRAFT_TS_PLUGIN_ID = "@windcraft/ts-plugin";

export async function configurePlugin(port: number) {
  // ref: https://code.visualstudio.com/api/references/contribution-points#Plugin-configuration
  // Get the TS extension
  const tsExtension = vscode.extensions.getExtension<TsLanguageFeatures>(
    TYPESCRIPT_EXTENSION_ID
  );
  if (!tsExtension) {
    return;
  }

  await tsExtension.activate();
  const api = tsExtension.exports.getAPI(0);

  if (!api) {
    return;
  }

  if (api.configurePlugin == null) {
    return;
  }

  console.log(
    "[TYPESCRIPT SERVER] Configure plugin",
    WINDCRAFT_TS_PLUGIN_ID,
    "on port",
    port
  );
  api.configurePlugin(WINDCRAFT_TS_PLUGIN_ID, {
    port,
  });
}
