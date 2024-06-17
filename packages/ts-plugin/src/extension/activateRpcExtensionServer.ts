import { RpcServerSocket } from "@windcraft/utilities/rpc/RpcServerSocket";
import type * as vscode from "vscode";
import { extensionRpcProvider } from "./createExtensionRpcProvider";
import type { PluginRpcProvider, PluginRpcProviderEvent } from "../plugin/createPluginRpcProvider";
import { configurePlugin } from "./configurePlugin";
import { CurrentLogger } from "@windcraft/utilities/logger/logger";
import { TimeSpan } from "@windcraft/utilities/lib/TimeSpan";

const logger = new CurrentLogger("[activateRpcExtensionServer]");

export async function activateRpcExtensionServer(context: vscode.ExtensionContext) {
  const rpcServerSocket = new RpcServerSocket<PluginRpcProvider, PluginRpcProviderEvent>(
    extensionRpcProvider(),
    [55000, 55500]
  );
  context.subscriptions.push(rpcServerSocket);

  const port = await rpcServerSocket.port;
  logger.log("Server started on port", port);

  const clientReady = new Promise<void>((resolve, reject) => {
    let release: () => void = () => {};

    const timeout = setTimeout(() => {
      release();
      reject(new Error("Client did not connect"));
    }, TimeSpan.fromSeconds(10).toMilliseconds());

    release = rpcServerSocket.on("clientReady", () => {
      clearTimeout(timeout);
      release();
      resolve();
    });
  });

  await configurePlugin(port);
  logger.log("Plugin configured");
  await clientReady;
  logger.log("Client connected");

  return rpcServerSocket;
}
