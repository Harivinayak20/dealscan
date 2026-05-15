import assert from "node:assert/strict";
import test from "node:test";
import { verdictToStatus, statusLabel, DEFAULT_SETTINGS } from "../src/lib/admin-types.ts";

test("verdictToStatus maps Great Deal to good_deal", () => {
  assert.equal(verdictToStatus("Great Deal"), "good_deal");
});

test("verdictToStatus maps Decent Deal to fair_deal", () => {
  assert.equal(verdictToStatus("Decent Deal"), "fair_deal");
});

test("verdictToStatus maps cautious verdicts to risky_deal", () => {
  assert.equal(verdictToStatus("Proceed with Caution"), "risky_deal");
  assert.equal(verdictToStatus("Red Flags Present"), "risky_deal");
});

test("verdictToStatus maps Avoid to needs_review", () => {
  assert.equal(verdictToStatus("Avoid"), "needs_review");
});

test("statusLabel returns human-readable labels", () => {
  assert.equal(statusLabel("good_deal"), "Good Deal");
  assert.equal(statusLabel("fair_deal"), "Fair Deal");
  assert.equal(statusLabel("risky_deal"), "Risky Deal");
  assert.equal(statusLabel("needs_review"), "Needs Review");
});

test("DEFAULT_SETTINGS has expected structure", () => {
  assert.equal(DEFAULT_SETTINGS.scoringThresholds.greatDealMin, 85);
  assert.equal(DEFAULT_SETTINGS.scoringThresholds.decentDealMin, 70);
  assert.equal(DEFAULT_SETTINGS.scoringThresholds.cautionMin, 55);
  assert.equal(DEFAULT_SETTINGS.scoringThresholds.redFlagsMin, 40);
  assert.ok(DEFAULT_SETTINGS.affiliateLinks.carfax.startsWith("https://"));
  assert.ok(DEFAULT_SETTINGS.featureFlags.groqEnabled);
});
