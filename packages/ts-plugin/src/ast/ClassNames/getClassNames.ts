import type * as ts from "typescript/lib/tsserverlibrary";
import { z } from "zod";
import { JsxAST } from "../ComponentAST/JsxAST";

export const classNameSchema = z.object({
  position: JsxAST.positionSchema,
  className: z.string(),
});

export type ClassName = z.infer<typeof classNameSchema>;

export const classNamesResultSchema = z.object({
  fileName: z.string(),
  classNames: classNameSchema.array(),
});

export type ClassNamesResult = z.infer<typeof classNamesResultSchema>;

/**
 * Get class names from the JSX element at the given position.
 * @param fileName - File name to get class names from.
 * @param position - Position to get class names at.
 * @param program - TypeScript program.
 * @param typescript - TypeScript module.
 * @returns Array of class names or undefined if file not found.
 * 
 * @example
 * ```ts
 * const classNames = getClassNames("test.tsx", 170, program, ts);
 * console.log(classNames); // ["flex"]
 * ```
 */
export function getClassNames(
  fileName: string,
  position: number,
  program: ts.Program,
  typescript: typeof ts
): ClassNamesResult | undefined {
  // Get the source file from the program.
  const file = program.getSourceFile(fileName);

  if (!file) {
    // File not found
    return undefined;
  }

  // Array to store class names.
  const classNamesResult: ClassNamesResult = {
    fileName,
    classNames: [],
  };

  /**
   * Walk the AST tree and extract class names.
   */
  const nodeWalker = (node: ts.Node) => {
    if (node.getStart() > position || node.getEnd() < position) {
      // Skip nodes that are not in the range of the position.
      return;
    }

    /**
     * Get JSX element containing the class name.
     */
    const jsxElement =
      (typescript.isJsxElement(node) && node.openingElement) ||
      (typescript.isJsxSelfClosingElement(node) && node) ||
      undefined;

    let foundClassName = false;

    /**
     * Find the class name attribute and extract the class names.
     */
    jsxElement?.attributes.properties.forEach((jsxAttribute) => {
      if (
        typescript.isJsxAttribute(jsxAttribute) &&
        jsxAttribute.name.getText() === "className"
      ) {
        jsxAttribute.forEachChild((className) => {
          // For now we only support string literals as class names.
          if (typescript.isStringLiteral(className)) {
            foundClassName = true;
            classNamesResult.classNames.push({
              className: className.text,
              position: {
                start: className.getStart(),
                end: className.getEnd(),
              },
            });
          }
        });
      }
    });

    if (jsxElement && foundClassName === false) {
      const endPosition = jsxElement.getEnd() - 1;
      // If class name attribute is not found, add an empty class name.
      classNamesResult.classNames.push({
        className: "",
        position: {
          start: endPosition,
          end: endPosition,
        },
      });
    }

    // Continue walking the tree.
    node.forEachChild(nodeWalker);
  };

  // Start walking the tree.
  file.forEachChild(nodeWalker);

  return classNamesResult;
}
