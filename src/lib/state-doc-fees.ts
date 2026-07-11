// Data for the /research/dealer-fees-by-state study: a citable, source-backed
// snapshot of used-car dealer documentation fees, caps, and title/registration
// costs in all 50 states + DC. Self-contained on purpose — do NOT merge with
// src/lib/state-fees.ts, which powers the /fees/states glossary pages.
//
// Sources (accessed 2026-07-11):
//   - docFeeAvg: CarEdge, "Car Dealer Doc Fee by State in 2026"
//       https://caredge.com/guides/car-dealer-doc-fee-by-state
//   - capped/capAmount: RealCarTips "Average Dealer Documentation Fees by State"
//       https://www.realcartips.com/newcars/482-documentation-fees-by-state.shtml
//       and Edmunds "What New Car Fees Should You Pay?" (CA $85, NY $175 caps)
//       https://www.edmunds.com/car-buying/what-fees-should-you-pay.html
//   - titleFee / regNote: state DMV fee schedules aggregated by
//       https://www.factorywarrantylist.com/dmv-fees-by-state.html and
//       https://worldpopulationreview.com/state-rankings/car-registration-fees-by-state
//
// "Average" = typical charged doc fee reported by CarEdge's 2026 dataset. In
// capped states the average is at or near the statutory cap because dealers
// charge the maximum. Several caps are CPI-indexed and adjust yearly — marked
// "(indexed)". Title and registration figures are ballparks; registration is
// usually value/weight/age-based, so they are ranges, not fixed prices.

export type StateDocFee = {
  abbr: string;
  name: string;
  docFeeAvg: number; // typical charged doc fee, USD (CarEdge 2026)
  capped: boolean; // is the doc fee limited by state law?
  capAmount: string; // "—" if uncapped, else the statutory limit (may be indexed)
  titleFee: string; // ballpark, one line
  regNote: string; // registration ballpark / basis
};

export const DATA_UPDATED = "2026-07-11";

const r = (
  abbr: string,
  name: string,
  docFeeAvg: number,
  capped: boolean,
  capAmount: string,
  titleFee: string,
  regNote: string,
): StateDocFee => ({ abbr, name, docFeeAvg, capped, capAmount, titleFee, regNote });

