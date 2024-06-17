export type Disposable = {
  dispose: () => void;
};

export interface MessageHandler<I, O> {
  onMessage(listener: (message: I) => void): Disposable;
  send(message: O): void;
  dispose(): void;
}
