import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { AnalyzeListingRequest } from "@/lib/analyzer-types";
import type { DetectedVehicle } from "@/lib/local-analyzer";
import { extractVin } from "@/lib/vin-decoder";

// Listing memory: remembers every listing Dealscan has ever scanned, keyed by
// VIN (preferred) or a hash of the source URL. Like analytics, these writes
// must NEVER break the scan flow — every call fails silently without D1.

export type ListingMemory = {
  /** Days since this exact listing was first scanned by anyone on Dealscan. */
  daysSinceFirstScan: number;
  scanCount: number;
  priceDrop: { from: number; to: number } | null;
};

export type MarketContext = {
  /** How many distinct listings of this make/model/year(±1) we've observed. */
  sampleSize: number;
  /** Share of observed listings priced BELOW this one, 0-100. */
  percentile: number;
  medianPrice: number;
};

async function getDB(): Promise<D1Database | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env.DB ?? null;
  } catch {
    return null;
  }
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

function normalizeUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    url.hash = "";
    url.search = "";
    return `${url.host.toLowerCase()}${url.pathname.replace(/\/$/, "")}`;
  } catch {
    return null;
  }
}

async function listingKeyFor(request: AnalyzeListingRequest): Promise<{ key: string; vin: string | null } | null> {
  const vin = extractVin(request.listingText);
  if (vin) return { key: `vin:${vin}`, vin };
  const normalized = request.sourceUrl ? normalizeUrl(request.sourceUrl) : null;
  if (normalized) return { key: `url:${await sha256Hex(normalized)}`, vin: null };
  return null;
}

type ListingRow = {
  price: number | null;
  first_price: number | null;
  first_seen: number;
  scan_count: number;
};

/**
 * Upserts the listing + snapshot and returns memory about prior scans of the
 * same listing (null on first sight, when unidentifiable, or without D1).
 */
export async function recordListingObservation(
  request: AnalyzeListingRequest,
  detected: DetectedVehicle,
  vehicleTitle: string | null,
): Promise<ListingMemory | null> {
  const db = await getDB();
  if (!db) return null;
  const identity = await listingKeyFor(request);
  if (!identity) return null;

  const ts = Date.now();
  try {
    const existing = await db
      .prepare("SELECT price, first_price, first_seen, scan_count FROM listings WHERE listing_key = ?")
      .bind(identity.key)
      .first<ListingRow>();

    const price = detected.price && detected.price > 100 ? Math.round(detected.price) : null;
    const snapshot = db
      .prepare("INSERT INTO listing_snapshots (listing_key, ts, price, mileage) VALUES (?,?,?,?)")
      .bind(identity.key, ts, price, detected.mileage);

    if (!existing) {
      await db.batch([
        db
          .prepare(
            "INSERT INTO listings (listing_key, vin, vehicle_title, year, make, model, mileage, price, first_price, first_seen, last_seen) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
          )
          .bind(
            identity.key,
            identity.vin,
            vehicleTitle,
            detected.year,
            detected.make,
            detected.model,
            detected.mileage,
            price,
            price,
            ts,
            ts,
          ),
        snapshot,
      ]);
      return null;
    }

    await db.batch([
      db
        .prepare(
          "UPDATE listings SET last_seen = ?, scan_count = scan_count + 1, price = COALESCE(?, price), mileage = COALESCE(?, mileage), vehicle_title = COALESCE(?, vehicle_title) WHERE listing_key = ?",
        )
        .bind(ts, price, detected.mileage, vehicleTitle, identity.key),
      snapshot,
    ]);

    const previousPrice = existing.price;
    return {
      daysSinceFirstScan: Math.max(0, Math.floor((ts - existing.first_seen) / 86400000)),
      scanCount: existing.scan_count + 1,
      priceDrop:
        price !== null && previousPrice !== null && price < previousPrice
          ? { from: previousPrice, to: price }
          : null,
    };
  } catch {
    return null; /* memory must not break scans */
  }
}

const MARKET_CONTEXT_MIN_SAMPLE = 10;

/**
 * Prices this listing against every same-make/model listing (year ±1) we've
 * scanned. Returns null until the sample is big enough to be meaningful.
 */
export async function getMarketContext(detected: DetectedVehicle): Promise<MarketContext | null> {
  const db = await getDB();
  if (!db) return null;
  const { year, make, model, price } = detected;
  if (!year || !make || !model || !price || price <= 100) return null;

  try {
    const rows = await db
      .prepare(
        "SELECT price FROM listings WHERE make = ? COLLATE NOCASE AND model = ? COLLATE NOCASE AND year BETWEEN ? AND ? AND price IS NOT NULL AND price > 100",
      )
      .bind(make, model, year - 1, year + 1)
      .all<{ price: number }>();

    const prices = (rows.results ?? []).map((r) => r.price).sort((a, b) => a - b);
    if (prices.length < MARKET_CONTEXT_MIN_SAMPLE) return null;

    const below = prices.filter((p) => p < price).length;
    const mid = Math.floor(prices.length / 2);
    const median = prices.length % 2 ? prices[mid] : Math.round((prices[mid - 1] + prices[mid]) / 2);

    return {
      sampleSize: prices.length,
      percentile: Math.round((below / prices.length) * 100),
      medianPrice: median,
    };
  } catch {
    return null;
  }
}
