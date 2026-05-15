import assert from "node:assert/strict";
import test from "node:test";
import { estimateRoughPricing } from "../src/lib/rough-pricing.ts";

test("estimateRoughPricing returns null ranges when price is missing", () => {
  const result = estimateRoughPricing({ price: null, score: 70, redFlags: [], greenFlags: [] });
  assert.equal(result.estimatedFairValueRange.low, null);
  assert.equal(result.estimatedFairValueRange.high, null);
  assert.equal(result.suggestedOfferRange.low, null);
  assert.equal(result.suggestedOfferRange.high, null);
});

test("estimateRoughPricing calculates fair range for a normal deal", () => {
  const result = estimateRoughPricing({ price: 20000, score: 70, redFlags: [], greenFlags: [] });
  assert.ok(result.estimatedFairValueRange.low !== null);
  assert.ok(result.estimatedFairValueRange.high !== null);
  assert.equal(result.estimatedFairValueRange.low, 18000);
  assert.equal(result.estimatedFairValueRange.high, 21000);
});

test("estimateRoughPricing lowers range for risky deals", () => {
  const result = estimateRoughPricing({ price: 20000, score: 50, redFlags: ["no title", "salvage", "engine issue"], greenFlags: [] });
  assert.ok(result.estimatedFairValueRange.low !== null);
  assert.equal(result.estimatedFairValueRange.low, 15000);
  assert.equal(result.estimatedFairValueRange.high, 19000);
});

test("estimateRoughPricing raises range for strong deals", () => {
  const result = estimateRoughPricing({ price: 20000, score: 90, redFlags: [], greenFlags: ["clean title", "one owner", "service records", "new tires", "no accidents"] });
  assert.equal(result.estimatedFairValueRange.low, 19000);
  assert.equal(result.estimatedFairValueRange.high, 22000);
});

test("estimateRoughPricing rounds to nearest 50", () => {
  const result = estimateRoughPricing({ price: 19999, score: 70, redFlags: [], greenFlags: [] });
  assert.equal(result.estimatedFairValueRange.low! % 50, 0);
  assert.equal(result.estimatedFairValueRange.high! % 50, 0);
});

test("estimateRoughPricing returns no suggested offer for very low scores", () => {
  const result = estimateRoughPricing({ price: 10000, score: 40, redFlags: ["no title"], greenFlags: [] });
  assert.equal(result.suggestedOfferRange.low, null);
  assert.equal(result.suggestedOfferRange.high, null);
});
