import fs from "node:fs";
import path from "node:path";

const logFilePath = path.join(__dirname, "..", "..", "log.txt");

const isDevelopment = process.env.NODE_ENV !== "production";

// Clear the log file
if (isDevelopment) {
  fs.writeFileSync(logFilePath, "");
}

export const log = isDevelopment ? (message: string) => {
  const date = new Date();
  fs.appendFileSync(
    logFilePath,
    `${date.toISOString()} [TS Plugin] - ${message}\n`
  );
} : () => {};
