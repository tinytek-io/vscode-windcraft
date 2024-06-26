import { describe, it, expect, afterAll } from "bun:test";
import { EventEmitter } from "events";
import { RpcInstance, RpcRequestMessage } from "./RpcInstance";
import { MessageHandler, Disposable } from "./MessageHandler";
import { TimeSpan } from "../lib/TimeSpan";
import { TestLogger } from "../logger/TestLogger";
import { setCurrentLogger } from "../logger/logger";

// Set the logger to test logger
const logger = new TestLogger();
setCurrentLogger(logger);

const eventBus = new EventEmitter();

type EventBusMessage<P> = {
  payload: P;
};

type TestEvent = {
  "testEvent": [];
  "testEventWithArgs": [string, number, boolean];
};

export class TestMessageHandler<I, O> implements MessageHandler<I, O> {
  private _disposables: Disposable[] = [];
  private _listeners: ((message: I) => void)[] = [];

  constructor() {
    const listener = (data: string) => {
      const message = JSON.parse(data) as EventBusMessage<I>;
      this._listeners.forEach((l) => l(message.payload));
    };
    eventBus.on("message", listener);

    this._disposables.push({
      dispose: () => {
        eventBus.off("message", listener);
      },
    });
  }

  onMessage(listener: (message: I) => void): Disposable {
    this._listeners.push(listener);
    return {
      dispose: () => {
        this._listeners = this._listeners.filter((l) => l !== listener);
      },
    };
  }

  send(message: O): void {
    const eventBusMessage: EventBusMessage<O> = {
      payload: message,
    };
    eventBus.emit("message", JSON.stringify(eventBusMessage));
  }

  dispose(): void {
    this._listeners = [];
    this._disposables.forEach((d) => d.dispose());
  }
}

const messageHandlerFoo = new TestMessageHandler<
  RpcRequestMessage,
  RpcRequestMessage
>();

const messageHandlerBar = new TestMessageHandler<
  RpcRequestMessage,
  RpcRequestMessage
>();

describe("RpcInstance", () => {
  // Provider map returned by the provider function
  const fooMap = () => ({
    /**
     * Method with argument validation
     */
    foo: (fileName: string): string => {
      if (typeof fileName !== "string") {
        throw new Error("Invalid argument");
      }
      return fileName;
    },
    /**
     * Void Method
     */
    fooVoid: (): void => {},
  });

  // Provider map
  const barMap = {
    /**
     * Method
     */
    bar: (fileName: string, n: number): number => {
      return n + 1;
    },
    /**
     * Async method
     */
    barAsync: async (fileName: string, n: number): Promise<number> => {
      return n + 1;
    },
    /**
     * Complex arguments and result method
     */
    barComplex: async (options: {
      fileName: string;
      n: number;
    }): Promise<{ fileName: string; n: number }> => {
      return {
        fileName: options.fileName,
        n: options.n + 1,
      };
    },
    /**
     * Timeout method
     * Returns after 1 seconds
     */
    barTimeout: async () => {
      return new Promise<void>((resolve) =>
        setTimeout(() => resolve(), TimeSpan.fromSeconds(1).toMilliseconds())
      );
    },
  };

  const rpcMapFoo = new RpcInstance<typeof barMap, TestEvent>(
    messageHandlerFoo,
    fooMap()
  );
  const rpcMapBar = new RpcInstance<typeof fooMap, TestEvent>(
    messageHandlerBar,
    barMap
  );

  afterAll(() => {
    rpcMapFoo.dispose();
    rpcMapBar.dispose();
  });

  it("should handle RPC request rpcMapBar.client.foo", async () => {
    expect(await rpcMapBar.client.foo("baz")).toBe("baz");
    expect(await rpcMapBar.client.foo("bar")).toBe("bar");
  });

  it("should handle RPC request rpcMapBar.client.bar", async () => {
    expect(await rpcMapFoo.client.bar("baz", 1)).toBe(2);
    expect(await rpcMapFoo.client.bar("baz", 2)).toBe(3);
  });

  it("should handle async provider RPC request", async () => {
    expect(await rpcMapFoo.client.barAsync("baz", 1)).toBe(2);
    expect(await rpcMapFoo.client.barAsync("baz", 2)).toBe(3);
  });

  it("should handle void provider RPC request", async () => {
    expect(await rpcMapBar.client.fooVoid()).toBeUndefined();
  });

  it("should handle complex provider RPC request", async () => {
    expect(
      await rpcMapFoo.client.barComplex({
        fileName: "baz",
        n: 1,
      })
    ).toEqual({
      fileName: "baz",
      n: 2,
    });
  });

  it("should handle invalid method RPC request", async () => {
    expect(async () => {
      // @ts-expect-error
      await rpcMapFoo.client.zoo("baz", 1);
    }).toThrowError(`Method "zoo" not found`);
  });

  it("should handle RPC error response", async () => {
    expect(async () => {
      // @ts-expect-error
      await rpcMapBar.client.foo();
    }).toThrowError("Invalid argument");
  });

  it("should handle RPC timeout", async () => {
    expect(async () => {
      const TIMEOUT = RpcInstance.TIMEOUT;
      RpcInstance.TIMEOUT = TimeSpan.fromMilliseconds(2);
      await rpcMapFoo.client.barTimeout();
      RpcInstance.TIMEOUT = TIMEOUT;
    }).toThrowError('Remote method call "barTimeout" timed out');
  });

  it("should handle event listener", async () => {
    let result = false;
    rpcMapBar.on("testEvent", () => {
      result = true;
    });

    expect(result).toBe(false);
    rpcMapFoo.emit("testEvent");
    expect(result).toBe(true);
  });

  it("should handle event listener returning arguments", async () => {
    let result: [string, number, boolean] = ["", 0, false];

    rpcMapBar.on("testEventWithArgs", (a, b, c) => {
      result = [a, b, c];
    });

    expect(result).toEqual(["", 0, false]);
    rpcMapFoo.emit("testEventWithArgs", "foo", 1, true);
    expect(result).toEqual(["foo", 1, true]);
    rpcMapFoo.emit("testEventWithArgs", "bar", 2, false);
    expect(result).toEqual(["bar", 2, false]);
  });
});
