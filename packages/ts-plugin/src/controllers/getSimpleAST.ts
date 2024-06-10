import type { Request, Response } from "express";
import { logger } from "@windcraft/utilities/logger/logger";
import { getSimpleAST } from "../ast/SimpleAST/getSimpleAST";
import { z } from "zod";

const getSimpleASTRequestDtoSchema = z.object({
  fileName: z.string(),
});

export type GetSimpleASTRequestDto = z.infer<
  typeof getSimpleASTRequestDtoSchema
>;

export function getSimpleASTController(req: Request, res: Response) {
  logger.log("Received request '/' - getSimpleASTController");
  const { success, error, data } = getSimpleASTRequestDtoSchema.safeParse(
    req.body
  );

  if (!success) {
    logger.log(`Sending response '/' - Invalid request`);
    res.status(400).send({ message: "Invalid request", error });
    return;
  }

  const { fileName } = data;

  logger.log(`Processing request '/' - fileName: "${fileName}"`);

  const program = req.languageService.getProgram();
  if (!program) {
    logger.log(`Sending response '/' - Program not found`);
    res.status(404).send({ message: "Program not found" });
    return;
  }

  const simpleAST = getSimpleAST(fileName, program, req.typescript);

  if (!simpleAST) {
    logger.log(`Sending response '/' - File not found "${fileName}"`);
    res.status(404).send({ message: "File not found" });
  } else {
    logger.log("Sending response '/'");
    res.send(simpleAST);
  }
}
