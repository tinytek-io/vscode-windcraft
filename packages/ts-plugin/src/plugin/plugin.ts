import type * as ts from "typescript/lib/tsserverlibrary";
import path from "path";
import { RpcClientSocket } from "@windcraft/utilities/rpc/RpcClientSocket";
import { FileLogger } from "@windcraft/utilities/logger/FileLogger";
import { setCurrentLogger, logger } from "@windcraft/utilities/logger/logger";
import type { PluginConfiguration } from "./PluginConfiguration";
import { startPollProgramCompilation } from "./startPollProgramCompilation";
import { type PluginRpcProviderEvent, createPluginRpcProvider } from "./createPluginRpcProvider";
import type { ExtensionRpcProvider } from "../extension/createExtensionRpcProvider";

const LANGUAGE_SERVICE_MODE_SEMANTIC = 0;

// Set the logger to file logger for debugging in the TypeScript Plugin
setCurrentLogger(new FileLogger(path.join(__dirname, "..", "..", "log.txt")));

logger.log("Imported -");

const factory: ts.server.PluginModuleFactory = (mod) => {
  logger.log("Loaded @windcraft/ts-plugin factory");
  let client: RpcClientSocket<ExtensionRpcProvider, PluginRpcProviderEvent> | undefined;
  let start: ((port: number) => void) | undefined;

  return {
    create(info) {
      if (info.project.projectService.serverMode !== LANGUAGE_SERVICE_MODE_SEMANTIC) {
        logger.log("SKIP - Not semantic mode");
        return info.languageService;
      } else {
        logger.log("OK - Semantic mode");
      }

      // Start polling for program compilation events
      startPollProgramCompilation(() => {
        logger.log("Program compiled");
        client?.emit("programCompile");
      }, info.languageService);

      const config = info.config as Partial<PluginConfiguration> | undefined;

      logger.log("Creating server" + JSON.stringify(config));

      // Start the server
      start = (port) => {
        logger.log("Starting client...");
        client?.dispose();
        client = new RpcClientSocket<ExtensionRpcProvider, PluginRpcProviderEvent>(
          createPluginRpcProvider(info.languageService, mod.typescript),
          port
        );

        client.emit("clientReady");
      };

      if (config?.port) {
        start(config.port);
      }

      return info.languageService;
    },
    onConfigurationChanged(config: Partial<PluginConfiguration>) {
      logger.log("Config changed" + JSON.stringify(config));
      if (config.port && start) {
        start(config.port);
      }
    }
  };
};

export default factory;
