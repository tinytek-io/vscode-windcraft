import { describe, it, expect } from "bun:test";
import * as ts from "typescript";
import { createTestProgram, testFile001 } from "../../test/createTestProgram";
import { getJsxAST } from "./createComponentAST";
import { buttonJsxAST } from "./test/buttonJsxAST";
import type { JsxAST } from "./JsxAST";

/*
  "end": 181,
  "start": 165,

  "end": 237,
  "start": 212,
*/

describe.skip("JsxAST", () => {
  const program = createTestProgram([testFile001.button]);

  describe("getJsxAST test project 001 button", () => {
    it("should return empty class names for Button.tsx at position 0", () => {
      const jsxASTFile: JsxAST.File | undefined = getJsxAST(testFile001.button, program, ts);

      expect(jsxASTFile).toBeDefined();

      const button = jsxASTFile?.components.find((c) => c.name === "Button");
      expect(button).toEqual(buttonJsxAST);
    });
  });
});
