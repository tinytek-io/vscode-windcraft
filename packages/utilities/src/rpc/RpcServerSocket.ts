import { ServerSocket } from "../socket/ServerSocket";
import { RpcProvider, RpcProviderFunction, RpcInstance, RpcRequestMessage } from "./RpcInstance";

export class RpcServerSocket<R extends RpcProvider | RpcProviderFunction, E extends string> {
  private rpcInstance: RpcInstance<R, E>;
  private socket: ServerSocket<RpcRequestMessage, RpcRequestMessage>;

  constructor(
    rpcProvider: RpcProvider,
    port: number | [number, number],
    hostname?: string
  ) {
    this.socket = new ServerSocket<RpcRequestMessage, RpcRequestMessage>(port, hostname);
    this.rpcInstance = new RpcInstance(this.socket, rpcProvider);
  }

  get client() {
    return this.rpcInstance.client;
  }

  get port() {
    return this.socket.port;
  }

  get on() {
    return this.rpcInstance.on;
  }

  get emit() {
    return this.rpcInstance.emit;
  }

  public dispose() {
    this.rpcInstance.dispose();
    this.socket.dispose();
  }
}