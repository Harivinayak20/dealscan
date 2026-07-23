const AUTODEV_LISTINGS_URL = "https://api.auto.dev/listings";
const DEFAULT_DISTANCE_MILES = 100;
const MAX_RESULTS = 5;

export type BetterDeal = {
  vin: string;
  year: number | null;
  make: string | null;
  model: string | null;
  trim: string | null;
  price: number;
  mileage: number | null;
  location: string | null;
  cpo: boolean;
  savings: number;
  url: string;
};

export type BetterDealsQuery = {
  make: string;
  model: string;
  year?: string | null;
  price: number;
  zip?: string | null;
};

export type BetterDealsResult =
  | { status: "no-key" }
  | { status: "no-vehicle" }
  | { status: "none" }
  | { status: "error"; message: string }
  | { status: "ok"; deals: BetterDeal[]; searchedNear: string | null };

type LooseRecord = Record<string, unknown>;

function asRecord(value: unknown): LooseRecord | null {
  return value && typeof value === "object" ? (value as LooseRecord) : null;
}

/** Reads the first path that resolves to a value, e.g. "retailListing.price". */
function pick(source: LooseRecord, paths: string[]): unknown {
  for (const path of paths) {
    let current: unknown = source;

    for (const segment of path.split(".")) {
      const record = asRecord(current);
      if (!record) {
        current = undefined;
        break;
      }
      current = record[segment];
    }

    if (current !== undefined && current !== null && current !== "") {
      return current;
    }
  }

  return undefined;
}

function pickNumber(source: LooseRecord, paths: string[]): number | null {
  const value = pick(source, paths);

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.]/g, ""));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  return null;
}

function pickString(source: LooseRecord, paths: string[]): string | null {
  const value = pick(source, paths);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

/**
 * Only matches a ZIP that follows a state abbreviation, so prices and mileage
 * in the listing text are never mistaken for a location.
 */
export function extractZip(text: string): string | null {
  return text.match(/\b[A-Z]{2}[\s,]+(\d{5})(?:-\d{4})?\b/)?.[1] ?? null;
}

function normalizeListing(raw: LooseRecord, askingPrice: number): BetterDeal | null {
  const price = pickNumber(raw, ["retailListing.price", "price", "listing.price"]);
  const vin = pickString(raw, ["vin", "vehicle.vin"]);

  if (!price || !vin || price >= askingPrice) {
    return null;
  }

  const city = pickString(raw, ["location.city", "retailListing.city", "city"]);
  const state = pickString(raw, ["location.state", "retailListing.state", "state"]);

  return {
    vin,
    year: pickNumber(raw, ["vehicle.year", "year"]),
    make: pickString(raw, ["vehicle.make", "make"]),
    model: pickString(raw, ["vehicle.model", "model"]),
    trim: pickString(raw, ["vehicle.trim", "trim"]),
    price,
    mileage: pickNumber(raw, ["retailListing.miles", "retailListing.mileage", "vehicle.mileage", "miles", "mileage"]),
    location: [city, state].filter(Boolean).join(", ") || null,
    cpo: pick(raw, ["retailListing.cpo", "cpo"]) === true,
    savings: Math.round(askingPrice - price),
    url:
      pickString(raw, ["retailListing.vdpUrl", "retailListing.url", "vdpUrl", "url", "link"]) ??
      `https://www.google.com/search?q=${encodeURIComponent(vin)}`,
  };
}

export function hasListingsProvider(): boolean {
  return Boolean(process.env.AUTODEV_API_KEY?.trim());
}

export async function findBetterDeals(query: BetterDealsQuery): Promise<BetterDealsResult> {
  const apiKey = process.env.AUTODEV_API_KEY?.trim();

  if (!apiKey) {
    return { status: "no-key" };
  }

  if (!query.make || !query.model || !query.price) {
    return { status: "no-vehicle" };
  }

  const params = new URLSearchParams({
    "vehicle.make": query.make,
    "vehicle.model": query.model,
    "retailListing.price": `1-${Math.max(1, Math.floor(query.price) - 1)}`,
    sort: "price.asc",
    limit: "20",
  });

  if (query.year) {
    params.set("vehicle.year", query.year);
  }

  if (query.zip) {
    params.set("zip", query.zip);
    params.set("distance", String(DEFAULT_DISTANCE_MILES));
  }

  try {
    const response = await fetch(`${AUTODEV_LISTINGS_URL}?${params.toString()}`, {
      headers: { authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return { status: "error", message: `Listings provider returned HTTP ${response.status}.` };
    }

    const body = (await response.json()) as { data?: unknown[]; records?: unknown[] };
    const rows = body.data ?? body.records ?? [];

    const deals = rows
      .map((row) => {
        const record = asRecord(row);
        return record ? normalizeListing(record, query.price) : null;
      })
      .filter((deal): deal is BetterDeal => deal !== null)
      .sort((a, b) => b.savings - a.savings)
      .slice(0, MAX_RESULTS);

    if (deals.length === 0) {
      return { status: "none" };
    }

    return { status: "ok", deals, searchedNear: query.zip ?? null };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Could not reach the listings provider.",
    };
  }
}
