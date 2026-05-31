import test from "node:test";
import assert from "node:assert/strict";
import {
  buildVehicleImageQuery,
  getCuratedVehicleImage,
  normalizeVehicleName,
  vehicleImageSearchTerms,
} from "../src/lib/vehicle-image.ts";

test("normalizes common Chevrolet Cruze misspellings", () => {
  assert.equal(normalizeVehicleName("Chevlet Cruise"), "chevrolet cruze");
  assert.equal(normalizeVehicleName("Chevy Cruze"), "chevrolet cruze");
});

test("returns curated Chevrolet Cruze image", () => {
  const image = getCuratedVehicleImage("2014 Chevrolet Cruze LT");
  assert.ok(image);
  assert.match(image.url, /Chevrolet%20Cruze/);
  assert.match(image.alt, /Chevrolet Cruze/);
});

test("buildVehicleImageQuery prefers structured vehicle fields", () => {
  assert.equal(
    buildVehicleImageQuery({
      year: "2017",
      make: "Chevrolet",
      model: "Cruze",
      vehicleTitle: "Wrong fallback",
    }),
    "2017 Chevrolet Cruze",
  );
});

test("vehicleImageSearchTerms adds car exterior context", () => {
  assert.equal(vehicleImageSearchTerms("Toyota Camry"), "toyota camry car exterior");
});
