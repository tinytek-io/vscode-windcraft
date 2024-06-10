import { TimeSpan } from "@/lib/TimeSpan";
import { generateUUID } from "@/lib/generateUUID";
import { MessageHandler } from "./MessageHandler";

export type RpcRequestMessage<A extends any[] = any[]> = {
  type: "RPC_REQUEST";
  invocationId: string;
  methodName: string;
  args: A;
};

export type RpcResponseMessage<R extends any = any> = {
  type: "RPC_RESPONSE";
  invocationId: string;
  result: R;
};

export type RpcErrorResponseMessage = {
  type: "RPC_ERROR_RESPONSE";
  invocationId: string;
  error: string;
};

export type RpcMessage =
  | RpcRequestMessage
  | RpcResponseMessage
  | RpcErrorResponseMessage;

export type RpcProvider = Record<string, (...args: any[]) => any>;

export type PromiseRpcProvider<R extends RpcProvider> = {
  [K in keyof R]: (
    ...args: Parameters<R[K]>
  ) => ReturnType<R[K]> extends Promise<any>
    ? ReturnType<R[K]>
    : Promise<ReturnType<R[K]>>;
};

export class RpcInstance<R extends RpcProvider> {
  public static TIMEOUT: TimeSpan = TimeSpan.fromSeconds(5);
  private pendingInvocations: Record<string, (result: any) => void> = {};
  private proxy: PromiseRpcProvider<R> = new Proxy(
    {} as PromiseRpcProvider<R>,
    {
      get:
        (_, methodName: string) =>
        (...args: unknown[]) => {
          const message: RpcRequestMessage = {
            type: "RPC_REQUEST",
            invocationId: generateUUID(),
            methodName,
            args,
          };
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
    provider: Record<string, (...args: any[]) => any>
  ) {
    // Wait for event to invoke the proxy or provider method
    messageHandler.onMessage(async (message) => {
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
              invocationId,
              error: `Method "${methodName}" not found`,
            });
          }
          try {
            const result = method(...args);
            this.messageHandler.send({
              type: "RPC_RESPONSE",
              invocationId,
              result: result instanceof Promise ? await result : result,
            });
          } catch (error) {
            this.messageHandler.send({
              type: "RPC_ERROR_RESPONSE",
              invocationId,
              error:
                error instanceof Error
                  ? error.message
                  : `${error ?? "unknown error"}`,
            });
          }
          break;
        }
      }
    });
  }

  get client() {
    return this.proxy;
  }

  dispose(): void {
    this.messageHandler.dispose();
  }
}
