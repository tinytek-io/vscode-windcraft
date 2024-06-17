import { logger } from "@windcraft/utilities/logger/logger";
import type ts from "typescript/lib/tsserverlibrary";

export type DisposeFunction = () => void;

/**
 * Polls the language service for changes in the program and emits a `programCompiled` event when the program changes.
 *
 * @param {ts.LanguageService} languageService The language service to poll for program changes.
 * @param {number} [interval=10] Optional poll interval in milliseconds (default=10ms)
 * @returns {DisposeFunction} A function to clean up and stop polling the program compilation state.
 */
export function startPollProgramCompilation(
  callback: () => void,
  languageService: ts.LanguageService,
  interval = 10
): DisposeFunction {
  logger.log("Start polling program compilation state");
  let previousProgram = languageService.getProgram();
  const intervalId = setInterval(() => {
    const currentProgram = languageService.getProgram();
    if (currentProgram !== previousProgram) {
      previousProgram = currentProgram;
      callback();
    }
  }, interval);

  return () => {
    logger.log("Stop polling program compilation state");
    clearInterval(intervalId);
  };
}
