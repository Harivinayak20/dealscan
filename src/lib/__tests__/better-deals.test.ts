import assert from "node:assert/strict";
import test from "node:test";
import { extractZip } from "../better-deals.ts";

test("extractZip reads a ZIP that follows a state abbreviation", () => {
  assert.equal(extractZip("Located in Austin, TX 78701. Runs great."), "78701");
  assert.equal(extractZip("Dallas TX 75201"), "75201");
  assert.equal(extractZip("Seattle, WA 98101-1234"), "98101");
});

test("extractZip ignores prices and mileage that look like ZIPs", () => {
  assert.equal(extractZip("$18,995, 62,000 miles, clean title"), null);
  assert.equal(extractZip("Price 25000 miles 84000"), null);
});

test("extractZip returns null when there is no location", () => {
  assert.equal(extractZip("no location here"), null);
});
