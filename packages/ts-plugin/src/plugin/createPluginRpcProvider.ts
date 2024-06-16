import ts from "typescript/lib/tsserverlibrary";
import { getSimpleAST } from "../ast/SimpleAST/getSimpleAST";
import { getClassNames } from "../ast/ClassNames/getClassNames";
import { logger } from "@windcraft/utilities/logger/logger";

export function createPluginRpcProvider(languageService: ts.LanguageService, typescript: typeof ts) {
  return {
    getSimpleAST: (fileName: string) => {
      logger.log("Getting simple AST");
      const program = languageService.getProgram();
      if (!program) {
        throw new Error("Program not found");
      }
      return getSimpleAST(fileName, program, typescript);
    },
    getClassNames: (fileName: string, position: number) => {
      logger.log("Getting class names");
      const program = languageService.getProgram();
      if (!program) {
        throw new Error("Program not found");
      }
      return getClassNames(fileName, position, program, typescript);
    }
    /* programCompileEvent: (fileName: string) => {
      const program = languageService.getProgram();
      if (!program) {
        throw new Error("Program not found")
      }
      const simpleAST = getSimpleAST(fileName, program, typescript);
      return simpleAST;
    }, */
  };
}

export type PluginRpcProvider = ReturnType<typeof createPluginRpcProvider>;

export type PluginRpcProviderEvent = {
  programCompile: [];
  clientReady: [];
};
