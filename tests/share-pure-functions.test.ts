import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  MAX_REASON_LENGTH,
  sanitizeReason,
  sanitizeSummary,
  sanitizeVehicle,
  validatePayload,
  verdictForScore,
  type SharePayload,
} from "../src/lib/share-storage.ts";

const validPayload: SharePayload = {
  score: 85,
  verdict: "Great Deal",
  vehicle: "2021 Toyota Camry",
  summary: "Strong listing with documented service.",
  reasons: ["Clean title", "One owner", "Service records"],
  analysisMode: "groq",
  askingPrice: 22500,
  fairValueLow: 22000,
  fairValueHigh: 24000,
  suggestedOfferLow: 21000,
  suggestedOfferHigh: 22000,
  mileage: 54000,
};

describe("share sanitization", () => {
  it("redacts email addresses, phone numbers, VINs, and URLs", () => {
    const value = sanitizeReason("Call 212-555-0199 or me@example.com about 1HGCM82633A004352 at https://example.com/car");
    assert.equal(value, "Call [redacted] or [redacted] about [redacted] at [redacted]");
  });

  it("removes markup and quotes and caps public copy", () => {
    assert.equal(sanitizeSummary("<b>Seller says \"perfect\"</b>"), "bSeller says perfect/b");
    assert.equal(sanitizeReason("a".repeat(200)).length, MAX_REASON_LENGTH);
    assert.equal(sanitizeVehicle("  <2021 Toyota Camry>  "), "2021 Toyota Camry");
  });
});

describe("share payload validation", () => {
  it("accepts a complete allowlisted payload", () => {
    assert.equal(validatePayload(validPayload), true);
  });

  it("requires the verdict to match the score", () => {
    assert.equal(validatePayload({ ...validPayload, verdict: "Avoid" }), false);
  });

  it("allows no more than three reasons", () => {
    assert.equal(validatePayload({ ...validPayload, reasons: ["one", "two", "three", "four"] }), false);
  });

  it("rejects invalid numeric context", () => {
    assert.equal(validatePayload({ ...validPayload, askingPrice: Number.NaN }), false);
    assert.equal(validatePayload({ ...validPayload, mileage: -1 }), false);
  });

  it("rejects incomplete or unknown payloads", () => {
    const missing = { ...validPayload } as Partial<SharePayload>;
    delete missing.mileage;
    assert.equal(validatePayload(missing), false);
    assert.equal(validatePayload(null), false);
  });
});

describe("verdict thresholds", () => {
  it("matches the five production score bands", () => {
    assert.equal(verdictForScore(85), "Great Deal");
    assert.equal(verdictForScore(70), "Decent Deal");
    assert.equal(verdictForScore(55), "Proceed with Caution");
    assert.equal(verdictForScore(40), "Red Flags Present");
    assert.equal(verdictForScore(39), "Avoid");
  });
});
