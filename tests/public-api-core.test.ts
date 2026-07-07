import assert from "node:assert/strict";
import test from "node:test";
import type { AnalyzeListingResult } from "../src/lib/analyzer-types.ts";
import {
  analyzeInputSchema,
  manualDetailsToText,
  PUBLIC_API_VERSION,
  PublicApiError,
  resolvePublicListing,
  toPublicResponse,
} from "../src/lib/public-api-core.ts";

const listingHtml = `<!doctype html>
<html>
  <head><title>2019 Toyota Camry LE for sale</title></head>
  <body><main><h1>2019 Toyota Camry LE</h1>
  <p>Asking $15,900. 72,000 miles. Clean title. One owner. Service records included.</p></main></body>
</html>`;

const okFetcher = async () =>
  new Response(listingHtml, { headers: { "content-type": "text/html" }, status: 200 });

test("analyzeInputSchema requires at least one of url/text/manualDetails", () => {
  assert.equal(analyzeInputSchema.safeParse({}).success, false);
  assert.equal(analyzeInputSchema.safeParse({ text: "hello" }).success, true);
  assert.equal(analyzeInputSchema.safeParse({ url: "https://x.com/a" }).success, true);
});

test("analyzeInputSchema rejects invalid url and unknown keys", () => {
  assert.equal(analyzeInputSchema.safeParse({ url: "not-a-url" }).success, false);
  assert.equal(analyzeInputSchema.safeParse({ text: "hi", bogus: 1 }).success, false);
});

test("resolvePublicListing scrapes a url into a listing request", async () => {
  const { request, source } = await resolvePublicListing(
    { url: "https://example.com/camry" },
    okFetcher,
  );
  assert.equal(request.inputType, "url");
  assert.equal(request.sourceUrl, "https://example.com/camry");
  assert.match(request.listingText, /72,000 miles/);
  assert.equal(source.type, "url");
});

test("resolvePublicListing blocks Facebook/Instagram with a 422", async () => {
  await assert.rejects(
    () => resolvePublicListing({ url: "https://www.facebook.com/marketplace/item/1" }),
    (err: unknown) => err instanceof PublicApiError && err.status === 422,
  );
});

test("resolvePublicListing maps HTTP 403 blocks to a friendly 422", async () => {
  const blockedFetcher = async () => new Response("", { status: 403 });
  await assert.rejects(
    () => resolvePublicListing({ url: "https://example.com/blocked" }, blockedFetcher),
    (err: unknown) =>
      err instanceof PublicApiError && err.status === 422 && /send the ad text/i.test(err.message),
  );
});

test("resolvePublicListing accepts pasted text", async () => {
  const { request, source } = await resolvePublicListing({
    text: "2018 Honda Accord EX, 60k miles, clean title, $17,000 firm.",
  });
  assert.equal(request.inputType, "text");
  assert.equal(source.type, "text");
});

test("resolvePublicListing rejects too-short text with 422", async () => {
  await assert.rejects(
    () => resolvePublicListing({ text: "cheap car" }),
    (err: unknown) => err instanceof PublicApiError && err.status === 422,
  );
});

test("resolvePublicListing builds text from manual details", async () => {
  const { request, source } = await resolvePublicListing({
    manualDetails: { year: "2020", make: "Mazda", model: "CX-5", price: "$22,000", mileage: "35,000" },
  });
  assert.equal(request.inputType, "manual");
  assert.equal(source.type, "manual");
  assert.match(request.listingText, /Year: 2020/);
  assert.match(request.listingText, /Make: Mazda/);
});

test("manualDetailsToText omits empty fields", () => {
  const text = manualDetailsToText({ year: "2021", make: "", model: "Corolla" });
  assert.match(text, /Year: 2021/);
  assert.match(text, /Model: Corolla/);
  assert.doesNotMatch(text, /Make:/);
});

test("toPublicResponse maps internal result into the v1 envelope", () => {
  const result: AnalyzeListingResult = {
    score: 82,
    verdict: "Decent Deal",
    summary: "Solid listing.",
    estimatedFairValueRange: { low: 16000, high: 18000, note: "estimate" },
    suggestedOfferRange: { low: 15500, high: 17000, note: "offer" },
    categories: [{ label: "Price", score: 8, note: "fair" }],
    redFlags: ["No service records"],
    greenFlags: ["Clean title"],
    missingInfo: ["VIN"],
    negotiationTip: "Ask for records.",
    sellerQuestions: ["Any accidents?"],
    confidence: "Medium",
  };

  const out = toPublicResponse(result, "local", false, { type: "text" });
  assert.equal(out.apiVersion, PUBLIC_API_VERSION);
  assert.equal(out.analysis.score, 82);
  assert.deepEqual(out.analysis.fairValue, result.estimatedFairValueRange);
  assert.deepEqual(out.analysis.suggestedOffer, result.suggestedOfferRange);
  assert.equal(out.meta.analysisMode, "local");
  assert.equal(out.meta.cached, false);
  assert.match(out.meta.disclaimer, /independent estimate/i);
});
