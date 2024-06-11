import { ServerSocket } from "../socket/ServerSocket";
import { RpcProvider, RpcProviderFunction, RpcInstance, RpcRequestMessage, DefaultEventMap } from "./RpcInstance";

export class RpcServerSocket<R extends RpcProvider | RpcProviderFunction, E extends DefaultEventMap> extends RpcInstance<R, E> {
  private socket: ServerSocket<RpcRequestMessage, RpcRequestMessage>;

  constructor(
    rpcProvider: RpcProvider,
    port: number | [number, number],
    hostname?: string
  ) {
    const socket = new ServerSocket<RpcRequestMessage, RpcRequestMessage>(port, hostname);
    super(socket, rpcProvider);

    this.socket = socket;
  }

  get port() {
    return this.socket.port;
  }
 
  public dispose() {
    super.dispose();
    this.socket.dispose();
  }
}