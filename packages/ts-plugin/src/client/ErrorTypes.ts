export class TypeScriptStartError extends Error {
  constructor() {
    super("Failed to start TypeScript Server");
  }
}

export class TypeScriptExtensionNotActiveError extends Error {
  constructor() {
    super("TypeScript extension is not active");
  }
}