import { Range, TextDocument } from "vscode";
import { ClassName, ClassNamesResult } from "../ast/ClassNames/getClassNames";

export type ClassNamePosition = ClassName & {
  range: Range;
  literalRange: Range;
};

export type ClassNamesPositionResult = Omit<ClassNamesResult, "classNames"> & {
  current?: ClassNamePosition;
  scope: ClassNamePosition[];
};

export function classNamesPosition(
  classNamesFile: ClassNamesResult,
  document: TextDocument
): ClassNamesPositionResult {
  const current = classNamesFile.classNames.slice(-1)[0];
  const scope = classNamesFile.classNames.slice(0, -1);
  return {
    ...classNamesFile,
    current: current
      ? {
          ...current,
          range: new Range(
            document.positionAt(current.position.start),
            document.positionAt(current.position.end)
          ),
          literalRange: new Range(
            document.positionAt(current.position.start + 1),
            document.positionAt(current.position.end - 1)
          ),
        }
      : undefined,
    scope: scope.map((c) => ({
      ...c,
      range: new Range(
        document.positionAt(c.position.start),
        document.positionAt(c.position.end)
      ),
      literalRange: new Range(
        document.positionAt(c.position.start + 1),
        document.positionAt(c.position.end - 1)
      ),
    })),
  };
}
