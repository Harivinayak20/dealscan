import assert from "node:assert/strict";
import test from "node:test";
import { looksLikeCarListing, looksLikeSearchResultsPage, looksSoldOrRemoved } from "../listing-scraper.ts";

const REAL_LISTING = "2017 Acura TLX 3.5L V6, $17,450, 69,000 miles. Dallas, TX 75201.";

test("looksLikeCarListing accepts a real listing", () => {
  assert.equal(looksLikeCarListing(REAL_LISTING), true);
  assert.equal(looksLikeCarListing("2019 Honda Civic EX 62,000 miles clean title"), true);
});

test("looksLikeCarListing accepts a year glued to the model (Firecrawl markdown)", () => {
  // Firecrawl renders Carvana titles as "2025ToyotaCamry" with no space after the year.
  assert.equal(looksLikeCarListing("# 2025ToyotaCamry LE Sedan 4D 13,434 miles"), true);
});

test("looksLikeCarListing accepts classic cars (pre-1980)", () => {
  // Hemmings, eBay Motors, and Bring a Trailer sell collector cars.
  assert.equal(looksLikeCarListing("1967 Ford Mustang Fastback, $48,500, 62,000 miles"), true);
  assert.equal(looksLikeCarListing("1939 BMW 327 Cabriolet current bid $85,000"), true);
});

test("looksLikeCarListing still rejects a year buried inside a longer number", () => {
  assert.equal(looksLikeCarListing("Stock number 20255 reference 84000 unit"), false);
});

test("looksSoldOrRemoved flags a sold or pulled listing", () => {
  assert.equal(looksSoldOrRemoved("Sold. This vehicle is no longer available. 2025 Toyota Camry"), true);
  assert.equal(looksSoldOrRemoved("2017 Acura TLX, $17,450, 69,000 miles, clean title"), false);
});

test("looksLikeCarListing rejects a bot-block page", () => {
  // The Autotrader block page is served as HTTP 200 and cleared the old 80-character guard.
  const blockPage =
    "Autotrader - page unavailable We're sorry for any inconvenience, but the site is " +
    "currently unavailable. Please contact our support team for help. Incident Number: 18.d2281ab8";

  assert.equal(looksLikeCarListing(blockPage), false);
});

test("looksLikeCarListing rejects navigation chrome", () => {
  assert.equal(looksLikeCarListing("Home Search Sign In Help Privacy Policy Contact Us About"), false);
});

test("looksLikeSearchResultsPage rejects a browse page full of inventory", () => {
  const title = "Used Acura Cars for Sale near Houston, TX - CarGurus";
  const text = "2018 $21,000 2019 $23,500 2020 $25,900 2017 $18,400 2016 $15,200 2021 $28,750";

  assert.equal(looksLikeSearchResultsPage(title, text), true);
});

test("looksLikeSearchResultsPage leaves a single listing alone", () => {
  // A real listing page may show a couple of related cars; that must not trip the guard.
  assert.equal(looksLikeSearchResultsPage("2017 Acura TLX for sale in Dallas", REAL_LISTING), false);
  assert.equal(
    looksLikeSearchResultsPage("Used Acura Cars for Sale - CarGurus", "2017 Acura TLX $17,450"),
    false,
  );
});
