/**
 * This file is used to verify that the plugin exports the expected methods.
 */
const factory = require("./plugin.export");

if (typeof factory !== "function") {
  throw new Error("Expected plugin export to be the factory function");
}

const f = factory({});

if (typeof f.create !== "function") {
  throw new Error("Expected plugin factory to return an object with a create method");
}

if (typeof f.onConfigurationChanged !== "function") {
  throw new Error("Expected plugin factory to return an object with a  onConfigurationChanged method");
}

console.log("Plugin exports the expected methods");