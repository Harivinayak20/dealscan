import assert from "node:assert/strict";
import test from "node:test";

import { compactTitle, truncateMeta } from "../src/lib/seo.ts";

test("compactTitle removes a legacy DealScan suffix", () => {
  assert.equal(
    compactTitle("What Is a Documentation Fee? | Dealscan"),
    "What Is a Documentation Fee?",
  );
});

test("compactTitle uses a concise fallback before truncating", () => {
  assert.equal(
    compactTitle(
      "How Many Miles Does a Chevrolet Silverado 1500 Last? (Used Buyer's Guide)",
      "Chevrolet Silverado 1500 Lifespan & Mileage",
    ),
    "Chevrolet Silverado 1500 Lifespan & Mileage",
  );
});

test("compactTitle and the layout brand stay within 65 characters", () => {
  const stem = compactTitle(
    "Used car paperwork: how to handle title transfer, bill of sale, and registration",
  );
  assert.ok(`${stem} | DealScan.dev`.length <= 65);
  assert.doesNotMatch(stem, /[,:;\-–—]$/);
});

test("truncateMeta keeps descriptions at or below the requested limit", () => {
  const description = truncateMeta(
    "A practical used-car guide. This second sentence adds enough specific detail to make the search snippet useful without allowing it to become excessively long for results pages.",
  );
  assert.ok(description.length <= 160);
});
