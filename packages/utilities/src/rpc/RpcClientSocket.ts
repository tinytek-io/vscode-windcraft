import { ClientSocket } from "../socket/ClientSocket";
import { RpcProvider, RpcProviderFunction, RpcInstance, RpcRequestMessage, DefaultEventMap } from "./RpcInstance";

export class RpcClientSocket<R extends RpcProvider | RpcProviderFunction, E extends DefaultEventMap> extends RpcInstance<R, E> {
  private socket: ClientSocket<RpcRequestMessage, RpcRequestMessage>;

  constructor(
    rpcProvider: RpcProvider,
    port: number,
    hostname?: string
  ) {
    const socket = new ClientSocket<RpcRequestMessage, RpcRequestMessage>(port, hostname);
    super(socket, rpcProvider);

    this.socket = socket;
  }

  public dispose() {
    super.dispose();
    this.socket.dispose();
  }
}