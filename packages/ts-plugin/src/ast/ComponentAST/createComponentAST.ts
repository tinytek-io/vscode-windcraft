import type * as ts from "typescript/lib/tsserverlibrary";
import { JsxAST } from "./JsxAST";

export function getJsxAST(fileName: string, program: ts.Program, typescript: typeof ts): JsxAST.File | undefined {
  const file = program.getSourceFile(fileName);
  if (!file) {
    return undefined;
  }

  return {
    fileName,
    position: {
      start: file.getStart(),
      end: file.getEnd()
    },
    components: getComponents(file, typescript)
  };
}

function getElementChildren(node: ts.Node, typescript: typeof ts): JsxAST.Element[] {
  const children: JsxAST.Element[] = [];
  typescript.forEachChild(node, (n) => {
    if (typescript.isJsxOpeningElement(n) || typescript.isJsxSelfClosingElement(n)) {
      children.push(getElement(n, typescript));
    }
  });
  return children;
}

function getElementProps(node: ts.Node, typescript: typeof ts): JsxAST.ElementProps {
  return {};
}

function getComponents(node: ts.Node, typescript: typeof ts): JsxAST.Component[] {
  return [];
}

function getElement(node: ts.JsxOpeningElement | ts.JsxSelfClosingElement, typescript: typeof ts): JsxAST.Element {
  return {
    name: node.tagName.getText(),
    type: "element",
    position: {
      start: node.getStart(),
      end: node.getEnd()
    },
    props: getElementProps(node, typescript),
    children: getElementChildren(node, typescript)
  };
}
