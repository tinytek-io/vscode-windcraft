import { RpcServerSocket } from "@windcraft/utilities/rpc/RpcServerSocket";
import * as vscode from "vscode";
import { extensionRpcProvider } from "./createExtensionRpcProvider";
import type {
  PluginRpcProvider,
  PluginRpcProviderEvent,
} from "../plugin/createPluginRpcProvider";
import { configurePlugin } from "./configurePlugin";

export async function activateRpcExtensionServer(
  context: vscode.ExtensionContext
) {
  const rpcServerSocket = new RpcServerSocket<
    PluginRpcProvider,
    PluginRpcProviderEvent
  >(extensionRpcProvider(), [55000, 55500]);
  context.subscriptions.push(rpcServerSocket);

  const port = await rpcServerSocket.port;

  await configurePlugin(port);

  return rpcServerSocket;
}
