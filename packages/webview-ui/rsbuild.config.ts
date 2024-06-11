import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";

const host = "localhost";
const port = 8090;

export default defineConfig({
  plugins: [
    // @ts-ignore
    pluginTypeCheck({
      forkTsCheckerOptions: {
        async: true,
      },
    }),
    pluginReact(),
  ],
  source: {
    entry: {
      index: "./src/index.tsx",
    },
  },
  output: {
    distPath: {
      root: "../../dist/webview-ui",
    },
    cleanDistPath: true,
    filenameHash: false,
  },
  server: {
    strictPort: true,
    port,
  },
  dev: {
    assetPrefix: `http://${host}:${port}/`,
    writeToDisk: true,
    client: {
      host,
      port: `${port}`,
    },
  },
  performance: {
    chunkSplit: {
      strategy: "all-in-one",
    },
  },
});
