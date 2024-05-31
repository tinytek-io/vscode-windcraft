import * as path from "path";
import type { Configuration } from "@rspack/cli";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

const tsServerPluginConfig: Configuration = {
  mode: "development",
  target: "node",
  entry: "./src/index.ts",
  resolve: {
    tsConfigPath: path.resolve(__dirname, "tsconfig.json"),
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist/server"),
    filename: "index.js",
    library: {
      type: "commonjs2",
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
            },
          },
        },
        type: "javascript/auto",
      },
    ],
  },
  devtool: "nosources-source-map",
  infrastructureLogging: {
    level: "log", // enables logging required for problem matchers
  },
  plugins: [
    // @ts-ignore
    new ForkTsCheckerWebpackPlugin(),
  ],
};

module.exports = [tsServerPluginConfig];