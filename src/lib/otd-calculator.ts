// Out-the-door (OTD) price calculator. Pure functions only — the UI stays thin.
//
// State defaults REUSE the study dataset in src/lib/state-doc-fees.ts (the same
// data behind /research/dealer-fees-by-state and the /fees/states glossary):
//   - state list + names come from `stateDocFees`
//   - the default doc fee is `docFeeAvg`
//   - the title fee is parsed from `titleFee`
// The one thing that dataset does not carry as a number is the vehicle sales-tax
// rate, so SALES_TAX_RATE below adds just that single number per state (base
// state vehicle sales/excise tax, mid-2026). Everything else is derived from the
// shared data — we do not re-list names, doc fees, or title fees here.

import { stateDocFees } from "./state-doc-fees.ts";

// Base state vehicle sales/excise tax rate as a percent. Local/county tax is not
// included here — the calculator lets the user add a local rate on top. States
// with no vehicle sales tax are 0 (AK/NH have local-only or none; MT/OR/DE use
// other levies handled by their own paperwork).
export const SALES_TAX_RATE: Record<string, number> = {
  AL: 2, AK: 0, AZ: 5.6, AR: 6.5, CA: 7.25, CO: 2.9, CT: 6.35, DE: 4.25,
  DC: 6, FL: 6, GA: 7, HI: 4, ID: 6, IL: 6.25, IN: 7, IA: 5, KS: 6.5,
  KY: 6, LA: 4.45, ME: 5.5, MD: 6, MA: 6.25, MI: 6, MN: 6.875, MS: 5,
  MO: 4.225, MT: 0, NE: 5.5, NV: 6.85, NH: 0, NJ: 6.625, NM: 4, NY: 4,
  NC: 3, ND: 5, OH: 5.75, OK: 4.5, OR: 0, PA: 6, RI: 7, SC: 5, SD: 4,
  TN: 7, TX: 6.25, UT: 4.85, VT: 6, VA: 4.15, WA: 6.5, WV: 6, WI: 5, WY: 4,
};

// Typical first-year registration/plate cost. Real registration is usually
// value/weight/age-based, so this is a flat ballpark shown as an estimate; the
// UI tells the reader to verify with their DMV. Title fee is taken per-state.
export const REGISTRATION_ESTIMATE = 60;

export type OtdStateDefault = {
  abbr: string;
  name: string;
  salesTaxRate: number; // percent
  docFee: number;
  titleFee: number;
  registrationFee: number;
};

// Parse the leading dollar amount out of a "~$28" style string into a number.
function parseDollars(s: string): number {
  const m = s.replace(/,/g, "").match(/\$\s*(\d+(?:\.\d+)?)/);
  return m ? Math.round(Number(m[1])) : 0;
}

// Build the per-state defaults from the shared dealer-fee dataset. Sorted by
// name for a clean dropdown.
export const otdStateDefaults: OtdStateDefault[] = stateDocFees
  .map((s) => ({
    abbr: s.abbr,
    name: s.name,
    salesTaxRate: SALES_TAX_RATE[s.abbr] ?? 0,
    docFee: Math.round(s.docFeeAvg),
    titleFee: parseDollars(s.titleFee),
    registrationFee: REGISTRATION_ESTIMATE,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function getOtdStateDefault(abbr: string): OtdStateDefault | undefined {
  return otdStateDefaults.find((s) => s.abbr === abbr);
}

export type OtdInputs = {
  vehiclePrice: number;
  tradeIn?: number;
  salesTaxRate: number; // total percent applied to the taxable amount
  docFee: number;
  titleFee: number;
  registrationFee: number;
};

export type OtdLineItem = {
  label: string;
  amount: number;
};

export type OtdBreakdown = {
  vehiclePrice: number;
  tradeIn: number;
  taxableAmount: number;
  salesTax: number;
  docFee: number;
  titleFee: number;
  registrationFee: number;
  feesSubtotal: number; // doc + title + registration
  lineItems: OtdLineItem[];
  total: number; // out-the-door price
};

// Compute the out-the-door price. Most states tax the price AFTER the trade-in
// credit, so the trade-in reduces both the taxable base and the amount owed.
export function calculateOtd(inputs: OtdInputs): OtdBreakdown {
  const vehiclePrice = Math.max(0, inputs.vehiclePrice || 0);
  const tradeIn = Math.max(0, inputs.tradeIn || 0);
  const rate = Math.max(0, inputs.salesTaxRate || 0);
  const docFee = Math.max(0, inputs.docFee || 0);
  const titleFee = Math.max(0, inputs.titleFee || 0);
  const registrationFee = Math.max(0, inputs.registrationFee || 0);

  const taxableAmount = Math.max(0, vehiclePrice - tradeIn);
  const salesTax = Math.round(taxableAmount * (rate / 100));
  const feesSubtotal = docFee + titleFee + registrationFee;
  const total = Math.round(taxableAmount + salesTax + feesSubtotal);

  const lineItems: OtdLineItem[] = [
    { label: "Vehicle price", amount: vehiclePrice },
    { label: "Trade-in credit", amount: -tradeIn },
    { label: `Sales tax (${rate}%)`, amount: salesTax },
    { label: "Documentation fee", amount: docFee },
    { label: "Title fee", amount: titleFee },
    { label: "Registration / plates", amount: registrationFee },
  ];

  return {
    vehiclePrice,
    tradeIn,
    taxableAmount,
    salesTax,
    docFee,
    titleFee,
    registrationFee,
    feesSubtotal,
    lineItems,
    total,
  };
}

export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
