import type * as ts from "typescript/lib/tsserverlibrary";
import { log } from "../../lib/log";
import { SimpleAST } from "./SimpleAST";

export function getSimpleAST(
  fileName: string,
  program: ts.Program,
  typescript: typeof ts
) {
  const file = program.getSourceFile(fileName);
  if (!file) {
    return undefined;
  }

  const nodeWalker = (node: ts.Node, indent = ""): SimpleAST => {
    const iLog = (msg: string) => {}; //  log(`${indent}${msg}`);

    const result: SimpleAST = {
      kind: typescript.SyntaxKind[node.kind],
      position: {
        start: node.getStart(),
        end: node.getEnd(),
      },
    };

    iLog(`kind: ${result.kind}`);

    if (typescript.isFunctionDeclaration(node)) {
      result.name = node.name?.getText();
    }
    if (typescript.isJsxSelfClosingElement(node)) {
      result.name = node.tagName.getText();
    }
    if (
      typescript.isJsxOpeningElement(node) ||
      typescript.isJsxSelfClosingElement(node) ||
      typescript.isJsxClosingElement(node)
    ) {
      //  result.name = node.tagName.getText();
    }
    if (typescript.isJsxElement(node)) {
      result.name = node.openingElement.tagName.getText();
    }
    if (typescript.isJsxAttribute(node)) {
      result.name = node.name.getText();
    }
    if (typescript.isStringLiteral(node)) {
      result.name = node.text;
    }

    if (result.name) {
      iLog(result.name);
    }

    typescript.forEachChild(node, (n) => {
      if (!result.children) {
        result.children = [];
      }
      result.children.push(nodeWalker(n, indent + "  "));
    });

    return result;
  };

  return nodeWalker(file);
}
