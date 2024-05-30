import type { Request, Response } from "express";
import { waitForProgramCompilation } from "../lib/programCompiledEvent";
import { TimeSpan } from "../lib/TimeSpan";

export async function programCompileEventController(
  req: Request,
  res: Response
) {
  // Disable the timeout for this request
  req.setTimeout(0);

  // Create an abort controller to cancel the wait for program compilation
  const ac = new AbortController();
  const timeoutId = setTimeout(() => ac.abort(), TimeSpan.fromMinutes(20).toMilliseconds());

  try {
    await waitForProgramCompilation(ac);
    res.send({ message: "Program compiled" });
  } catch (error) {
    if (ac.signal.aborted) {
      res.status(408).send({ message: "Timeout" });
    } else {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).send({ message });
    }
  } finally {
    clearTimeout(timeoutId);
  }
}
