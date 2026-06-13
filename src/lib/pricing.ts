import { carModels } from "@/lib/car-models";
import { yearsToAvoid } from "@/lib/years-to-avoid";

// Transparent, data-free used-car value model. No external pricing feed: we
// anchor to a typical new MSRP per model and apply a per-segment depreciation
// curve, then adjust for mileage, condition, and title. It is an estimate and
// a negotiation starting point, not a transaction-data valuation.

type Segment = "economy" | "sedan" | "suv" | "truck" | "bof" | "luxury" | "ev" | "sports";

type SegmentCurve = { firstYear: number; annual: number; floor: number };

const SEGMENTS: Record<Segment, SegmentCurve> = {
  economy: { firstYear: 0.2, annual: 0.11, floor: 0.12 },
  sedan: { firstYear: 0.19, annual: 0.1, floor: 0.14 },
  suv: { firstYear: 0.18, annual: 0.1, floor: 0.15 },
  truck: { firstYear: 0.15, annual: 0.08, floor: 0.2 },
  bof: { firstYear: 0.16, annual: 0.09, floor: 0.18 },
  luxury: { firstYear: 0.22, annual: 0.13, floor: 0.1 },
  ev: { firstYear: 0.25, annual: 0.15, floor: 0.08 },
  sports: { firstYear: 0.18, annual: 0.1, floor: 0.15 },
};

// Representative recent new MSRP (mid trim) + segment per model slug.
const MODELS: Record<string, { msrp: number; segment: Segment }> = {
  "used-honda-civic": { msrp: 26000, segment: "economy" },
  "used-toyota-corolla": { msrp: 24000, segment: "economy" },
  "used-toyota-camry": { msrp: 28000, segment: "sedan" },
  "used-honda-accord": { msrp: 30000, segment: "sedan" },
  "used-honda-cr-v": { msrp: 31000, segment: "suv" },
  "used-toyota-rav4": { msrp: 31000, segment: "suv" },
  "used-ford-f-150": { msrp: 45000, segment: "truck" },
  "used-chevrolet-silverado-1500": { msrp: 45000, segment: "truck" },
  "used-ram-1500": { msrp: 45000, segment: "truck" },
  "used-nissan-altima": { msrp: 27000, segment: "sedan" },
  "used-nissan-rogue": { msrp: 30000, segment: "suv" },
  "used-hyundai-elantra": { msrp: 23000, segment: "economy" },
  "used-hyundai-sonata": { msrp: 27000, segment: "sedan" },
  "used-ford-escape": { msrp: 30000, segment: "suv" },
  "used-ford-explorer": { msrp: 40000, segment: "suv" },
  "used-chevrolet-equinox": { msrp: 30000, segment: "suv" },
  "used-toyota-tacoma": { msrp: 35000, segment: "truck" },
  "used-jeep-wrangler": { msrp: 38000, segment: "bof" },
  "used-subaru-outback": { msrp: 31000, segment: "suv" },
  "used-tesla-model-3": { msrp: 42000, segment: "ev" },
  "used-toyota-highlander": { msrp: 40000, segment: "suv" },
  "used-toyota-prius": { msrp: 30000, segment: "economy" },
  "used-toyota-sienna": { msrp: 38000, segment: "suv" },
  "used-toyota-4runner": { msrp: 42000, segment: "bof" },
  "used-honda-pilot": { msrp: 42000, segment: "suv" },
  "used-honda-odyssey": { msrp: 40000, segment: "suv" },
  "used-mazda-3": { msrp: 26000, segment: "economy" },
  "used-mazda-cx-5": { msrp: 30000, segment: "suv" },
  "used-subaru-forester": { msrp: 30000, segment: "suv" },
  "used-subaru-crosstrek": { msrp: 27000, segment: "suv" },
  "used-chevrolet-malibu": { msrp: 27000, segment: "sedan" },
  "used-chevrolet-tahoe": { msrp: 58000, segment: "bof" },
  "used-gmc-sierra-1500": { msrp: 45000, segment: "truck" },
  "used-ford-fusion": { msrp: 26000, segment: "sedan" },
  "used-ford-mustang": { msrp: 33000, segment: "sports" },
  "used-jeep-grand-cherokee": { msrp: 42000, segment: "bof" },
  "used-kia-sorento": { msrp: 33000, segment: "suv" },
  "used-hyundai-tucson": { msrp: 29000, segment: "suv" },
  "used-volkswagen-jetta": { msrp: 24000, segment: "economy" },
  "used-lexus-rx-350": { msrp: 50000, segment: "luxury" },
};

export type Condition = "excellent" | "good" | "fair" | "rough";

const CONDITION: Record<Condition, number> = {
  excellent: 0.08,
  good: 0,
  fair: -0.12,
  rough: -0.25,
};

const EXPECTED_MILES_PER_YEAR = 12500;

export type PriceEstimate = {
  fair: number;
  privateLow: number;
  privateHigh: number;
  dealerRetail: number;
  age: number;
  expectedMiles: number;
  mileageAdjPct: number;
  conditionAdjPct: number;
  titleAdjPct: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function round50(n: number) {
  return Math.round(n / 50) * 50;
}

function retention(age: number, seg: Segment) {
  const c = SEGMENTS[seg];
  if (age <= 0) return 1;
  const r = (1 - c.firstYear) * Math.pow(1 - c.annual, age - 1);
  return Math.max(c.floor, r);
}

export function priceCheckerModels() {
  return carModels
    .filter((m) => MODELS[m.slug])
    .map((m) => ({ slug: m.slug, label: `${m.make} ${m.model}`, make: m.make, model: m.model }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function estimatePrice(
  slug: string,
  modelYear: number,
  miles: number,
  condition: Condition,
  title: "clean" | "branded",
  currentYear: number = new Date().getFullYear()
): PriceEstimate | null {
  const base = MODELS[slug];
  if (!base || !modelYear) return null;

  const age = clamp(currentYear - modelYear, 0, 30);
  const ret = retention(age, base.segment);

  const expectedMiles = EXPECTED_MILES_PER_YEAR * age;
  const diff = miles - expectedMiles; // positive = more miles than typical
  const mileageAdjPct = clamp(-diff * 0.0000048, -0.3, 0.2);
  const conditionAdjPct = CONDITION[condition];
  const titleAdjPct = title === "clean" ? 0 : -0.35;

  let value = base.msrp * ret;
  value = value * (1 + mileageAdjPct) * (1 + conditionAdjPct) * (1 + titleAdjPct);
  value = Math.max(value, 1500);

  const fair = round50(value);
  return {
    fair,
    privateLow: round50(fair * 0.92),
    privateHigh: round50(fair * 1.08),
    dealerRetail: round50(fair * 1.15),
    age,
    expectedMiles,
    mileageAdjPct,
    conditionAdjPct,
    titleAdjPct,
  };
}

// Flags whether a model-year falls in a documented "years to avoid" range.
export function avoidFlag(slug: string, modelYear: number): { years: string; reason: string } | null {
  const entry = yearsToAvoid.find((e) => e.slug === slug);
  if (!entry) return null;
  for (const item of entry.avoid) {
    const nums = item.years.match(/\d{4}/g);
    if (!nums) continue;
    const start = Number(nums[0]);
    const end = nums[1] ? Number(nums[1]) : start;
    if (modelYear >= start && modelYear <= end) {
      return { years: item.years, reason: item.reason };
    }
  }
  return null;
}
