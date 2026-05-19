import assert from "node:assert/strict";
import {
  buildMarketLabel,
  buildRequestText,
  getMarketCompleteness,
  normalizeCounty,
  sanitizeZip,
  states,
  workflows
} from "../lib/marketLogic.mjs";

const workflow = workflows[0];
const label = buildMarketLabel({
  state: "FL",
  city: "Satellite Beach",
  county: "Brevard County",
  zip: "32937"
});

assert.equal(states.length, 50, "all 50 states should be available");
assert.equal(workflows.length, 10, "all 10 workflows should be available");
assert.equal(normalizeCounty("Brevard County"), "Brevard", "county normalization should avoid County County");
assert.equal(sanitizeZip("32abc937999"), "32937", "ZIP should keep only the first 5 digits");
assert.equal(label, "Satellite Beach, Brevard County, Florida, ZIP 32937", "market label should be formatted cleanly");
assert.equal(getMarketCompleteness({ state: "FL", city: "Orlando", county: "Orange", zip: "32801" }), 100, "complete market should score 100");
assert.equal(getMarketCompleteness({ state: "FL", city: "", county: "", zip: "" }), 25, "state only market should score 25");

const request = buildRequestText({
  workflow,
  marketLabel: label,
  state: "FL",
  city: "Satellite Beach",
  county: "Brevard",
  zip: "32937",
  organization: "Health System A",
  csvPath: "",
  notes: "Test note"
});

assert.ok(request.includes("Market: Satellite Beach, Brevard County, Florida, ZIP 32937"), "request should include market label");
assert.ok(request.includes("State: FL"), "request should include state");
assert.ok(request.includes("Health System A"), "request should include organization context");
assert.ok(request.includes("Additional context: Test note"), "request should include notes");

assert.ok(workflows.every((item) => Array.isArray(item.tools) && item.tools.length > 0), "each workflow should define tools");
assert.ok(workflows.every((item) => item.prompt && item.description), "each workflow should define prompt and description");

console.log("All market logic tests passed.");
