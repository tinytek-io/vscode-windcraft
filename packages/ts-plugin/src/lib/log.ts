import * as fs from "fs";
import * as path from "path";

const logFilePath = path.join(__dirname, "..", "..", "log.txt");

// Clear the log file
fs.writeFileSync(logFilePath, "");

export const log = (message: string) => {
  const date = new Date();
  fs.appendFileSync(
    logFilePath,
    `${date.toISOString()} [TS Plugin] - ${message}\n`
  );
};
