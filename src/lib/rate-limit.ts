/**
 * Simple in-memory sliding-window rate limiter per IP.
 *
 * NOTE: This is a demo/interview approximation. On serverless edge runtimes
 * (Vercel/Cloudflare) each isolate has its own Map, so limits are per-isolate.
 * For production, use an external store like Upstash Redis or Cloudflare KV.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

type RateLimitEntry = { count: number; resetAt: number };

const store = new Map<string, RateLimitEntry>();

function getClientIp(request: Request): string {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
}

const MAX_STORE_SIZE = 10_000;

export function checkRateLimit(
  request: Request,
  limit = MAX_REQUESTS,
  windowMs = WINDOW_MS,
): { allowed: boolean; retryAfterMs: number } {
  if (store.size > MAX_STORE_SIZE) store.clear();

  const ip = getClientIp(request);
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  entry.count += 1;

  if (entry.count > limit) {
    const retryAfterMs = entry.resetAt - now;
    return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 1000) };
  }

  return { allowed: true, retryAfterMs: 0 };
}

export function rateLimitResponse(retryAfterMs: number, limit = MAX_REQUESTS): Response {
  const retryAfterSec = Math.ceil(retryAfterMs / 1000);
  return new Response(
    JSON.stringify({
      error: `Too many requests. Try again in ${retryAfterSec} seconds.`,
    }),
    {
      status: 429,
      headers: {
        "content-type": "application/json",
        "retry-after": String(retryAfterSec),
        "X-RateLimit-Limit": String(limit),
      },
    },
  );
}
