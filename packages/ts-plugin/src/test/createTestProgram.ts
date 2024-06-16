import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";

const testProjectRoot = __dirname;
const testProjectPath = path.resolve(testProjectRoot, "001");

/**
 * Find the tsconfig.json for the test project.
 */
const configPath = ts.findConfigFile(testProjectRoot, ts.sys.fileExists, "tsconfig.json");

if (!configPath) {
  throw new Error("Could not find a valid 'tsconfig.json'.");
}

const configFile = ts.readConfigFile(configPath, ts.sys.readFile);

/*
 * Parse the tsconfig.json for the test project.
 */
const compilerOptions = ts.parseJsonConfigFileContent(configFile.config, ts.sys, testProjectRoot);

/**
 * Create a test program for the given source files.
 */
export function createTestProgram(sourceFiles: string[]) {
  const program = ts.createProgram(sourceFiles, compilerOptions.options);
  if (program.getNodeCount() === 0) {
    throw new Error(`Program has no nodes for files: "${sourceFiles.join('", "')}"`);
  }
  return program;
}

/**
 * Test files for test project 001.
 */
export const testFile001 = {
  button: path.join(testProjectPath, "Button.tsx")
};

// Check if all test files exist in test project 001.
Object.entries(testFile001).forEach(([key, filePath]) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found for "${key}": ${filePath}`);
  }
});
