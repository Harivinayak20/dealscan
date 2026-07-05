import { getCloudflareContext } from "@opennextjs/cloudflare";

// DealScan Index: aggregate, anonymized stats from real scans. This is the
// citable data layer for /research — journalists and AI answers can quote it.
// Everything returns null gracefully until enough data exists.

export type IndexStats = {
  totalScans: number;
  listingsTracked: number;
  averageScore: number | null;
  verdictMix: Array<{ verdict: string; count: number; share: number }>;
  topModels: Array<{ title: string; count: number }>;
  medianAskingByModel: Array<{ make: string; model: string; median: number; sample: number }>;
  generatedAt: string;
};

const MIN_SCANS_FOR_INDEX = 25;

async function getDB(): Promise<D1Database | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env.DB ?? null;
  } catch {
    return null;
  }
}

export async function getIndexStats(): Promise<IndexStats | null> {
  const db = await getDB();
  if (!db) return null;

  try {
    const [totals, avg, verdicts, models, listingsCount] = await db.batch([
      db.prepare("SELECT COUNT(*) AS n FROM scans"),
      db.prepare("SELECT AVG(score) AS avg FROM scans WHERE score IS NOT NULL"),
      db.prepare("SELECT verdict, COUNT(*) AS n FROM scans WHERE verdict IS NOT NULL GROUP BY verdict ORDER BY n DESC"),
      db.prepare("SELECT vehicle_title AS title, COUNT(*) AS n FROM scans WHERE vehicle_title IS NOT NULL GROUP BY vehicle_title ORDER BY n DESC LIMIT 10"),
      db.prepare("SELECT COUNT(*) AS n FROM listings"),
    ]);

    const totalScans = (totals.results as Array<{ n: number }>)[0]?.n ?? 0;
    if (totalScans < MIN_SCANS_FOR_INDEX) return null;

    const verdictRows = verdicts.results as Array<{ verdict: string; n: number }>;
    const verdictTotal = Math.max(1, verdictRows.reduce((sum, r) => sum + r.n, 0));

    // Median asking price per model from listing memory (min sample 8).
    const medians = await db
      .prepare(
        `SELECT make, model, COUNT(*) AS sample, price FROM listings
         WHERE make IS NOT NULL AND model IS NOT NULL AND price IS NOT NULL AND price > 100
         GROUP BY make, model HAVING COUNT(*) >= 8 ORDER BY sample DESC LIMIT 10`,
      )
      .all<{ make: string; model: string; sample: number; price: number }>();

    const medianAskingByModel = await Promise.all(
      (medians.results ?? []).map(async (row) => {
        const prices = await db
          .prepare(
            "SELECT price FROM listings WHERE make = ? AND model = ? AND price IS NOT NULL AND price > 100 ORDER BY price",
          )
          .bind(row.make, row.model)
          .all<{ price: number }>();
        const list = (prices.results ?? []).map((r) => r.price);
        const mid = Math.floor(list.length / 2);
        const median = list.length % 2 ? list[mid] : Math.round((list[mid - 1] + list[mid]) / 2);
        return { make: row.make, model: row.model, median, sample: list.length };
      }),
    );

    const avgScore = (avg.results as Array<{ avg: number | null }>)[0]?.avg ?? null;

    return {
      totalScans,
      listingsTracked: (listingsCount.results as Array<{ n: number }>)[0]?.n ?? 0,
      averageScore: avgScore === null ? null : Math.round(avgScore),
      verdictMix: verdictRows.map((r) => ({
        verdict: r.verdict,
        count: r.n,
        share: Math.round((r.n / verdictTotal) * 100),
      })),
      topModels: (models.results as Array<{ title: string; n: number }>).map((r) => ({ title: r.title, count: r.n })),
      medianAskingByModel,
      generatedAt: new Date().toISOString().slice(0, 10),
    };
  } catch {
    return null;
  }
}
