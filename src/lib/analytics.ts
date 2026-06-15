import { getCloudflareContext } from "@opennextjs/cloudflare";

// First-party, cookieless analytics. Analytics must NEVER break core UX, so every
// write is wrapped and fails silently if D1 is unavailable.

export type EventType =
  | "pageview"
  | "scan_started"
  | "scan_completed"
  | "affiliate_click"
  | "error";

export type TrackEvent = {
  type: EventType;
  path?: string | null;
  referrerHost?: string | null;
  session?: string | null;
  meta?: Record<string, unknown> | null;
};

export type ScanRecord = {
  vehicleTitle?: string | null;
  score?: number | null;
  verdict?: string | null; // good_deal | risky_deal | avoid
  confidence?: string | null;
  inputType?: string | null;
  source?: string | null; // groq | local
};

async function getDB(): Promise<D1Database | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env.DB ?? null;
  } catch {
    return null;
  }
}

function dayOf(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

export async function recordEvent(ev: TrackEvent): Promise<void> {
  const db = await getDB();
  if (!db) return;
  const ts = Date.now();
  try {
    await db
      .prepare(
        "INSERT INTO events (ts, day, type, path, referrer_host, session, meta) VALUES (?,?,?,?,?,?,?)",
      )
      .bind(
        ts,
        dayOf(ts),
        ev.type,
        ev.path ?? null,
        ev.referrerHost ?? null,
        ev.session ?? null,
        ev.meta ? JSON.stringify(ev.meta) : null,
      )
      .run();
  } catch {
    /* swallow: analytics must not break UX */
  }
}

export async function recordScan(s: ScanRecord): Promise<void> {
  const db = await getDB();
  if (!db) return;
  const ts = Date.now();
  const day = dayOf(ts);
  try {
    await db.batch([
      db
        .prepare("INSERT INTO events (ts, day, type, meta) VALUES (?,?,?,?)")
        .bind(ts, day, "scan_completed", JSON.stringify({ score: s.score, verdict: s.verdict })),
      db
        .prepare(
          "INSERT INTO scans (ts, day, vehicle_title, score, verdict, confidence, input_type, source) VALUES (?,?,?,?,?,?,?,?)",
        )
        .bind(
          ts,
          day,
          s.vehicleTitle ?? null,
          s.score ?? null,
          s.verdict ?? null,
          s.confidence ?? null,
          s.inputType ?? null,
          s.source ?? null,
        ),
    ]);
  } catch {
    /* swallow */
  }
}

// ---- Dashboard reads ----

export type DashboardStats = {
  available: boolean;
  totals: {
    today: Record<string, number>;
    last7: Record<string, number>;
    last30: Record<string, number>;
  };
  sessionsToday: number;
  pageviewsByDay: Array<{ day: string; count: number }>;
  topPages: Array<{ path: string; count: number }>;
  topReferrers: Array<{ host: string; count: number }>;
  verdictMix: Array<{ verdict: string; count: number }>;
  topModels: Array<{ title: string; count: number }>;
  affiliateByPartner: Array<{ partner: string; count: number }>;
  recentScans: Array<{ ts: number; title: string | null; score: number | null; verdict: string | null }>;
  recentErrors: Array<{ ts: number; path: string | null; message: string | null }>;
};

const EMPTY_STATS: DashboardStats = {
  available: false,
  totals: { today: {}, last7: {}, last30: {} },
  sessionsToday: 0,
  pageviewsByDay: [],
  topPages: [],
  topReferrers: [],
  verdictMix: [],
  topModels: [],
  affiliateByPartner: [],
  recentScans: [],
  recentErrors: [],
};

function totalsFromRows(rows: Array<{ type: string; n: number }>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of rows) out[r.type] = r.n;
  return out;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = await getDB();
  if (!db) return EMPTY_STATS;

  const now = Date.now();
  const today = dayOf(now);
  const d7 = dayOf(now - 6 * 86400000);
  const d14 = dayOf(now - 13 * 86400000);
  const d30 = dayOf(now - 29 * 86400000);

  try {
    const [
      todayTotals,
      last7Totals,
      last30Totals,
      sessions,
      pvByDay,
      pages,
      referrers,
      verdicts,
      models,
      partners,
      recentScans,
      recentErrors,
    ] = await db.batch([
      db.prepare("SELECT type, COUNT(*) AS n FROM events WHERE day = ? GROUP BY type").bind(today),
      db.prepare("SELECT type, COUNT(*) AS n FROM events WHERE day >= ? GROUP BY type").bind(d7),
      db.prepare("SELECT type, COUNT(*) AS n FROM events WHERE day >= ? GROUP BY type").bind(d30),
      db.prepare("SELECT COUNT(DISTINCT session) AS n FROM events WHERE day = ? AND session IS NOT NULL").bind(today),
      db.prepare("SELECT day, COUNT(*) AS n FROM events WHERE type='pageview' AND day >= ? GROUP BY day ORDER BY day").bind(d14),
      db.prepare("SELECT path, COUNT(*) AS n FROM events WHERE type='pageview' AND day >= ? AND path IS NOT NULL GROUP BY path ORDER BY n DESC LIMIT 10").bind(d7),
      db.prepare("SELECT referrer_host AS host, COUNT(*) AS n FROM events WHERE type='pageview' AND day >= ? AND referrer_host IS NOT NULL AND referrer_host != '' GROUP BY referrer_host ORDER BY n DESC LIMIT 8").bind(d7),
      db.prepare("SELECT verdict, COUNT(*) AS n FROM scans WHERE day >= ? AND verdict IS NOT NULL GROUP BY verdict ORDER BY n DESC").bind(d30),
      db.prepare("SELECT vehicle_title AS title, COUNT(*) AS n FROM scans WHERE day >= ? AND vehicle_title IS NOT NULL GROUP BY vehicle_title ORDER BY n DESC LIMIT 8").bind(d30),
      db.prepare("SELECT json_extract(meta,'$.partner') AS partner, COUNT(*) AS n FROM events WHERE type='affiliate_click' AND day >= ? GROUP BY partner ORDER BY n DESC LIMIT 10").bind(d30),
      db.prepare("SELECT ts, vehicle_title AS title, score, verdict FROM scans ORDER BY ts DESC LIMIT 15"),
      db.prepare("SELECT ts, path, json_extract(meta,'$.message') AS message FROM events WHERE type='error' ORDER BY ts DESC LIMIT 15"),
    ]);

    return {
      available: true,
      totals: {
        today: totalsFromRows(todayTotals.results as Array<{ type: string; n: number }>),
        last7: totalsFromRows(last7Totals.results as Array<{ type: string; n: number }>),
        last30: totalsFromRows(last30Totals.results as Array<{ type: string; n: number }>),
      },
      sessionsToday: ((sessions.results as Array<{ n: number }>)[0]?.n) ?? 0,
      pageviewsByDay: (pvByDay.results as Array<{ day: string; n: number }>).map((r) => ({ day: r.day, count: r.n })),
      topPages: (pages.results as Array<{ path: string; n: number }>).map((r) => ({ path: r.path, count: r.n })),
      topReferrers: (referrers.results as Array<{ host: string; n: number }>).map((r) => ({ host: r.host, count: r.n })),
      verdictMix: (verdicts.results as Array<{ verdict: string; n: number }>).map((r) => ({ verdict: r.verdict, count: r.n })),
      topModels: (models.results as Array<{ title: string; n: number }>).map((r) => ({ title: r.title, count: r.n })),
      affiliateByPartner: (partners.results as Array<{ partner: string; n: number }>).map((r) => ({ partner: r.partner ?? "unknown", count: r.n })),
      recentScans: (recentScans.results as Array<{ ts: number; title: string | null; score: number | null; verdict: string | null }>),
      recentErrors: (recentErrors.results as Array<{ ts: number; path: string | null; message: string | null }>),
    };
  } catch {
    return EMPTY_STATS;
  }
}
