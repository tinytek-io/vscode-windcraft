import { MessageHandler } from "@/rpc/MessageHandler";
import { CurrentLogger } from "@/logger/logger";
import { EventEmitter } from "events";
import * as net from "net";

const logger = new CurrentLogger("[ClientSocket]");

export class ClientSocket<I, O> implements MessageHandler<I, O> {
  private _client: net.Socket;
  private _onIncomingMessage = new EventEmitter<Record<"message", [I]>>();

  constructor(
    private port: number,
    private hostname = "127.0.0.1"
  ) {
    this._client = new net.Socket();

    this._client.connect(this.port, this.hostname, () => {
      logger.log("Connected to server");
    });

    this._client.on("data", (buffer) => {
      logger.log("Received data: " + buffer);
      try {
        const message = JSON.parse(buffer.toString()) as I;
        this._onIncomingMessage.emit("message", message);
      } catch (error) {
        logger.log("Error parsing message: " + error);
      }
    });

    this._client.on("end", () => {
      logger.log("Connection closed");
    });

    this._client.on("error", (error) => {
      logger.log("Error: " + error);
    });
  }

  public onMessage(listener: (message: I) => void) {
    this._onIncomingMessage.on("message", listener);

    return {
      dispose: () => {
        this._onIncomingMessage.off("message", listener);
      },
    };
  }

  public send(message: O) {
    logger.log("Sending message: " + JSON.stringify(message));
    this._client.write(JSON.stringify(message));
  }

  public dispose() {
    logger.log("Disposing request handler");
    this._client.destroy();
    this._onIncomingMessage.removeAllListeners();
  }
}
