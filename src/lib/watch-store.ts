import { getCloudflareContext } from "@opennextjs/cloudflare";

// Server-side watch subscriptions (opt-in email alerts for one listing).
// Free tier allows a few active watches per email; Pro lifts the cap later.

export const FREE_WATCH_LIMIT = 3;

export type WatchRow = {
  id: number;
  token: string;
  email: string;
  listing_url: string | null;
  listing_key: string | null;
  vehicle_title: string | null;
  last_price: number | null;
  status: string;
  created_at: number;
  last_checked: number | null;
  last_alert: number | null;
};

async function getDB(): Promise<D1Database | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env.DB ?? null;
  } catch {
    return null;
  }
}

export type CreateWatchResult =
  | { ok: true; token: string }
  | { ok: false; reason: "no_db" | "limit" | "duplicate" };

export async function createWatch(args: {
  email: string;
  listingUrl: string | null;
  listingKey: string | null;
  vehicleTitle: string | null;
  price: number | null;
}): Promise<CreateWatchResult> {
  const db = await getDB();
  if (!db) return { ok: false, reason: "no_db" };

  const email = args.email.trim().toLowerCase();
  try {
    const active = await db
      .prepare("SELECT COUNT(*) AS n FROM watches WHERE email = ? AND status = 'active'")
      .bind(email)
      .first<{ n: number }>();
    if ((active?.n ?? 0) >= FREE_WATCH_LIMIT) return { ok: false, reason: "limit" };

    if (args.listingUrl) {
      const existing = await db
        .prepare("SELECT id FROM watches WHERE email = ? AND listing_url = ? AND status = 'active'")
        .bind(email, args.listingUrl)
        .first<{ id: number }>();
      if (existing) return { ok: false, reason: "duplicate" };
    }

    const token = crypto.randomUUID();
    await db
      .prepare(
        "INSERT INTO watches (token, email, listing_url, listing_key, vehicle_title, last_price, created_at) VALUES (?,?,?,?,?,?,?)",
      )
      .bind(token, email, args.listingUrl, args.listingKey, args.vehicleTitle, args.price, Date.now())
      .run();
    return { ok: true, token };
  } catch {
    return { ok: false, reason: "no_db" };
  }
}

export async function endWatch(token: string, reason: string): Promise<boolean> {
  const db = await getDB();
  if (!db) return false;
  try {
    const result = await db
      .prepare("UPDATE watches SET status = 'ended', ended_reason = ? WHERE token = ? AND status = 'active'")
      .bind(reason, token)
      .run();
    return ((result.meta.changes as number | undefined) ?? 0) > 0;
  } catch {
    return false;
  }
}

/** Oldest-checked active watches with a re-checkable URL, for the cron sweep. */
export async function dueWatches(limit: number): Promise<WatchRow[]> {
  const db = await getDB();
  if (!db) return [];
  try {
    const rows = await db
      .prepare(
        "SELECT * FROM watches WHERE status = 'active' AND listing_url IS NOT NULL ORDER BY COALESCE(last_checked, 0) ASC LIMIT ?",
      )
      .bind(limit)
      .all<WatchRow>();
    return rows.results ?? [];
  } catch {
    return [];
  }
}

export async function markChecked(id: number, args: { price?: number | null; alerted?: boolean }): Promise<void> {
  const db = await getDB();
  if (!db) return;
  const now = Date.now();
  try {
    await db
      .prepare(
        "UPDATE watches SET last_checked = ?, last_price = COALESCE(?, last_price), last_alert = CASE WHEN ? THEN ? ELSE last_alert END WHERE id = ?",
      )
      .bind(now, args.price ?? null, args.alerted ? 1 : 0, now, id)
      .run();
  } catch {
    /* swallow */
  }
}

export async function watchStats(): Promise<{ active: number; alertsSent30d: number } | null> {
  const db = await getDB();
  if (!db) return null;
  try {
    const cutoff = Date.now() - 30 * 86400000;
    const [active, alerts] = await Promise.all([
      db.prepare("SELECT COUNT(*) AS n FROM watches WHERE status = 'active'").first<{ n: number }>(),
      db.prepare("SELECT COUNT(*) AS n FROM watches WHERE last_alert >= ?").bind(cutoff).first<{ n: number }>(),
    ]);
    return { active: active?.n ?? 0, alertsSent30d: alerts?.n ?? 0 };
  } catch {
    return null;
  }
}
