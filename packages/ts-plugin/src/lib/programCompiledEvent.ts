import { logger } from "@windcraft/utilities/logger/logger";
import { EventEmitter } from "events";
import ts from "typescript/lib/tsserverlibrary";

type TsPluginEventMap = {
  programCompiled: [];
};
const eventEmitter = new EventEmitter<TsPluginEventMap>();

type Callback = () => void;
const pendingRequests: Callback[] = [];

/**
 * Resolves all pending requests when the `programCompiled` event is emitted.
 */
eventEmitter.on("programCompiled", () => {
  while (pendingRequests.length) {
    const resolve = pendingRequests.pop();
    resolve?.();
  }
});

export type DisposeFunction = () => void;

/**
 * Polls the language service for changes in the program and emits a `programCompiled` event when the program changes.
 *
 * @param {ts.LanguageService} languageService The language service to poll for program changes.
 * @param {number} [interval=10] Optional poll interval in milliseconds (default=10ms)
 * @returns {DisposeFunction} A function to clean up and stop polling the program compilation state.
 */
export function startPollProgramCompilation(
  languageService: ts.LanguageService,
  interval = 10
): DisposeFunction {
  logger.log("Start polling program compilation state");
  let previousProgram = languageService.getProgram();
  const intervalId = setInterval(() => {
    const currentProgram = languageService.getProgram();
    if (currentProgram !== previousProgram) {
      previousProgram = currentProgram;
      eventEmitter.emit("programCompiled");
    }
  }, interval);

  return () => {
    logger.log("Stop polling program compilation state");
    clearInterval(intervalId);
  };
}

/**
 * Waits for the `programCompiled` event to be emitted.
 */
export async function waitForProgramCompilation(ac: AbortController) {
  return new Promise<void>((resolve, reject) => {
    ac.signal.addEventListener("abort", () => {
      const index = pendingRequests.indexOf(resolve);
      if (index !== -1) {
        pendingRequests.splice(index, 1);
        reject("Aborted");
      }
    }, { once: true });
    pendingRequests.unshift(resolve);
  });
}
