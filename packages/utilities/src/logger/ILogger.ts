export interface ILogger {
  log(...messages: unknown[]): void;
  info(...messages: unknown[]): void;
  warn(...messages: unknown[]): void;
  error(...messages: unknown[]): void;
};