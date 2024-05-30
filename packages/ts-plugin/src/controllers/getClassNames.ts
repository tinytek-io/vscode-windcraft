import type { Request, Response } from "express";
import { z } from "zod";
import { getClassNames } from "../ast/ClassNames/getClassNames";

const getClassNamesRequestDtoSchema = z.object({
  fileName: z.string(),
  position: z.number(),
});

export type GetClassNamesRequestDto = z.infer<
  typeof getClassNamesRequestDtoSchema
>;

export async function getClassNamesController(req: Request, res: Response) {
  const { success, error, data } = getClassNamesRequestDtoSchema.safeParse(
    req.body
  );

  if (!success) {
    res.status(400).send({ message: "Invalid request", error });
    return;
  }

  const { fileName, position } = data;

  const program = req.languageService.getProgram();

  if (!program) {
    res.status(404).send({ message: "Program not found" });
    return;
  }

  const classNames = getClassNames(fileName, position, program, req.typescript);

  if (!classNames) {
    res.status(404).send({ message: "File not found" });
  } else {
    res.send(classNames);
  }
}
