import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

const host = "localhost";
const port = 8090;

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    filenameHash: false,
  },
  server: {
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
