import { carModels, getCarModel, type CarModel } from "@/lib/car-models";
import { yearsToAvoid, type YearsToAvoidEntry, type YearVerdict } from "@/lib/years-to-avoid";
import { avoidFlag, modelYears } from "@/lib/pricing";

// Per-model-year "problems" pages, generated ONLY from curated data we already
// maintain (years-to-avoid + known issues). No fabricated facts: a year with
// nothing documented says so honestly and routes the reader to verification.

export type ProblemPageData = {
  car: CarModel;
  year: number;
  avoid: YearVerdict | null; // documented trouble range covering this year
  best: YearVerdict | null; // documented sweet-spot range covering this year
  modelVerdict: string;
  knownIssues: string[];
  verify: string[];
  updatedAt: string;
};

function rangeMatch(items: YearVerdict[], year: number): YearVerdict | null {
  for (const item of items) {
    const nums = item.years.match(/\d{4}/g);
    if (!nums) continue;
    const start = Number(nums[0]);
    const end = nums[1] ? Number(nums[1]) : new Date().getFullYear();
    if (year >= start && year <= end) return item;
  }
  return null;
}

function entryFor(slug: string): YearsToAvoidEntry | null {
  return yearsToAvoid.find((e) => e.slug === slug) ?? null;
}

export function allProblemPages(): Array<{ slug: string; year: number }> {
  return yearsToAvoid.flatMap((entry) =>
    modelYears(entry.slug).map((year) => ({ slug: entry.slug, year })),
  );
}

export function problemPageData(slug: string, year: number): ProblemPageData | null {
  const car = getCarModel(slug);
  const entry = entryFor(slug);
  if (!car || !entry) return null;
  if (!modelYears(slug).includes(year)) return null;

  return {
    car,
    year,
    avoid: avoidFlag(slug, year),
    best: rangeMatch(entry.best, year),
    modelVerdict: entry.verdict,
    knownIssues: car.knownIssues,
    verify: car.verify,
    updatedAt: entry.updatedAt,
  };
}

/** Neighboring years of the same model, for internal linking. */
export function neighborYears(slug: string, year: number, span = 2): number[] {
  return modelYears(slug).filter((y) => y !== year && Math.abs(y - year) <= span);
}

export function problemPagesCount(): number {
  return allProblemPages().length;
}

export { carModels };
