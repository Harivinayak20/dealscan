import test from "node:test";
import assert from "node:assert/strict";
import {
  buildCommonsImageSearchUrl,
  buildVehicleImageQuery,
  getCuratedVehicleImage,
  imageFromCommonsPage,
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

test("vehicleImageSearchTerms searches make and model without overfitting year", () => {
  assert.equal(vehicleImageSearchTerms("2020 Toyota Camry"), "toyota camry car");
});

test("buildCommonsImageSearchUrl targets Wikimedia Commons with CORS enabled", () => {
  const url = new URL(buildCommonsImageSearchUrl("2020 Honda Civic"));
  assert.equal(url.hostname, "commons.wikimedia.org");
  assert.equal(url.searchParams.get("origin"), "*");
  assert.match(url.searchParams.get("gsrsearch") ?? "", /honda civic/);
});

test("imageFromCommonsPage returns matching vehicle image metadata", () => {
  const image = imageFromCommonsPage(
    {
      title: "File:2020 Honda Civic sedan.jpg",
      imageinfo: [
        {
          thumburl: "https://upload.wikimedia.org/honda-civic.jpg",
          descriptionurl: "https://commons.wikimedia.org/wiki/File:2020_Honda_Civic_sedan.jpg",
          extmetadata: {
            ObjectName: { value: "2020 Honda Civic sedan" },
            Artist: { value: "Example photographer" },
            LicenseShortName: { value: "CC BY-SA 4.0" },
          },
        },
      ],
    },
    "2020 Honda Civic",
  );

  assert.ok(image);
  assert.equal(image.url, "https://upload.wikimedia.org/honda-civic.jpg");
  assert.match(image.alt, /Honda Civic/);
});

test("imageFromCommonsPage rejects unrelated image results", () => {
  const image = imageFromCommonsPage(
    {
      title: "File:Porsche 911 GT3 RS.jpg",
      imageinfo: [{ thumburl: "https://upload.wikimedia.org/porsche.jpg" }],
    },
    "2020 Honda Civic",
  );

  assert.equal(image, null);
});

test("commons search pages can be sorted by API result rank", () => {
  const pages = [{ title: "second", index: 2 }, { title: "first", index: 1 }];
  pages.sort((a, b) => (a.index ?? 999) - (b.index ?? 999));
  assert.equal(pages[0].title, "first");
});
