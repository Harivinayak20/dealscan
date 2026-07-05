import { getCloudflareContext } from "@opennextjs/cloudflare";

// DealScan Pro entitlements. Design constraints:
// - Core scanning stays free forever (buyer-side promise); Pro lifts caps.
// - No accounts: entitlement travels in a signed, HttpOnly cookie set after
//   Stripe Checkout, backed by a pro_members row keyed by email.
// - Everything degrades gracefully when Stripe env vars are absent.

export const PRO_COOKIE = "ds_pro";
export const PRO_WATCH_LIMIT = 50;

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      (process.env.STRIPE_PRICE_WEEKLY || process.env.STRIPE_PRICE_MONTHLY) &&
      process.env.PRO_COOKIE_SECRET,
  );
}

async function hmac(value: string): Promise<string | null> {
  const secret = process.env.PRO_COOKIE_SECRET;
  if (!secret) return null;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Cookie value: base64(email)|expiryMs|hmac(email|expiryMs). */
export async function signProCookie(email: string, expiresAt: number): Promise<string | null> {
  const payload = `${btoa(email.toLowerCase())}|${expiresAt}`;
  const signature = await hmac(payload);
  return signature ? `${payload}|${signature}` : null;
}

export async function verifyProCookie(value: string | undefined | null): Promise<{ email: string } | null> {
  if (!value) return null;
  const [encoded, expiry, signature] = value.split("|");
  if (!encoded || !expiry || !signature) return null;
  const expiresAt = Number(expiry);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;
  const expected = await hmac(`${encoded}|${expiry}`);
  if (!expected || expected !== signature) return null;
  try {
    return { email: atob(encoded) };
  } catch {
    return null;
  }
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export async function isProRequest(request: Request): Promise<boolean> {
  return Boolean(await verifyProCookie(readCookie(request, PRO_COOKIE)));
}

async function getDB(): Promise<D1Database | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env.DB ?? null;
  } catch {
    return null;
  }
}

export async function upsertProMember(args: {
  email: string;
  stripeCustomerId: string | null;
  plan: string | null;
  currentPeriodEnd: number;
}): Promise<void> {
  const db = await getDB();
  if (!db) return;
  const now = Date.now();
  try {
    await db
      .prepare(
        `INSERT INTO pro_members (email, stripe_customer_id, plan, current_period_end, created_at, updated_at)
         VALUES (?,?,?,?,?,?)
         ON CONFLICT(email) DO UPDATE SET
           stripe_customer_id = COALESCE(excluded.stripe_customer_id, stripe_customer_id),
           plan = COALESCE(excluded.plan, plan),
           current_period_end = excluded.current_period_end,
           updated_at = excluded.updated_at`,
      )
      .bind(args.email.toLowerCase(), args.stripeCustomerId, args.plan, args.currentPeriodEnd, now, now)
      .run();
  } catch {
    /* swallow */
  }
}

export async function addToWaitlist(email: string): Promise<boolean> {
  const db = await getDB();
  if (!db) return false;
  try {
    await db
      .prepare("INSERT OR IGNORE INTO pro_waitlist (email, created_at) VALUES (?,?)")
      .bind(email.toLowerCase(), Date.now())
      .run();
    return true;
  } catch {
    return false;
  }
}
