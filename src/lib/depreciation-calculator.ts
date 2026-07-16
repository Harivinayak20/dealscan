// Car depreciation calculator. Pure functions only — the UI stays thin.
//
// Uses a standard, transparent depreciation curve for a typical mainstream
// vehicle. Real depreciation varies by make/model/mileage/market, so these are
// clearly-labelled estimates. The constants below are the whole model:
//   - Year 1:        ~20% drop from purchase price
//   - Years 2–5:     ~15% per year of the remaining value
//   - Years 6+:      ~10% per year of the remaining value
// A floor keeps a car from depreciating to nothing — most vehicles retain some
// residual/scrap value.

export const YEAR_ONE_RATE = 0.2; // 20% in the first year
export const EARLY_YEAR_RATE = 0.15; // years 2–5
export const LATE_YEAR_RATE = 0.1; // year 6 onward
export const EARLY_YEAR_CUTOFF = 5; // last model year that uses EARLY_YEAR_RATE
export const RESIDUAL_FLOOR = 0.1; // never drop below 10% of purchase price

// The annual depreciation rate applied when going FROM the given age (in years
// of ownership from new) to the next year. Year index 1 is the first year of
// the car's life.
export function rateForYear(year: number): number {
  if (year <= 1) return YEAR_ONE_RATE;
  if (year <= EARLY_YEAR_CUTOFF) return EARLY_YEAR_RATE;
  return LATE_YEAR_RATE;
}

export type DepreciationRow = {
  age: number; // vehicle age in years (0 = brand new / purchase-as-new baseline)
  value: number; // estimated value at this age
  annualLoss: number; // value lost during this year
  pctOfOriginal: number; // value as a percent of purchase price (0–100)
};

export type DepreciationResult = {
  purchasePrice: number;
  currentAge: number;
  currentValue: number; // estimated value today
  ownershipYears: number;
  resaleValue: number; // estimated value at the end of the ownership period
  totalDepreciation: number; // purchase price minus resale value
  rows: DepreciationRow[]; // one row per year from new up to currentAge + ownershipYears
};

// Value of a brand-new car after `age` years, applying the curve year by year
// with a residual floor.
export function valueAtAge(purchasePrice: number, age: number): number {
  const floor = purchasePrice * RESIDUAL_FLOOR;
  let value = purchasePrice;
  for (let year = 1; year <= age; year++) {
    value = value * (1 - rateForYear(year));
  }
  return Math.max(floor, Math.round(value));
}

// Build the full projection. `currentAge` is how old the car is right now (0 for
// new). `ownershipYears` is how many more years you plan to keep it.
export function calculateDepreciation(
  purchasePrice: number,
  currentAge: number,
  ownershipYears: number,
): DepreciationResult {
  const price = Math.max(0, purchasePrice || 0);
  const age = Math.max(0, Math.round(currentAge || 0));
  const years = Math.max(0, Math.round(ownershipYears || 0));
  const endAge = age + years;

  const rows: DepreciationRow[] = [];
  let prevValue = price;
  for (let a = 0; a <= endAge; a++) {
    const value = valueAtAge(price, a);
    const annualLoss = a === 0 ? 0 : Math.max(0, prevValue - value);
    rows.push({
      age: a,
      value,
      annualLoss,
      pctOfOriginal: price > 0 ? Math.round((value / price) * 100) : 0,
    });
    prevValue = value;
  }

  const currentValue = valueAtAge(price, age);
  const resaleValue = valueAtAge(price, endAge);

  return {
    purchasePrice: price,
    currentAge: age,
    currentValue,
    ownershipYears: years,
    resaleValue,
    totalDepreciation: Math.max(0, price - resaleValue),
    rows,
  };
}

export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
