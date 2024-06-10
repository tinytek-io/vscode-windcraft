import { logger } from "@windcraft/utilities/logger/logger";
import type { Request, Response, NextFunction } from "express";

export function readyCheckController(req: Request, res: Response) {
  logger.log("Received request '/ready-check'");
  res.send("ready");
}
