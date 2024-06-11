import { TimeSpan } from "../lib/TimeSpan";
import { generateUUID } from "../lib/generateUUID";
import { MessageHandler } from "./MessageHandler";
import { CurrentLogger } from "../logger/logger";

const logger = new CurrentLogger("[RpcInstance]");

export type RpcRequestMessage<A extends any[] = any[]> = {
  type: "RPC_REQUEST";
  senderId: string;
  invocationId: string;
  methodName: string;
  args: A;
};

export type RpcResponseMessage<R = any> = {
  type: "RPC_RESPONSE";
  senderId: string;
  invocationId: string;
  result: R;
};

export type RpcErrorResponseMessage = {
  type: "RPC_ERROR_RESPONSE";
  senderId: string;
  invocationId: string;
  error: string;
};

export type RpcEventMessage = {
  type: "RPC_EVENT";
  senderId: string;
  eventName: string;
};

export type RpcMessage =
  | RpcRequestMessage
  | RpcResponseMessage
  | RpcErrorResponseMessage
  | RpcEventMessage;

export type RpcProvider = Record<string, (...args: any[]) => any>;
export type RpcProviderFunction = (...args: any[]) => RpcProvider;

export type PromiseRpcProvider<R extends RpcProvider> = {
  [K in keyof R]: (
    ...args: Parameters<R[K]>
  ) => ReturnType<R[K]> extends Promise<any>
    ? ReturnType<R[K]>
    : Promise<ReturnType<R[K]>>;
};

type GetRpcProvider<T> = T extends RpcProviderFunction ? ReturnType<T> : T;

type EventListener = () => void;

export class RpcInstance<R extends RpcProvider | RpcProviderFunction, E extends string> {
  private _senderId: string = generateUUID();
  private _eventListeners: Record<string, EventListener[]> = {};
  public static TIMEOUT: TimeSpan = TimeSpan.fromSeconds(10);
  private pendingInvocations: Record<string, (result: any) => void> = {};
  private proxy: PromiseRpcProvider<GetRpcProvider<R>> = new Proxy(
    {} as PromiseRpcProvider<GetRpcProvider<R>>,
    {
      get:
        (_, methodName: string) =>
        (...args: unknown[]) => {
          const message: RpcRequestMessage = {
            type: "RPC_REQUEST",
            senderId: this._senderId,
            invocationId: generateUUID(),
            methodName,
            args,
          };
          logger.log("Sending message", message);
          // Make remote call and wait for response event or timeout...
          return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              // On timeout, reject promise
              delete this.pendingInvocations[message.invocationId];
              reject(new Error(`Remote method call "${methodName}" timed out`));
            }, RpcInstance.TIMEOUT.toMilliseconds());
            this.pendingInvocations[message.invocationId] = (
              response: RpcMessage
            ) => {
              // On response, resolve promise and clear timeout
              clearTimeout(timeout);
              if (response.type === "RPC_ERROR_RESPONSE") {
                reject(new Error(response.error));
              } else if (response.type === "RPC_RESPONSE") {
                resolve(response.result);
              }
            };
            this.messageHandler.send(message);
          });
        },
    }
  );

  constructor(
    private messageHandler: MessageHandler<RpcMessage, RpcMessage>,
    provider: RpcProvider
  ) {
    // Wait for event to invoke the proxy or provider method
    messageHandler.onMessage(async (message) => {
      logger.log("Received message", message);
      if (message.senderId === this._senderId) {
        // Ignore messages from self
        return;
      }
      switch (message.type) {
        case "RPC_ERROR_RESPONSE":
        case "RPC_RESPONSE": {
          const invocation = this.pendingInvocations[message.invocationId];
          if (invocation) {
            delete this.pendingInvocations[message.invocationId];
            invocation(message);
          }
          break;
        }
        case "RPC_REQUEST": {
          const { methodName, args, invocationId } = message;
          const method = provider[methodName];
          if (!method) {
            this.messageHandler.send({
              type: "RPC_ERROR_RESPONSE",
              senderId: this._senderId,
              invocationId,
              error: `Method "${methodName}" not found`,
            });
          }
          try {
            const result = method(...args);
            this.messageHandler.send({
              type: "RPC_RESPONSE",
              senderId: this._senderId,
              invocationId,
              result: result instanceof Promise ? await result : result,
            });
          } catch (error) {
            this.messageHandler.send({
              type: "RPC_ERROR_RESPONSE",
              senderId: this._senderId,
              invocationId,
              error:
                error instanceof Error
                  ? error.message
                  : `${error || "unknown error"}`,
            });
          }
          break;
        }
        case "RPC_EVENT": {
          const { eventName } = message;
          const listeners = this._eventListeners[eventName] ?? [];
          for (const listener of listeners) {
            try {
              listener();
            } catch (error) {
              logger.error(`Error in event listener for "${eventName}"`, error);
            }
          }
          break;
        }
      }
    });
  }

  get client() {
    return this.proxy;
  }

  emit(eventName: E) {
    this.messageHandler.send({
      type: "RPC_EVENT", eventName,
      senderId: this._senderId,
    });
  }

  on(eventName: E, listener: EventListener) {
    if (!this._eventListeners[eventName]) {
      this._eventListeners[eventName] = [];
    }
    this._eventListeners[eventName].push(listener);

    return () => {
      this._eventListeners[eventName] = this._eventListeners[eventName].filter(
        (l) => l !== listener
      );
    };
  }

  dispose(): void {
    // this.messageHandler.dispose();
    Object.keys(this._eventListeners).forEach((eventName) => {
      delete this._eventListeners[eventName];
    });
  }
}
