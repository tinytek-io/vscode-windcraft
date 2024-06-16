/**
 * This file exports the server factory function for the TypeScript plugin
 * using CommonJS export syntax.
 *
 * Error:
 * ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead
 */
const factory = require("./dist/plugin/plugin");

if (typeof factory.default !== "function") {
  throw new Error("Expected server default export to be the factory function");
}

module.exports = factory.default;
