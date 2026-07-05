import assert from "node:assert/strict";
import test from "node:test";
import { extractListingTextFromHtml } from "../src/lib/listing-scraper.ts";
import { parseMileage, parsePrice, parseVehicleFromText } from "../src/lib/listing-parsers.ts";

// Platform-shaped fixtures: the wedge is "paste any listing URL", so the
// extractor + parser must pull year/make/price out of the markup patterns the
// big listing sites actually use (JSON-LD Vehicle/Product, OG meta, plain body).

function detect(text: string) {
  return { ...parseVehicleFromText(text), price: parsePrice(text), mileage: parseMileage(text) };
}

test("cars.com-style JSON-LD Vehicle with nested offers parses", () => {
  const html = `<!doctype html><html><head>
    <title>Used 2020 Honda Civic EX for Sale in Dallas, TX | Cars.com</title>
    <meta property="og:title" content="Used 2020 Honda Civic EX for Sale">
    <script type="application/ld+json">{
      "@context":"https://schema.org","@type":"Vehicle",
      "name":"2020 Honda Civic EX",
      "brand":{"@type":"Brand","name":"Honda"},
      "model":"Civic",
      "vehicleModelDate":"2020",
      "mileageFromOdometer":{"@type":"QuantitativeValue","value":"41,250","unitCode":"SMI"},
      "offers":{"@type":"Offer","price":"18995","priceCurrency":"USD"},
      "description":"2020 Honda Civic EX, 41,250 miles, clean title, asking $18,995."
    }</script></head>
    <body><h1>2020 Honda Civic EX</h1><div>$18,995 · 41,250 mi</div></body></html>`;

  const extracted = extractListingTextFromHtml(html);
  const vehicle = detect(extracted.text);
  assert.equal(vehicle.year, 2020);
  assert.equal(vehicle.make, "Honda");
  assert.equal(vehicle.price, 18995);
  assert.equal(vehicle.mileage, 41250);
});

test("cargurus-style OG meta + body pricing parses", () => {
  const html = `<!doctype html><html><head>
    <title>2018 Ford F-150 XLT - CarGurus</title>
    <meta property="og:title" content="2018 Ford F-150 XLT SuperCrew">
    <meta property="og:description" content="Great Deal. $24,500. 78,000 miles. Clean title.">
    </head><body>
    <h1>2018 Ford F-150 XLT SuperCrew</h1>
    <span>Price: $24,500</span><span>Mileage: 78,000 miles</span>
    <p>Clean title. One owner. Dealer serviced.</p>
    </body></html>`;

  const extracted = extractListingTextFromHtml(html);
  const vehicle = detect(extracted.text);
  assert.equal(vehicle.year, 2018);
  assert.equal(vehicle.make, "Ford");
  assert.equal(vehicle.price, 24500);
  assert.equal(vehicle.mileage, 78000);
});

test("carvana-style JSON-LD Product parses", () => {
  const html = `<!doctype html><html><head>
    <title>2021 Toyota RAV4 XLE | Carvana</title>
    <script type="application/ld+json">{
      "@type":"Product","name":"2021 Toyota RAV4 XLE",
      "offers":{"@type":"Offer","price":"27990","priceCurrency":"USD"},
      "description":"2021 Toyota RAV4 XLE with 33,000 miles. Clean title. $27,990."
    }</script></head>
    <body><h1>2021 Toyota RAV4 XLE</h1></body></html>`;

  const extracted = extractListingTextFromHtml(html);
  const vehicle = detect(extracted.text);
  assert.equal(vehicle.year, 2021);
  assert.equal(vehicle.make, "Toyota");
  assert.equal(vehicle.price, 27990);
});

test("dealer-site-style Vehicle JSON-LD with VIN parses and keeps the VIN", () => {
  const html = `<!doctype html><html><head>
    <title>Pre-Owned 2017 Chevrolet Silverado 1500 LT | Smith Chevrolet</title>
    <script type="application/ld+json">{
      "@type":"Vehicle","name":"2017 Chevrolet Silverado 1500 LT",
      "vehicleIdentificationNumber":"3GCUKREC5HG123456",
      "offers":{"@type":"Offer","price":"21999"},
      "description":"2017 Chevrolet Silverado 1500 LT, 96,000 miles, $21,999, VIN 3GCUKREC5HG123456"
    }</script></head>
    <body><h1>Pre-Owned 2017 Chevrolet Silverado 1500 LT</h1><p>Call today!</p></body></html>`;

  const extracted = extractListingTextFromHtml(html);
  const vehicle = detect(extracted.text);
  assert.equal(vehicle.year, 2017);
  assert.equal(vehicle.make, "Chevrolet");
  assert.equal(vehicle.price, 21999);
  assert.match(extracted.text, /3GCUKREC5HG123456/);
});

test("craigslist-style plain body text parses", () => {
  const html = `<!doctype html><html><head><title>2014 Subaru Outback - $8,900 (Portland)</title></head>
    <body><section id="postingbody">
    2014 Subaru Outback 2.5i Premium. 142k miles. Runs great, recent timing service,
    new tires. Clean title in hand. Asking $8,900 OBO. No accidents.
    </section></body></html>`;

  const extracted = extractListingTextFromHtml(html);
  const vehicle = detect(extracted.text);
  assert.equal(vehicle.year, 2014);
  assert.equal(vehicle.make, "Subaru");
  assert.equal(vehicle.price, 8900);
  assert.equal(vehicle.mileage, 142000);
});

test("autotrader-style meta description with price parses", () => {
  const html = `<!doctype html><html><head>
    <title>Used 2019 Mazda CX-5 Touring for Sale - Autotrader</title>
    <meta name="description" content="Used 2019 Mazda CX-5 Touring, 52,300 miles, $19,750, clean title, located in Phoenix, AZ.">
    </head><body><h1>2019 Mazda CX-5 Touring</h1></body></html>`;

  const extracted = extractListingTextFromHtml(html);
  const vehicle = detect(extracted.text);
  assert.equal(vehicle.year, 2019);
  assert.equal(vehicle.make, "Mazda");
  assert.equal(vehicle.price, 19750);
  assert.equal(vehicle.mileage, 52300);
});
