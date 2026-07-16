import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateDepreciation,
  rateForYear,
  valueAtAge,
  EARLY_YEAR_RATE,
  LATE_YEAR_RATE,
  YEAR_ONE_RATE,
} from "../depreciation-calculator.ts";

test("rateForYear follows the standard curve", () => {
  assert.equal(rateForYear(1), YEAR_ONE_RATE); // 20% year 1
  assert.equal(rateForYear(2), EARLY_YEAR_RATE); // 15% years 2-5
  assert.equal(rateForYear(5), EARLY_YEAR_RATE);
  assert.equal(rateForYear(6), LATE_YEAR_RATE); // 10% year 6+
  assert.equal(rateForYear(12), LATE_YEAR_RATE);
});

test("valueAtAge drops ~20% in the first year", () => {
  assert.equal(valueAtAge(30000, 0), 30000);
  assert.equal(valueAtAge(30000, 1), 24000); // 30000 * 0.8
  assert.equal(valueAtAge(30000, 2), 20400); // 24000 * 0.85
});

test("value never falls below the 10% residual floor", () => {
  const v = valueAtAge(30000, 40);
  assert.equal(v, 3000); // 10% of 30000
});

test("calculateDepreciation projects from current age through ownership", () => {
  const r = calculateDepreciation(30000, 0, 5);
  assert.equal(r.currentValue, 30000);
  assert.equal(r.rows.length, 6); // ages 0..5
  assert.equal(r.rows[0].annualLoss, 0);
  assert.equal(r.rows[1].annualLoss, 6000); // first-year loss
  assert.equal(r.resaleValue, valueAtAge(30000, 5));
  assert.equal(r.totalDepreciation, 30000 - r.resaleValue);
});

test("current age offsets the projection", () => {
  const r = calculateDepreciation(30000, 3, 2);
  assert.equal(r.currentAge, 3);
  assert.equal(r.currentValue, valueAtAge(30000, 3));
  assert.equal(r.resaleValue, valueAtAge(30000, 5));
  assert.equal(r.rows.length, 6); // ages 0..(3+2)
});

test("pctOfOriginal is expressed 0-100", () => {
  const r = calculateDepreciation(30000, 0, 1);
  assert.equal(r.rows[0].pctOfOriginal, 100);
  assert.equal(r.rows[1].pctOfOriginal, 80);
});

test("zero purchase price is handled without dividing by zero", () => {
  const r = calculateDepreciation(0, 2, 3);
  assert.equal(r.currentValue, 0);
  assert.equal(r.resaleValue, 0);
  assert.equal(r.rows[0].pctOfOriginal, 0);
});
