import * as vscode from "vscode";
import * as net from "net";
import { CurrentLogger } from "../logger/logger";
import { MessageHandler } from "../rpc/MessageHandler";

const logger = new CurrentLogger("[ServerSocket]");

type SocketError = Error & { code: string };
export class ServerSocket<I, O> implements MessageHandler<I, O> {
  private _data: string = "";
  private _port: Promise<number>;
  private _resolvePort: (error: Error | null, port: number) => void = () => {};
  private _server: net.Server;
  private _onIncomingMessage = new vscode.EventEmitter<I>();
  private _onOutgoingMessage = new vscode.EventEmitter<O>();

  constructor(port: number | [number, number], hostname = "127.0.0.1") {
    this._port = new Promise((resolve, reject) => {
      this._resolvePort = (error, port) => {
        if (error) {
          reject(error);
        } else {
          resolve(port);
        }
      };
    });
  
    this._server = net.createServer((socket) => {
      logger.log("Client connected");
      socket.pipe(socket);

      const outgoingEventlistener = this._onOutgoingMessage.event((message) => {
        socket.write(JSON.stringify(message) + "\n");
      });

      socket.on("end", () => {
        logger.log("Client disconnected");
        outgoingEventlistener.dispose();
      });

      socket.on("data", (buffer) => {
        logger.log("Received", buffer.toString());
        this._data += buffer.toString();
        const messages = this._data.split("\n"); // Split messages by newline
        this._data = messages.pop() ?? ""; // Remove last empty message or incomplete message
        messages.forEach((messageJson) => {
          try {
            this._onIncomingMessage.fire(JSON.parse(messageJson));
          } catch (error) {
            logger.error("DataError", error);
          }
        });
      });

      socket.on("error", (error: SocketError) => {
        logger.error("Socket Error", error);

      });
    });

    const [minPort, maxPort] = Array.isArray(port) ? port : [port, port];
    let currentPort = minPort;

    this._server.on("error", (error: SocketError) => {
      logger.error("Server Error", error);
      if (error.code === "EADDRINUSE") {
        currentPort++;
        if (currentPort > maxPort) {
          logger.error("No available ports");
          this._server.close();
          this._resolvePort(new Error("No available ports"), currentPort);
        } else {
          // Retry on next port
          this._server.close();
          logger.log("Retrying on new port", currentPort);
          this._server.listen(currentPort, hostname, () => {
            logger.log("Listening on port", currentPort);
            this._resolvePort(null, currentPort);
          });
        }
      }
    });

    logger.log("Trying to listen on port", currentPort);
    this._server.listen(currentPort, hostname, () => {
      logger.log("Listening on port", currentPort);
      this._resolvePort(null, currentPort);
    });
  }

  public send(message: O) {
    this._onOutgoingMessage.fire(message);
  }

  public onMessage(listener: (message: I) => void): vscode.Disposable {
    return this._onIncomingMessage.event(listener);
  }

  public get port() {
    return this._port;
  }

  dispose() {
    this._onIncomingMessage.dispose();
    this._onOutgoingMessage.dispose();
    this._server.close();
  }
}
