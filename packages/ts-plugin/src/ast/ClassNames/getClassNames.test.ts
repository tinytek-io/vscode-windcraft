import { describe, it, expect } from "bun:test";
import * as ts from "typescript";
import { createTestProgram, testFile001 } from "../../test/createTestProgram";
import { getClassNames } from "./getClassNames";
import { scenarios } from "./Scenario";

describe("AST", () => {
  describe("getClassNames for Button.tsx in test project 001", () => {
    const program = createTestProgram([testFile001.button]);

    scenarios.forEach(({ name, pos, expected }) => {
      it(`should return class names ${name} at ${pos}`, () => {
        const classNames = getClassNames(testFile001.button, pos, program, ts);
        expect(classNames).toEqual(expected);
      });
    });
  });
});
