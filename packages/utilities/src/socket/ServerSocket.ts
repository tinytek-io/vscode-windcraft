import * as vscode from "vscode";
import * as net from "net";
import { CurrentLogger } from "@/logger";
import { MessageHandler } from "@/rpc/MessageHandler";

const logger = new CurrentLogger("[ServerSocket]");

export class ServerSocket<I, O> implements MessageHandler<I, O> {
  private _server: net.Server;
  private _onIncomingMessage = new vscode.EventEmitter<I>();
  private _onOutgoingMessage = new vscode.EventEmitter<O>();

  constructor(
    private port: number,
    private hostname = "127.0.0.1"
  ) {
    this._server = net.createServer((socket) => {
      logger.log("Client connected");
      socket.pipe(socket);

      const outgoingEventlistener = this._onOutgoingMessage.event((message) => {
        socket.write(JSON.stringify(message));
      });

      socket.on("end", () => {
        logger.log("Client disconnected");
        outgoingEventlistener.dispose();
      });

      socket.on("data", (buffer) => {
        logger.log("Received", buffer.toString());
        try {
          this._onIncomingMessage.fire(JSON.parse(buffer.toString()));
        } catch (error) {
          logger.error("DataError", error);
        }
      });

      socket.on("error", (error) => {
        logger.error("Error", error);
      });
    });

    logger.log("Listening on port", this.port);
    this._server.listen(this.port, this.hostname);
  }

  public send(message: O) {
    this._onOutgoingMessage.fire(message);
  }

  public onMessage(listener: (message: I) => void): vscode.Disposable {
    return this._onIncomingMessage.event(listener);
  }

  dispose() {
    this._onIncomingMessage.dispose();
    this._onOutgoingMessage.dispose();
    this._server.close();
  }
}
