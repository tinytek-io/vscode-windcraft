import type { WebviewApi } from "vscode-webview";
import { uuid } from "../lib/uuid";

export type CallMethodMessage<A> = {
  type: "callMethod";
  id: string;
  name: string;
  args: A[];
};

export type CallMethodResponse<R> =
  | {
      type: "callMethodResult";
      id: string;
      name: string;
      result: R;
    }
  | {
      type: "callMethodError";
      id: string;
      name: string;
      error: string;
    };

type AsyncFunction = (...args: any[]) => Promise<any>;

export class Bridge<
  M extends Record<string, F>,
  F extends AsyncFunction = AsyncFunction,
> {
  private readonly vsCodeApi: WebviewApi<unknown> | undefined;
  public readonly remoteMethods: M;

  constructor() {
    if (typeof acquireVsCodeApi === "function") {
      this.vsCodeApi = acquireVsCodeApi();
    }
    this.remoteMethods = new Proxy(
      {},
      {
        get: (_, name: string) => {
          return (...args: unknown[]) => {
            return this.callMethod(name, ...args);
          };
        },
      }
    ) as M;
  }

  public postMessage(message: unknown) {
    if (this.vsCodeApi) {
      this.vsCodeApi.postMessage(message);
    } else {
      console.log(message);
    }
  }

  public callMethod<R, A>(name: string, ...args: A[]): Promise<R> {
    const id = uuid();
    return new Promise((resolve, reject) => {
      const listener = (event: MessageEvent) => {
        const message = event.data as CallMethodResponse<R>;
        if (
          message.type === "callMethodResult" &&
          message.name === name &&
          message.id === id
        ) {
          window.removeEventListener("message", listener);
          resolve(message.result);
        }
        if (
          message.type === "callMethodError" &&
          message.name === name &&
          message.id === id
        ) {
          window.removeEventListener("message", listener);
          reject(message.error);
        }
      };

      window.addEventListener("message", listener);

      const message: CallMethodMessage<A> = {
        type: "callMethod",
        id,
        name,
        args,
      };
      if (this.vsCodeApi) {
        this.vsCodeApi.postMessage(message);
      } else {
        window.removeEventListener("message", listener);
        reject("VS Code API not available");
      }
    });
  }
}

export interface Position {
  line: number;
  character: number;
}

export type Range = [Position, Position];

type MethodMap = {
  isReady: () => Promise<void>;
  setClassName: (className: string) => Promise<string | undefined>;
};

// Create a singleton instance of the Bridge
export const bridge = new Bridge<MethodMap>();
