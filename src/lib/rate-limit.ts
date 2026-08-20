import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Production requests use Cloudflare native rate-limiting infrastructure.
 *
 * The in-memory implementation remains as a development fallback when the
 * binding is unavailable. Every key includes the route so activity against one
 * endpoint cannot exhaust a user allowance for another endpoint.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

type RateLimitEntry = { count: number; resetAt: number };

const store = new Map<string, RateLimitEntry>();

type RateLimitBindingName = Exclude<keyof CloudflareEnv, "DB">;

const BINDING_BY_LIMIT: Partial<Record<number, RateLimitBindingName>> = {
  5: "RATE_LIMITER_5",
  6: "RATE_LIMITER_6",
  8: "RATE_LIMITER_8",
  10: "RATE_LIMITER_10",
  15: "RATE_LIMITER_15",
  20: "RATE_LIMITER_20",
  30: "RATE_LIMITER_30",
};

function getClientIp(request: Request): string {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
}

function getRateLimitKey(request: Request): string {
  const path = new URL(request.url).pathname;
  return path + ":" + getClientIp(request);
}

const MAX_STORE_SIZE = 10_000;

function checkLocalRateLimit(
  request: Request,
  limit = MAX_REQUESTS,
  windowMs = WINDOW_MS,
): { allowed: boolean; retryAfterMs: number } {
  if (store.size > MAX_STORE_SIZE) store.clear();

  const key = getRateLimitKey(request);
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  entry.count += 1;

  if (entry.count > limit) {
    const retryAfterMs = entry.resetAt - now;
    return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 1000) };
  }

  return { allowed: true, retryAfterMs: 0 };
}

export async function checkRateLimit(
  request: Request,
  limit = MAX_REQUESTS,
  windowMs = WINDOW_MS,
): Promise<{ allowed: boolean; retryAfterMs: number }> {
  const bindingName = windowMs === WINDOW_MS ? BINDING_BY_LIMIT[limit] : undefined;

  if (bindingName) {
    try {
      const { env } = await getCloudflareContext({ async: true });
      const limiter = env[bindingName];
      if (limiter) {
        const { success } = await limiter.limit({ key: getRateLimitKey(request) });
        return {
          allowed: success,
          retryAfterMs: success ? 0 : windowMs,
        };
      }
    } catch {
      // Local Next.js development has no Cloudflare binding.
    }
  }

  return checkLocalRateLimit(request, limit, windowMs);
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
