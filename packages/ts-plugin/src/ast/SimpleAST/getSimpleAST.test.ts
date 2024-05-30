import { describe, it, expect } from "bun:test";
import * as ts from "typescript";
import { getSimpleAST } from "./getSimpleAST";
import { createTestProgram, testFile001 } from "../../test/createTestProgram";

describe("SimpleASTService", () => {
  const program = createTestProgram([testFile001.button]);

  describe("program", () => {
    it("program should contain nodes", () => {
      expect(program.getNodeCount()).toBeGreaterThan(0);
    });

    it("program should contain source files", () => {
      const sourceFiles = program.getSourceFiles().map((sf) => sf.fileName);
      expect(sourceFiles).toContain(testFile001.button);
    });
  });

  describe("getSimpleAST for test project 001", () => {
    Object.keys(testFile001).forEach((key) => {
      it(`should return SimpleAST for "${key}"`, () => {
        expect(getSimpleAST(testFile001.button, program, ts)).toMatchSnapshot();
      });
    });
  });
});
