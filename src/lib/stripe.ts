// Minimal Stripe REST client (no SDK — edge-friendly form-encoded fetches).
// Only the three calls Pro needs: create a Checkout session, retrieve it
// after success, and verify webhook signatures.

const STRIPE_API = "https://api.stripe.com/v1";

function stripeKey(): string | null {
  return process.env.STRIPE_SECRET_KEY ?? null;
}

async function stripeFetch<T>(path: string, init?: { method?: string; form?: Record<string, string> }): Promise<T | null> {
  const key = stripeKey();
  if (!key) return null;
  try {
    const response = await fetch(`${STRIPE_API}${path}`, {
      method: init?.method ?? "GET",
      headers: {
        authorization: `Bearer ${key}`,
        ...(init?.form ? { "content-type": "application/x-www-form-urlencoded" } : {}),
      },
      body: init?.form ? new URLSearchParams(init.form).toString() : undefined,
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export type ProPlan = "weekly" | "monthly";

export function priceIdFor(plan: ProPlan): string | null {
  return (plan === "weekly" ? process.env.STRIPE_PRICE_WEEKLY : process.env.STRIPE_PRICE_MONTHLY) ?? null;
}

export async function createCheckoutSession(plan: ProPlan): Promise<{ url: string } | null> {
  const price = priceIdFor(plan);
  if (!price) return null;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

  const session = await stripeFetch<{ url?: string }>("/checkout/sessions", {
    method: "POST",
    form: {
      mode: "subscription",
      "line_items[0][price]": price,
      "line_items[0][quantity]": "1",
      success_url: `${appUrl}/api/pro/activate?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
      allow_promotion_codes: "true",
    },
  });
  return session?.url ? { url: session.url } : null;
}

export type CheckoutSession = {
  id: string;
  payment_status: string;
  customer: string | null;
  customer_details?: { email?: string | null } | null;
  subscription?: { id: string; current_period_end: number; items?: { data?: Array<{ price?: { id?: string } }> } } | string | null;
};

export async function retrieveCheckoutSession(sessionId: string): Promise<CheckoutSession | null> {
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return null;
  return stripeFetch<CheckoutSession>(`/checkout/sessions/${sessionId}?expand[]=subscription`);
}

/** Stripe webhook signature check: v1 = HMAC-SHA256(`${t}.${payload}`, secret). */
export async function verifyStripeSignature(payload: string, header: string | null): Promise<boolean> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !header) return false;

  const parts = Object.fromEntries(
    header.split(",").map((pair) => pair.split("=", 2) as [string, string]),
  );
  const timestamp = parts.t;
  const expected = parts.v1;
  if (!timestamp || !expected) return false;
  // Reject stale events (>10 min) to blunt replay.
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 600) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const hex = Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, "0")).join("");
  return hex === expected;
}
