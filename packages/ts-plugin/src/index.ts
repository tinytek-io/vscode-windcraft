import type * as ts from "typescript/lib/tsserverlibrary";

import express from "express";
import * as http from "http";
import type { PluginConfiguration } from "./PluginConfiguration";
import { LANGUAGE_SERVICE_MODE_SEMANTIC } from "./constants";
import { log } from "./lib/log";
import { readyCheckController } from "./controllers/readyCheck";
import { typescriptProgramMiddleware } from "./middleware/typescriptProgram";
import router from "./router";
import { startPollProgramCompilation } from "./lib/programCompiledEvent";

log("Imported -");

const factory: ts.server.PluginModuleFactory = (mod) => {
  log("Loaded");

  let server: http.Server | undefined;
  let start: ((port: number) => void) | undefined;

  return {
    create(info) {
      if (
        info.project.projectService.serverMode !==
        LANGUAGE_SERVICE_MODE_SEMANTIC
      ) {
        log("SKIP - Not semantic mode");
        return info.languageService;
      }

      // Start polling for program compilation events
      startPollProgramCompilation(info.languageService);

      const config = info.config as Partial<PluginConfiguration> | undefined;

      log("Creating server" + JSON.stringify(config));

      const app = express();
      app.use(express.json());
      app.get("/ready-check", readyCheckController);

      // TypeScript program is required for all requests but ready-check
      app.use(
        typescriptProgramMiddleware(
          info.languageServiceHost,
          info.languageService,
          mod.typescript
        )
      );

      app.use(router);

      // Start the server
      start = (port) => {
        log("Starting server...");
        server?.close();
        server = app.listen(port, () => {
          log(`Listening on port ${port}`);
        });
      };

      if (config?.port) {
        start(config.port);
      }

      return info.languageService;
    },
    onConfigurationChanged(config: Partial<PluginConfiguration>) {
      log("Config changed" + JSON.stringify(config));
      if (config.port && start) {
        start(config.port);
      }
    },
  };
};

export = factory;
