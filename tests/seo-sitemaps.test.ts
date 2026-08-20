import assert from "node:assert/strict";
import test from "node:test";

import {
  buildSitemap,
  buildSitemapPageSets,
  renderSitemapXml,
  sitemapPageSetNames,
} from "../src/lib/seo-sitemaps.ts";

test("SEO sitemap page sets cover every canonical exactly once", () => {
  const pageSets = buildSitemapPageSets();
  const allEntries = buildSitemap();
  const urls = allEntries.map((entry) => entry.url);

  for (const name of sitemapPageSetNames) {
    assert.ok(pageSets[name].length > 0, `${name} sitemap must not be empty`);
  }

  assert.equal(urls.length, new Set(urls).size, "sitemap URLs must be unique");
  assert.ok(urls.every((url) => url.startsWith("https://")), "sitemap URLs must be absolute HTTPS URLs");
  assert.ok(urls.every((url) => !url.includes("?")), "sitemap URLs must not contain query variants");
  assert.ok(urls.every((url) => !/\/problems\/\d{4}$/.test(url)), "retired problem pages must stay out");
  assert.ok(urls.every((url) => !/\/\d{4}-value$/.test(url)), "retired year-value pages must stay out");
});

test("page-set sitemap XML contains canonical URLs and valid lastmod values", () => {
  const xml = renderSitemapXml(buildSitemapPageSets().cars);

  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(xml, /<loc>https:\/\/dealscan\.dev\/cars\/used-toyota-camry\/value<\/loc>/);
  assert.match(xml, /<lastmod>\d{4}-\d{2}-\d{2}T00:00:00\.000Z<\/lastmod>/);
});

test("Phase 2 template changes publish a truthful recrawl date", () => {
  const pageSets = buildSitemapPageSets();
  const changedUrls = [
    "https://dealscan.dev/cars/used-toyota-camry/mileage",
    "https://dealscan.dev/best/best-used-cars-under-10k",
    "https://dealscan.dev/fees/states/new-york",
    "https://dealscan.dev/compare/toyota-camry-vs-honda-accord",
  ];

  for (const url of changedUrls) {
    const item = Object.values(pageSets).flat().find((entry) => entry.url === url);
    assert.ok(item, `${url} must remain in a sitemap page set`);
    assert.equal(new Date(item.lastModified as string | Date).toISOString(), "2026-08-14T00:00:00.000Z");
  }
});
