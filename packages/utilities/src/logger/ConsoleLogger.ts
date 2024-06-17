import { ILogger } from "./ILogger";

export class ConsoleLogger implements ILogger {
  log(...messages: unknown[]): void {
    console.log(...messages);
  }
  info(...messages: unknown[]): void {
    console.info(...messages);
  }
  warn(...messages: unknown[]): void {
    console.warn(...messages);
  }
  error(...messages: unknown[]): void {
    console.error(...messages);
  }
}
