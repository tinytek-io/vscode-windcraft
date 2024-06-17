import type { ILogger } from "./ILogger";
import type { FileLogger } from "./FileLogger";
import { ConsoleLogger } from "./ConsoleLogger";

let currentLogger: ILogger = new ConsoleLogger();

/**
 * Set the current logger
 *
 * Default logger is {@link ConsoleLogger}
 *
 * {@link FileLogger} or any other logger that implements {@link ILogger}
 * can be set as the current logger
 */
export function setCurrentLogger(logger: ILogger): void {
  currentLogger = logger;
}

export class CurrentLogger implements ILogger {
  constructor(private prefix: string = "") {}

  private getMessages(messages: unknown[]): unknown[] {
    return this.prefix === "" ? messages : [this.prefix, ...messages];
  }

  log(...messages: unknown[]): void {
    currentLogger.log(...this.getMessages(messages));
  }
  info(...messages: unknown[]): void {
    currentLogger.info(...this.getMessages(messages));
  }
  warn(...messages: unknown[]): void {
    currentLogger.warn(...this.getMessages(messages));
  }
  error(...messages: unknown[]): void {
    currentLogger.error(...this.getMessages(messages));
  }
}

export const logger = new CurrentLogger();
