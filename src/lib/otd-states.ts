// Per-state helpers for the programmatic /otd-calculator/[state] pages.
//
// Everything here is DERIVED from otdStateDefaults (which itself comes from the
// shared state-doc-fees dataset) — no new fee numbers are invented. We only add
// two things the dataset does not carry: a URL slug per state and a hand-built
// map of geographically neighboring states for internal linking.

import { otdStateDefaults, type OtdStateDefault } from "./otd-calculator.ts";

export type OtdStatePage = OtdStateDefault & { slug: string };

// URL slug from the state name: lowercase, spaces -> hyphens.
export function stateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const otdStatePages: OtdStatePage[] = otdStateDefaults.map((s) => ({
  ...s,
  slug: stateSlug(s.name),
}));

export function getOtdStatePage(slug: string): OtdStatePage | undefined {
  return otdStatePages.find((s) => s.slug === slug);
}

// Geographic neighbors by state abbreviation, used to link nearby state pages.
// A few small/island states get their closest mainland picks.
const NEIGHBORS: Record<string, string[]> = {
  AL: ["MS", "TN", "GA", "FL"], AK: ["WA", "OR", "CA", "HI"],
  AZ: ["CA", "NV", "UT", "NM"], AR: ["MO", "TN", "MS", "LA", "TX", "OK"],
  CA: ["OR", "NV", "AZ"], CO: ["WY", "NE", "KS", "OK", "NM", "UT"],
  CT: ["NY", "MA", "RI"], DE: ["MD", "PA", "NJ"],
  DC: ["MD", "VA", "DE"], FL: ["GA", "AL", "SC"],
  GA: ["FL", "AL", "TN", "NC", "SC"], HI: ["CA", "AK", "WA", "OR"],
  ID: ["WA", "OR", "NV", "UT", "WY", "MT"], IL: ["WI", "IN", "KY", "MO", "IA"],
  IN: ["IL", "MI", "OH", "KY"], IA: ["MN", "WI", "IL", "MO", "NE", "SD"],
  KS: ["NE", "MO", "OK", "CO"], KY: ["IN", "OH", "WV", "VA", "TN", "MO", "IL"],
  LA: ["TX", "AR", "MS"], ME: ["NH", "MA", "VT"],
  MD: ["VA", "DC", "PA", "DE", "WV"], MA: ["CT", "RI", "NY", "NH", "VT"],
  MI: ["OH", "IN", "WI", "IL"], MN: ["WI", "IA", "SD", "ND"],
  MS: ["LA", "AR", "TN", "AL"], MO: ["IA", "IL", "KY", "TN", "AR", "OK", "KS", "NE"],
  MT: ["ID", "WY", "SD", "ND"], NE: ["SD", "IA", "MO", "KS", "CO", "WY"],
  NV: ["CA", "OR", "ID", "UT", "AZ"], NH: ["ME", "MA", "VT"],
  NJ: ["NY", "PA", "DE"], NM: ["AZ", "CO", "OK", "TX", "UT"],
  NY: ["PA", "NJ", "CT", "MA", "VT"], NC: ["VA", "SC", "GA", "TN"],
  ND: ["MN", "SD", "MT"], OH: ["MI", "IN", "KY", "WV", "PA"],
  OK: ["KS", "MO", "AR", "TX", "NM", "CO"], OR: ["WA", "CA", "NV", "ID"],
  PA: ["NY", "NJ", "DE", "MD", "WV", "OH"], RI: ["CT", "MA", "NY"],
  SC: ["NC", "GA", "FL"], SD: ["ND", "MN", "IA", "NE", "WY", "MT"],
  TN: ["KY", "VA", "NC", "GA", "AL", "MS", "AR", "MO"], TX: ["OK", "AR", "LA", "NM"],
  UT: ["ID", "WY", "CO", "NM", "AZ", "NV"], VT: ["NH", "MA", "NY"],
  VA: ["NC", "TN", "KY", "WV", "MD", "DC"], WA: ["OR", "ID"],
  WV: ["OH", "PA", "MD", "VA", "KY"], WI: ["MN", "IA", "IL", "MI"],
  WY: ["MT", "SD", "NE", "CO", "UT", "ID"],
};

// Up to `count` nearby state pages for internal links, resolved to page objects.
export function nearbyStatePages(abbr: string, count = 4): OtdStatePage[] {
  const picks = NEIGHBORS[abbr] ?? [];
  const pages = picks
    .map((a) => otdStatePages.find((s) => s.abbr === a))
    .filter((s): s is OtdStatePage => Boolean(s));
  // Fallback: pad alphabetically if a state has fewer mapped neighbors.
  if (pages.length < count) {
    const idx = otdStatePages.findIndex((s) => s.abbr === abbr);
    for (let i = 1; pages.length < count && i < otdStatePages.length; i++) {
      const cand = otdStatePages[(idx + i) % otdStatePages.length];
      if (cand.abbr !== abbr && !pages.some((p) => p.abbr === cand.abbr)) pages.push(cand);
    }
  }
  return pages.slice(0, count);
}

// National averages across all states + DC, computed from the shared data so the
// per-state comparison is honest (no hard-coded "national average" numbers).
export const nationalAverages = {
  salesTaxRate:
    Math.round(
      (otdStateDefaults.reduce((sum, s) => sum + s.salesTaxRate, 0) / otdStateDefaults.length) * 100,
    ) / 100,
  docFee: Math.round(
    otdStateDefaults.reduce((sum, s) => sum + s.docFee, 0) / otdStateDefaults.length,
  ),
  titleFee: Math.round(
    otdStateDefaults.reduce((sum, s) => sum + s.titleFee, 0) / otdStateDefaults.length,
  ),
};
