import type * as vscode from "vscode";

type CallMethodMessage<A> = {
  type: "callMethod";
  id: string;
  name: string;
  args: A[];
};

type CallMethodResponse<R> =
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

// biome-ignore lint/suspicious/noExplicitAny: Generic type
type MessageEvent = CallMethodMessage<any>;

// biome-ignore lint/suspicious/noExplicitAny: Generic type
export type MethodList = Record<string, (...args: any[]) => any>;

export class ExtensionBridge {
  private queueIsRunning = false;

  // biome-ignore lint/suspicious/noExplicitAny: Generic type
  private messageQueue: CallMethodMessage<any>[] = [];

  constructor(
    private webviewView: vscode.WebviewView,
    private methodList: MethodList
  ) {
    this.mountCallMethodListener();
  }

  private mountCallMethodListener() {
    this.webviewView.webview.onDidReceiveMessage(async (data: MessageEvent) => {
      if (data.type !== "callMethod") {
        return;
      }
      // Add the message to the queue
      this.messageQueue.push(data);

      // Run the message queue
      await this.runMessageQueue();
    });
  }

  /**
   * Run the call method message queue
   */
  private async runMessageQueue() {
    if (this.queueIsRunning) {
      return;
    }
    this.queueIsRunning = true;
    while (this.messageQueue.length > 0) {
      const data = this.messageQueue.shift();
      if (!data) {
        continue;
      }
      await this.runMethod(data);
    }
    this.queueIsRunning = false;
  }

  /**
   * Run a method from call method message data
   */
  // biome-ignore lint/suspicious/noExplicitAny: Generic type
  private async runMethod(data: CallMethodMessage<any>) {
    const method = this.methodList[data.name];
    if (!method) {
      // biome-ignore lint/suspicious/noExplicitAny: Generic type
      const errorMethodResponse: CallMethodResponse<any> = {
        type: "callMethodError",
        id: data.id,
        name: data.name,
        error: `Method ${data.name} not found`
      };
      this.webviewView.webview.postMessage(errorMethodResponse);
      return;
    }

    try {
      const result = await method(...data.args);
      // biome-ignore lint/suspicious/noExplicitAny: Generic type
      const successMethodResponse: CallMethodResponse<any> = {
        type: "callMethodResult",
        id: data.id,
        name: data.name,
        result
      };
      this.webviewView.webview.postMessage(successMethodResponse);
    } catch (error) {
      // biome-ignore lint/suspicious/noExplicitAny: Generic type
      const errorMethodResponse: CallMethodResponse<any> = {
        type: "callMethodError",
        id: data.id,
        name: data.name,
        error: error instanceof Error ? error.message : (error as string)
      };
      this.webviewView.webview.postMessage(errorMethodResponse);
    }
  }
}
