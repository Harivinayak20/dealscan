import assert from "node:assert/strict";
import test from "node:test";
import { extractVin } from "../src/lib/vin-decoder.ts";

test("extractVin finds a valid 17-character VIN in text", () => {
  const text = "VIN: 1HGCM82633A004352, clean title";
  assert.equal(extractVin(text), "1HGCM82633A004352");
});

test("extractVin returns null when no VIN pattern is found", () => {
  const text = "2018 Toyota Camry, clean title";
  assert.equal(extractVin(text), null);
});

test("extractVin returns null for short text", () => {
  const text = "VIN: ABC123";
  assert.equal(extractVin(text), null);
});

test("extractVin handles VIN at start of text", () => {
  const text = "WBA3A5C5XDF123456 is the VIN";
  assert.equal(extractVin(text), "WBA3A5C5XDF123456");
});

test("extractVin uppercases lowercase VINs", () => {
  const text = "vin: 1g1ze5st8jf123456";
  assert.equal(extractVin(text), "1G1ZE5ST8JF123456");
});

test("extractVin returns null for empty text", () => {
  assert.equal(extractVin(""), null);
});

test("extractVin returns null for null-ish input", () => {
  const text = "No VIN here at all 12345";
  assert.equal(extractVin(text), null);
});
