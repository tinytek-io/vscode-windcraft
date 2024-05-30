import type { Request, Response, NextFunction } from "express";
import { log } from "../lib/log";

export function readyCheckController(req: Request, res: Response) {
  log("Received request '/ready-check'");
  res.send("ready");
}
