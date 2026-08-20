import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("legacy per-year value pages permanently redirect to the model value hub", () => {
  const config = read("next.config.ts");

  assert.match(config, /source:\s*"\/cars\/:slug\/:yearValue\(\\\\d\{4\}-value\)"/);
  assert.match(config, /destination:\s*"\/cars\/:slug\/value"/);
  assert.match(config, /permanent:\s*true/);
});

test("legacy problem-year pages permanently redirect without generating duplicate pages", () => {
  const config = read("next.config.ts");
  const middleware = read("middleware.ts");
  const problemPage = new URL("../src/app/cars/[slug]/problems/[year]/page.tsx", import.meta.url);

  assert.match(config, /source:\s*"\/cars\/:slug\/problems\/:year\(\\\\d\{4\}\)"/);
  assert.match(config, /destination:\s*"\/cars\/:slug\/years-to-avoid"/);
  assert.match(middleware, /legacyProblemPage/);
  assert.equal(existsSync(problemPage), false);
});

test("the sitemap emits model value hubs without legacy year-value URLs", () => {
  const sitemap = read("src/app/sitemap.ts");
  const sitemapBuilder = read("src/lib/seo-sitemaps.ts");

  assert.match(sitemap, /buildSitemap/);
  assert.match(sitemapBuilder, /entry\(`\/cars\/\$\{car\.slug\}\/value`/);
  assert.doesNotMatch(sitemapBuilder, /year}-value|yearValue|\d\{4\}-value/);
});

test("deprecated HowTo schema is absent from indexable content pages", () => {
  const guidePage = read("src/app/guides/[slug]/page.tsx");
  const scoringPage = read("src/app/how-scoring-works/page.tsx");

  assert.doesNotMatch(guidePage, /"@type":\s*"HowTo(?:Step)?"/);
  assert.doesNotMatch(scoringPage, /"@type":\s*"HowTo(?:Step)?"/);
});
