import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateOtd,
  getOtdStateDefault,
  otdStateDefaults,
  SALES_TAX_RATE,
} from "../otd-calculator.ts";

test("state defaults are built from the shared dealer-fee dataset", () => {
  // 50 states + DC come from stateDocFees.
  assert.equal(otdStateDefaults.length, 51);
  // Sorted by name.
  assert.equal(otdStateDefaults[0].name, "Alabama");
  // Every state carries a numeric sales-tax rate and doc fee.
  for (const s of otdStateDefaults) {
    assert.equal(typeof s.salesTaxRate, "number");
    assert.ok(s.docFee >= 0);
    assert.equal(s.salesTaxRate, SALES_TAX_RATE[s.abbr]);
  }
});

test("getOtdStateDefault reuses California's capped $85 doc fee", () => {
  const ca = getOtdStateDefault("CA");
  assert.ok(ca);
  assert.equal(ca!.docFee, 85);
  assert.equal(ca!.salesTaxRate, 7.25);
});

test("calculateOtd itemizes tax and fees into a total", () => {
  const r = calculateOtd({
    vehiclePrice: 20000,
    tradeIn: 0,
    salesTaxRate: 7,
    docFee: 500,
    titleFee: 50,
    registrationFee: 60,
  });
  assert.equal(r.salesTax, 1400); // 7% of 20000
  assert.equal(r.feesSubtotal, 610);
  assert.equal(r.total, 20000 + 1400 + 610);
});

test("trade-in reduces the taxable amount and the total", () => {
  const r = calculateOtd({
    vehiclePrice: 20000,
    tradeIn: 5000,
    salesTaxRate: 10,
    docFee: 0,
    titleFee: 0,
    registrationFee: 0,
  });
  assert.equal(r.taxableAmount, 15000);
  assert.equal(r.salesTax, 1500); // taxed after trade-in credit
  assert.equal(r.total, 16500);
});

test("trade-in larger than price floors taxable amount at zero", () => {
  const r = calculateOtd({
    vehiclePrice: 10000,
    tradeIn: 15000,
    salesTaxRate: 8,
    docFee: 100,
    titleFee: 0,
    registrationFee: 0,
  });
  assert.equal(r.taxableAmount, 0);
  assert.equal(r.salesTax, 0);
  assert.equal(r.total, 100); // only the doc fee remains
});

test("negative and missing inputs are clamped", () => {
  const r = calculateOtd({
    vehiclePrice: -5000,
    salesTaxRate: -3,
    docFee: -10,
    titleFee: 0,
    registrationFee: 0,
  } as never);
  assert.equal(r.total, 0);
  assert.equal(r.salesTax, 0);
});

test("line items include a negative trade-in credit", () => {
  const r = calculateOtd({
    vehiclePrice: 20000,
    tradeIn: 3000,
    salesTaxRate: 6,
    docFee: 300,
    titleFee: 50,
    registrationFee: 60,
  });
  const credit = r.lineItems.find((li) => li.label === "Trade-in credit");
  assert.equal(credit!.amount, -3000);
});
