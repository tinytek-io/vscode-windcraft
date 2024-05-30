import { Extension, Uri, extensions } from "vscode";
import type { PluginConfiguration } from "../PluginConfiguration";
import getPort, { portNumbers } from "get-port";
import { TypeScriptServerApi } from "./TypeScriptServerApi";

const TYPESCRIPT_EXTENSION_ID = "vscode.typescript-language-features";
const WINDCRAFT_TS_PLUGIN_ID = "windcraft-ts-plugin";

type TypeScriptServerPlugin = {
  readonly extension: Extension<unknown>;
  readonly uri: Uri;
  readonly name: string;
  readonly enableForWorkspaceTypeScriptVersions: boolean;
  readonly languages: ReadonlyArray<string>;
  readonly configNamespace?: string;
};

type PluginManager = {
  _pluginConfigurations: Map<string, {}>;
  _plugins?: Map<string, ReadonlyArray<TypeScriptServerPlugin>>;
  plugins: ReadonlyArray<TypeScriptServerPlugin>;
  setConfiguration(pluginId: string, configuration: {}): void;
  configurations(): IterableIterator<[string, {}]>;
  readPlugins(): Map<string, ReadonlyArray<TypeScriptServerPlugin>>;
};

type ApiV0 = {
  configurePlugin(pluginId: string, configuration: PluginConfiguration): void;
  _pluginManager: PluginManager;
};

export async function createTypeScriptServer(): Promise<TypeScriptServerApi | undefined> {
  // ref: https://code.visualstudio.com/api/references/contribution-points#Plugin-configuration
  // Get the TS extension
  const tsExtension = extensions.getExtension(TYPESCRIPT_EXTENSION_ID);
  if (!tsExtension) {
    return;
  }

  await tsExtension.activate();

  const api = tsExtension.exports?.getAPI(0) as ApiV0 | undefined;
  if (!api) {
    return;
  }

  if (api.configurePlugin == null) {
    throw new Error("WindCraft TS Plugin: configurePlugin is not available");
  }

  const port = await getPort({
    port: portNumbers(55000, 55500),
  });

  // console.log("WindCraft TS Plugin: api", api, "TypeOf:", typeof api.configurePlugin);
  // console.log("WindCraft TS Plugin: api.configurePlugin", api.configurePlugin.toString());

  api.configurePlugin(WINDCRAFT_TS_PLUGIN_ID, {
    port,
  });

  console.log("WindCraft TS Plugin: plugins", api._pluginManager.plugins);
  console.log("WindCraft TS Plugin: configurations", [
    ...api._pluginManager.configurations(),
  ]);

  return new TypeScriptServerApi(port);
}
