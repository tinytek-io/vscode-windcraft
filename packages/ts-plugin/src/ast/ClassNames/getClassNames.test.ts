import { describe, it, expect } from "bun:test";
import * as ts from "typescript";
import { createTestProgram, testFile001 } from "../../test/createTestProgram";
import { ClassName, ClassNamesResult, getClassNames } from "./getClassNames";

type Scenario = {
  name: string;
  start: number;
  pos: number;
  end: number;
  expected: ClassNamesResult;
};

const classNames: Record<string, ClassName> = {
  button: {
    className: "flex",
    position: {
      start: 175,
      end: 181,
    },
  },
  div: {
    className: "flex flex-col",
    position: {
      start: 222,
      end: 237,
    },
  },
  img: {
    className: "w-full",
    position: {
      start: 281,
      end: 289,
    },
  },
};

const scenarios: Scenario[] = [
  {
    name: "outside of any class names",
    start: 0,
    pos: 0,
    end: 248,
    expected: {
      fileName: testFile001.button,
      classNames: [],
    },
  },
  {
    name: "inside of the first button class name",
    start: 165,
    pos: 170,
    end: 181,
    expected: {
      fileName: testFile001.button,
      classNames: [classNames.button],
    },
  },
  {
    name: "inside of the div class names",
    start: 212,
    pos: 220,
    end: 237,
    expected: {
      fileName: testFile001.button,
      classNames: [classNames.button, classNames.div],
    },
  },
  {
    name: "inside of the self-closing img class name",
    start: 255,
    pos: 255,
    end: 292,
    expected: {
      fileName: testFile001.button,
      classNames: [classNames.button, classNames.img],
    },
  },
];

describe.only("SimpleASTService", () => {
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
