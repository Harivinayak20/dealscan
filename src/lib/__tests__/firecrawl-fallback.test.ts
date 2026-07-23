import assert from "node:assert/strict";
import test from "node:test";
import { scrapeListingUrl, BlockedListingError } from "../listing-scraper.ts";
import { hasFirecrawl, scrapeViaFirecrawl } from "../firecrawl.ts";

const CAR_HTML =
  "<html><head><title>2017 Acura TLX 3.5L V6 for sale in Dallas</title></head><body>" +
  "<h1>2017 Acura TLX 3.5L V6</h1><p>Asking $17,450, 69,000 miles, clean title, one owner.</p>" +
  "<p>Well maintained, no accidents, service records available. Located in Dallas, TX 75201.</p>" +
  "</body></html>";

function htmlResponse(status: number, html = ""): Response {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: () => "text/html" },
    body: null,
    text: async () => html,
  } as unknown as Response;
}

const URL = "https://www.example.com/car/123";

test("hasFirecrawl is false without a key", () => {
  delete process.env.FIRECRAWL_API_KEY;
  assert.equal(hasFirecrawl(), false);
});

test("scrapeViaFirecrawl throws without a key", async () => {
  delete process.env.FIRECRAWL_API_KEY;
  await assert.rejects(() => scrapeViaFirecrawl(URL), /not configured/i);
});

test("without a key, direct fetch reads a normal listing", async () => {
  delete process.env.FIRECRAWL_API_KEY;
  const listing = await scrapeListingUrl(URL, async () => htmlResponse(200, CAR_HTML));

  assert.equal(listing.engine, "safe-fetch");
  assert.match(listing.text, /Acura TLX/);
});

test("a block with no Firecrawl key surfaces the friendly blocked message", async () => {
  delete process.env.FIRECRAWL_API_KEY;
  await assert.rejects(
    () => scrapeListingUrl(URL, async () => htmlResponse(403)),
    (err: unknown) => err instanceof BlockedListingError && /paste the listing text/i.test((err as Error).message),
  );
});

function stubFirecrawlFetch(markdown: string) {
  return (async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      success: true,
      data: { markdown, metadata: { title: "2017 Acura TLX", url: URL } },
    }),
  })) as unknown as typeof fetch;
}

const FC_MARKDOWN =
  "# 2017 Acura TLX 3.5L V6\n\nAsking $17,450, 69,000 miles, clean title, one owner. " +
  "No accidents, service records available. Located in Dallas, TX 75201.";

test("with a key, EVERY link goes through Firecrawl first, even when direct fetch would succeed", async () => {
  process.env.FIRECRAWL_API_KEY = "test-key";
  const realFetch = globalThis.fetch;
  globalThis.fetch = stubFirecrawlFetch(FC_MARKDOWN);
  // Direct fetcher would return perfectly good HTML, but it must not be used.
  const directFetcher = async () => {
    throw new Error("direct fetch should not be called when Firecrawl is configured");
  };

  try {
    const listing = await scrapeListingUrl(URL, directFetcher);
    assert.equal(listing.engine, "firecrawl");
    assert.match(listing.text, /Acura TLX/);
  } finally {
    globalThis.fetch = realFetch;
    delete process.env.FIRECRAWL_API_KEY;
  }
});

test("if Firecrawl errors as a service, it falls back to direct fetch", async () => {
  process.env.FIRECRAWL_API_KEY = "test-key";
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async () => ({ ok: false, status: 500, json: async () => ({}) })) as unknown as typeof fetch;

  try {
    const listing = await scrapeListingUrl(URL, async () => htmlResponse(200, CAR_HTML));
    assert.equal(listing.engine, "safe-fetch");
    assert.match(listing.text, /Acura TLX/);
  } finally {
    globalThis.fetch = realFetch;
    delete process.env.FIRECRAWL_API_KEY;
  }
});
