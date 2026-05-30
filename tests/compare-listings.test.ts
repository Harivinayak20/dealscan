import assert from "node:assert/strict";
import test from "node:test";
import { parseMultipleUrls, createEmptyDraft, draftToRequestText, draftVehicleTitle, computeComparison } from "../src/lib/compare-listings.ts";
import type { AnalyzeListingResult } from "../src/lib/analyzer-types.ts";

function makeResult(overrides: Partial<AnalyzeListingResult> = {}): AnalyzeListingResult {
  return {
    score: 70,
    verdict: "Fair deal",
    summary: "A reasonable listing.",
    estimatedFairValueRange: { low: 15000, high: 18000, note: "" },
    suggestedOfferRange: { low: 14000, high: 16500, note: "" },
    categories: [],
    redFlags: [],
    greenFlags: [],
    missingInfo: [],
    negotiationTip: "",
    sellerQuestions: [],
    confidence: "Medium",
    ...overrides,
  };
}

test("parseMultipleUrls returns first two URLs from text", () => {
  const result = parseMultipleUrls("https://cars.com/a and https://autotrader.com/b and https://cargurus.com/c");
  assert.deepEqual(result, ["https://cars.com/a", "https://autotrader.com/b"]);
});

test("parseMultipleUrls returns single URL when only one present", () => {
  const result = parseMultipleUrls("Check out https://cars.com/a");
  assert.deepEqual(result, ["https://cars.com/a"]);
});

test("parseMultipleUrls returns empty for no URLs", () => {
  assert.deepEqual(parseMultipleUrls("just some text"), []);
  assert.deepEqual(parseMultipleUrls(""), []);
});

test("parseMultipleUrls handles comma-separated URLs", () => {
  const result = parseMultipleUrls("https://cars.com/a,https://autotrader.com/b");
  assert.deepEqual(result, ["https://cars.com/a", "https://autotrader.com/b"]);
});

test("parseMultipleUrls handles URLs with query params", () => {
  const result = parseMultipleUrls("https://cars.com/listing?id=123&ref=search");
  assert.deepEqual(result, ["https://cars.com/listing?id=123&ref=search"]);
});

test("createEmptyDraft sets label and empty state", () => {
  const a = createEmptyDraft("A");
  assert.equal(a.label, "A");
  assert.equal(a.state, "empty");
  assert.equal(a.url, "");
  assert.equal(a.notes, "");
  assert.equal(a.error, "");
  assert.equal(a.manual.year, "");
  assert.equal(a.manual.make, "");
  assert.equal(a.manual.model, "");
  assert.equal(a.result, null);

  const b = createEmptyDraft("B");
  assert.equal(b.label, "B");
});

test("draftToRequestText returns notes for url state when notes exist", () => {
  const draft = { ...createEmptyDraft("A"), state: "url" as const, url: "https://cars.com/a", notes: "2019 Toyota Camry" };
  assert.equal(draftToRequestText(draft), "2019 Toyota Camry");
});

test("draftToRequestText returns empty for url state when notes are empty", () => {
  const draft = { ...createEmptyDraft("A"), state: "url" as const, url: "https://cars.com/a" };
  assert.equal(draftToRequestText(draft), "");
});

test("draftToRequestText returns notes for notes state", () => {
  const draft = { ...createEmptyDraft("A"), state: "notes" as const, notes: "2019 Toyota Camry LE" };
  assert.equal(draftToRequestText(draft), "2019 Toyota Camry LE");
});

test("draftToRequestText joins manual fields", () => {
  const draft = {
    ...createEmptyDraft("A"),
    state: "manual" as const,
    manual: { year: "2019", make: "Toyota", model: "Camry", mileage: "50k", price: "$16k", titleStatus: "Clean", sellerNotes: "Runs great" },
  };
  assert.equal(draftToRequestText(draft), "2019, Toyota, Camry, 50k, $16k, Clean, Runs great");
});

test("draftToRequestText filters empty manual fields", () => {
  const draft = {
    ...createEmptyDraft("A"),
    state: "manual" as const,
    manual: { year: "2019", make: "Toyota", model: "Camry", mileage: "", price: "", titleStatus: "", sellerNotes: "" },
  };
  assert.equal(draftToRequestText(draft), "2019, Toyota, Camry");
});

test("draftToRequestText returns empty string for empty state", () => {
  assert.equal(draftToRequestText(createEmptyDraft("A")), "");
});

test("draftToRequestText returns empty string for error state", () => {
  const draft = { ...createEmptyDraft("A"), state: "error" as const, error: "something went wrong" };
  assert.equal(draftToRequestText(draft), "");
});

test("draftVehicleTitle returns manual fields for manual state", () => {
  const draft = { ...createEmptyDraft("B"), state: "manual" as const, manual: { ...createEmptyDraft("B").manual, year: "2020", make: "Honda", model: "Civic" } };
  assert.equal(draftVehicleTitle(draft), "2020 Honda Civic");
});

test("draftVehicleTitle returns Car X label for empty manual fields", () => {
  const draft = { ...createEmptyDraft("A"), state: "manual" as const };
  assert.equal(draftVehicleTitle(draft), "Car A");
});

test("draftVehicleTitle uses vehicleTitle when set", () => {
  const draft = { ...createEmptyDraft("A"), vehicleTitle: "2020 Honda Civic EX" };
  assert.equal(draftVehicleTitle(draft), "2020 Honda Civic EX");
});

