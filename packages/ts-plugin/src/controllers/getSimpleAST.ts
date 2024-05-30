import type { Request, Response } from "express";
import { log } from "../lib/log";

import { getSimpleAST } from "../ast/SimpleAST/getSimpleAST";
import { z } from "zod";

const getSimpleASTRequestDtoSchema = z.object({
  fileName: z.string(),
});

export type GetSimpleASTRequestDto = z.infer<
  typeof getSimpleASTRequestDtoSchema
>;

export function getSimpleASTController(req: Request, res: Response) {
  log("Received request '/' - getSimpleASTController");
  const { success, error, data } = getSimpleASTRequestDtoSchema.safeParse(
    req.body
  );

  if (!success) {
    log(`Sending response '/' - Invalid request`);
    res.status(400).send({ message: "Invalid request", error });
    return;
  }

  const { fileName } = data;

  log(`Processing request '/' - fileName: "${fileName}"`);

  const program = req.languageService.getProgram();
  if (!program) {
    log(`Sending response '/' - Program not found`);
    res.status(404).send({ message: "Program not found" });
    return;
  }

  const simpleAST = getSimpleAST(fileName, program, req.typescript);

  if (!simpleAST) {
    log(`Sending response '/' - File not found "${fileName}"`);
    res.status(404).send({ message: "File not found" });
  } else {
    log("Sending response '/'");
    res.send(simpleAST);
  }
}