export const stateDocFees: StateDocFee[] = [
  r("AL", "Alabama", 489, false, "—", "~$18", "Weight-based; ~$23–$105/yr"),
  r("AK", "Alaska", 299, false, "—", "~$15", "~$100 biennial"),
  r("AZ", "Arizona", 499, false, "—", "~$4", "Value-based vehicle license tax, yearly"),
  r("AR", "Arkansas", 129, true, "$129", "~$10", "~$17–$30/yr by weight"),
  r("CA", "California", 85, true, "$85", "~$28", "Value-based; several hundred $/yr on newer cars"),
  r("CO", "Colorado", 699, false, "—", "~$7", "Ownership tax by age and value"),
  r("CT", "Connecticut", 599, false, "—", "~$25", "~$120 biennial"),
  r("DE", "Delaware", 475, false, "—", "~$35", "~$40/yr"),
  r("DC", "District of Columbia", 300, false, "—", "~$26", "Weight-based; ~$72–$155/yr"),
  r("FL", "Florida", 999, false, "—", "~$78", "~$28–$46/yr + one-time $225 new-plate fee"),
  r("GA", "Georgia", 599, false, "—", "~$18", "~$20/yr (7% one-time TAVT on value)"),
  r("HI", "Hawaii", 395, false, "—", "~$5", "Weight-based; ~$45–$75/yr+"),
  r("ID", "Idaho", 399, false, "—", "~$14", "~$45–$69/yr by age"),
  r("IL", "Illinois", 347, true, "~$347 (indexed)", "~$165", "~$151/yr"),
  r("IN", "Indiana", 199, false, "—", "~$15", "~$21/yr + excise tax by value/age"),
  r("IA", "Iowa", 180, true, "$180", "~$25", "Value + weight based, yearly"),
  r("KS", "Kansas", 499, false, "—", "~$10", "~$30–$45/yr + vehicle property tax"),
  r("KY", "Kentucky", 450, false, "—", "~$9", "~$21/yr + property tax"),
  r("LA", "Louisiana", 425, true, "~$425 (indexed)", "~$68", "~$20–$82/yr by value"),
  r("ME", "Maine", 499, false, "—", "~$33", "~$35/yr + local excise tax by value"),
  r("MD", "Maryland", 499, true, "$500", "~$100", "~$135–$187 biennial"),
  r("MA", "Massachusetts", 459, false, "—", "~$75", "~$60 biennial + local excise tax"),
  r("MI", "Michigan", 260, true, "$260 or 5% (indexed)", "~$15", "Value-based, yearly"),
  r("MN", "Minnesota", 125, true, "$125", "~$8+", "Value-based; drops as car ages"),
  r("MS", "Mississippi", 425, false, "—", "~$9", "~$14/yr + ad valorem tax"),
  r("MO", "Missouri", 565, true, "~$565 (indexed)", "~$8.50", "~$24–$87/yr by horsepower"),
  r("MT", "Montana", 299, false, "—", "~$12", "Age-based; ~$28–$217/yr"),
  r("NE", "Nebraska", 299, false, "—", "~$10", "~$15/yr + motor vehicle tax"),
  r("NV", "Nevada", 499, false, "—", "~$29", "$33/yr + governmental services tax by value"),
  r("NH", "New Hampshire", 375, false, "—", "~$25", "Town + state by weight/value; ~$60–$600/yr"),
  r("NJ", "New Jersey", 695, false, "—", "~$60", "~$35–$85/yr by weight/age"),
  r("NM", "New Mexico", 339, false, "—", "~$5+", "~$27–$62/yr"),
  r("NY", "New York", 175, true, "$175", "~$50", "Weight-based; ~$26–$140 biennial"),
  r("NC", "North Carolina", 699, false, "—", "~$56", "~$38/yr + vehicle property tax"),
  r("ND", "North Dakota", 299, false, "—", "~$5", "Weight/age-based; ~$49–$274/yr"),
  r("OH", "Ohio", 250, true, "$250 or 10% of price", "~$15", "~$31/yr + local permissive tax"),
  r("OK", "Oklahoma", 599, false, "—", "~$11", "Age-based; ~$26–$96/yr"),
  r("OR", "Oregon", 250, true, "$250 ($200 without e-filing)", "~$101–$192", "~$126–$316 per 2 years"),
  r("PA", "Pennsylvania", 449, true, "~$449 (indexed)", "~$67", "~$45/yr"),
  r("RI", "Rhode Island", 399, false, "—", "~$54", "~$30–$60/yr by weight"),
  r("SC", "South Carolina", 400, false, "—", "~$15", "~$40 biennial + vehicle property tax"),
  r("SD", "South Dakota", 200, false, "—", "~$10", "Weight-based; ~$36–$144/yr"),
  r("TN", "Tennessee", 499, false, "—", "~$14", "~$29/yr + county wheel tax"),
  r("TX", "Texas", 150, true, "$150", "~$33", "~$51–$54/yr + local fees"),
  r("UT", "Utah", 299, false, "—", "~$6", "Age-based uniform fee; ~$10–$150/yr"),
  r("VT", "Vermont", 200, false, "—", "~$35", "~$76–$132/yr"),
  r("VA", "Virginia", 799, false, "—", "~$15", "~$31–$46/yr + local property tax"),
  r("WA", "Washington", 199, true, "$200", "~$15", "~$30/yr + RTA excise tax in Sound Transit area"),
  r("WV", "West Virginia", 250, true, "$175 (statutory)", "~$15", "~$51.50/yr + property tax"),
  r("WI", "Wisconsin", 299, false, "—", "~$164.50", "~$85/yr"),
  r("WY", "Wyoming", 500, false, "—", "~$15", "County fee by value + $30 state fee"),
];

// --- Derived rankings for the study tables -------------------------------

export const cappedCount = stateDocFees.filter((s) => s.capped).length;
export const uncappedCount = stateDocFees.length - cappedCount;

export const highestDocFees = [...stateDocFees]
  .sort((a, b) => b.docFeeAvg - a.docFeeAvg)
  .slice(0, 10);

export const lowestDocFees = [...stateDocFees]
  .sort((a, b) => a.docFeeAvg - b.docFeeAvg)
  .slice(0, 10);

export const nationalAverageDocFee = Math.round(
  stateDocFees.reduce((sum, s) => sum + s.docFeeAvg, 0) / stateDocFees.length,
);
