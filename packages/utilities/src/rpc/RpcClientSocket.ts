import { ClientSocket } from "../socket/ClientSocket";
import { RpcProvider, RpcProviderFunction, RpcInstance, RpcRequestMessage } from "./RpcInstance";

export class RpcClientSocket<R extends RpcProvider | RpcProviderFunction, E extends string> {
  private rpcInstance: RpcInstance<R, E>;
  private socket: ClientSocket<RpcRequestMessage, RpcRequestMessage>;

  constructor(
    rpcProvider: RpcProvider,
    port: number,
    hostname?: string
  ) {
    this.socket = new ClientSocket<RpcRequestMessage, RpcRequestMessage>(port, hostname);
    this.rpcInstance = new RpcInstance(this.socket, rpcProvider);
  }

  get client() {
    return this.rpcInstance.client;
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