test("computeComparison returns inconclusive when both null", () => {
  const result = computeComparison(null, null);
  assert.equal(result.winner, "inconclusive");
  assert.equal(result.winnerLabel, "No data");
});

test("computeComparison picks A when only A has data", () => {
  const a = makeResult({ score: 75 });
  const result = computeComparison(a, null);
  assert.equal(result.winner, "A");
  assert.equal(result.winnerLabel, "Only A has data");
});

test("computeComparison picks B when only B has data", () => {
  const b = makeResult({ score: 80 });
  const result = computeComparison(null, b);
  assert.equal(result.winner, "B");
  assert.equal(result.winnerLabel, "Only B has data");
});

test("computeComparison picks A when A scores significantly higher", () => {
  const a = makeResult({ score: 90, greenFlags: ["Well maintained"], redFlags: [] });
  const b = makeResult({ score: 60, greenFlags: [], redFlags: ["Accident reported"] });
  const result = computeComparison(a, b);
  assert.equal(result.winner, "A");
  assert.equal(result.winnerLabel, "Better deal");
  assert.ok(result.winnerReason.includes("points higher"));
});

test("computeComparison picks B when B scores significantly higher", () => {
  const a = makeResult({ score: 45, greenFlags: [], redFlags: ["No title"] });
  const b = makeResult({ score: 88, greenFlags: ["Clean history"], redFlags: [] });
  const result = computeComparison(a, b);
  assert.equal(result.winner, "B");
  assert.ok(result.winnerReason.includes("points higher"));
});

test("computeComparison returns tie when scores within 3 points", () => {
  const a = makeResult({ score: 72, verdict: "Good deal" });
  const b = makeResult({ score: 74, verdict: "Good deal" });
  const result = computeComparison(a, b);
  assert.equal(result.winner, "tie");
  assert.equal(result.winnerLabel, "Too close to call");
});

test("computeComparison priceDelta when car A is cheaper", () => {
  const a = makeResult({ estimatedFairValueRange: { low: 12000, high: 14000, note: "" } });
  const b = makeResult({ estimatedFairValueRange: { low: 15000, high: 17000, note: "" } });
  const result = computeComparison(a, b);
  assert.ok(result.priceDelta.includes("Car A is"));
});

test("computeComparison priceDelta when car B is cheaper", () => {
  const a = makeResult({ estimatedFairValueRange: { low: 20000, high: 23000, note: "" } });
  const b = makeResult({ estimatedFairValueRange: { low: 17000, high: 19000, note: "" } });
  const result = computeComparison(a, b);
  assert.ok(result.priceDelta.includes("Car B is"));
});

test("computeComparison priceDelta when both same price", () => {
  const a = makeResult({ estimatedFairValueRange: { low: 15000, high: 18000, note: "" } });
  const b = makeResult({ estimatedFairValueRange: { low: 15000, high: 18000, note: "" } });
  const result = computeComparison(a, b);
  assert.ok(result.priceDelta.includes("same"));
});

test("computeComparison riskDelta when A has fewer flags", () => {
  const a = makeResult({ redFlags: [] });
  const b = makeResult({ redFlags: ["Accident", "Flood damage"] });
  const result = computeComparison(a, b);
  assert.ok(result.riskDelta.includes("Car A has fewer risks"));
});

test("computeComparison riskDelta when B has fewer flags", () => {
  const a = makeResult({ redFlags: ["Accident", "Title issue", "Odometer rollback"] });
  const b = makeResult({ redFlags: [] });
  const result = computeComparison(a, b);
  assert.ok(result.riskDelta.includes("Car B has fewer risks"));
});

test("computeComparison riskDelta when both have same flags", () => {
  const a = makeResult({ redFlags: ["Accident"] });
  const b = makeResult({ redFlags: ["Flood damage"] });
  const result = computeComparison(a, b);
  assert.ok(result.riskDelta.includes("Both have the same"));
});

test("computeComparison missingInfoComparison when complete", () => {
  const a = makeResult({ missingInfo: [] });
  const b = makeResult({ missingInfo: [] });
  const result = computeComparison(a, b);
  assert.equal(result.missingInfoComparison, "Both listings have complete data.");
});

test("computeComparison missingInfoComparison when A has fewer gaps", () => {
  const a = makeResult({ missingInfo: ["VIN"] });
  const b = makeResult({ missingInfo: ["VIN", "Service history", "Title photo"] });
  const result = computeComparison(a, b);
  assert.ok(result.missingInfoComparison.includes("Car A has fewer gaps"));
});

test("computeComparison missingInfoComparison when B has fewer gaps", () => {
  const a = makeResult({ missingInfo: ["VIN", "Service history", "Title photo", "Mileage"] });
  const b = makeResult({ missingInfo: ["VIN"] });
  const result = computeComparison(a, b);
  assert.ok(result.missingInfoComparison.includes("Car B has fewer gaps"));
});

test("computeComparison sets aTitle and bTitle", () => {
  const a = makeResult({ score: 95 });
  const b = makeResult({ score: 60 });
  const result = computeComparison(a, b);
  assert.ok(typeof result.aTitle === "string");
  assert.ok(typeof result.bTitle === "string");
  assert.ok(result.aTitle.length > 0);
  assert.ok(result.bTitle.length > 0);
});
