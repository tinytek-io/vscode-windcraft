import fs from "node:fs";
import { ILogger } from "./ILogger";

const isDevelopment = process.env.NODE_ENV !== "production";

export class FileLogger implements ILogger {
  private _log: (...messages: unknown[]) => void = () => {};

  constructor(logFilePath: string) {
    if (isDevelopment) {
      // Clear the log file
      fs.writeFileSync(logFilePath, "");
      
      this._log = (...messages: unknown[]) => {
        const date = new Date();
        const message = messages.map((m) => JSON.stringify(m)).join(" ");
        fs.appendFileSync(logFilePath, `${date.toISOString()} ${message}\n`);
      };
    }
  }
  log(...messages: unknown[]): void {
    this._log(...messages);
  }
  info(...messages: unknown[]): void {
    this._log("INFO:", ...messages);
  }
  warn(...messages: unknown[]): void {
    this._log("WARN:", ...messages);
  }
  error(...messages: unknown[]): void {
    this._log("ERROR:", ...messages);
  }
}
