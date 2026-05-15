import assert from "node:assert/strict";
import test from "node:test";
import { extractListingTextFromHtml, scrapeListingUrl } from "../src/lib/listing-scraper.ts";

const listingHtml = `<!doctype html>
<html>
  <head>
    <title>2019 Toyota Camry LE for sale</title>
    <meta name="description" content="Clean title Camry with 72,000 miles and service records.">
    <script type="application/ld+json">
      {"@type":"Vehicle","name":"2019 Toyota Camry LE","description":"One owner, clean title, asking $15,900.","mileageFromOdometer":"72000 miles"}
    </script>
  </head>
  <body>
    <nav>Home Search Saved</nav>
    <main>
      <h1>2019 Toyota Camry LE</h1>
      <p>Asking $15,900. 72,000 miles. Clean title. VIN available. New tires and service records included.</p>
      <p>Located in Austin, TX. No accidents reported by seller.</p>
    </main>
  </body>
</html>`;

test("extractListingTextFromHtml collects title, metadata, JSON-LD, and body text", () => {
  const extracted = extractListingTextFromHtml(listingHtml);

  assert.equal(extracted.title, "2019 Toyota Camry LE for sale");
  assert.match(extracted.text, /Clean title Camry/);
  assert.match(extracted.text, /One owner, clean title/);
  assert.match(extracted.text, /VIN available/);
});

test("scrapeListingUrl fetches a safe public URL and returns listing text", async () => {
  const fetcher = async () => new Response(listingHtml, {
    headers: { "content-type": "text/html; charset=utf-8" },
    status: 200,
  });

  const listing = await scrapeListingUrl("https://example.com/camry", fetcher);

  assert.equal(listing.engine, "safe-fetch");
  assert.equal(listing.url, "https://example.com/camry");
  assert.match(listing.text, /72,000 miles/);
});

test("scrapeListingUrl rejects redirects to private network URLs", async () => {
  const fetcher = async () => new Response("", {
    headers: { location: "http://127.0.0.1:3000/admin" },
    status: 302,
  });

  await assert.rejects(() => scrapeListingUrl("https://example.com/camry", fetcher), /blocked/i);
});
