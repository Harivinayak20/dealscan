/**
 * Public deal-analysis API, v1.
 *
 *   POST /api/v1/analyze   body: { url } | { text } | { manualDetails }
 *   GET  /api/v1/analyze?url=...   (or ?text=...)   convenience for GET-only agents
 *
 * Cross-origin, rate-limited, no auth. Returns the same analysis the website
 * produces. Documented at /api/openapi.json and referenced from /llms.txt.
 */
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { CORS_HEADERS, corsPreflight, jsonError, jsonResponse } from "@/lib/api-cors";
import {
  analyzeInputSchema,
  analyzePublicListing,
  PublicApiError,
  type PublicAnalyzeInput,
} from "@/lib/public-api";

const RATE_LIMIT = 15;

function rateLimited(request: Request): Response | null {
  const rl = checkRateLimit(request, RATE_LIMIT);
  if (rl.allowed) return null;
  const retryAfterSec = Math.ceil(rl.retryAfterMs / 1000);
  return jsonError(429, `Too many requests. Try again in ${retryAfterSec} seconds.`, {
    "Retry-After": String(retryAfterSec),
    "X-RateLimit-Limit": String(RATE_LIMIT),
  });
}

async function handle(input: PublicAnalyzeInput): Promise<Response> {
  const parsed = analyzeInputSchema.safeParse(input);
  if (!parsed.success) {
    return jsonError(400, parsed.error.issues[0]?.message ?? "Invalid request.");
  }

  try {
    const response = await analyzePublicListing(parsed.data);
    return jsonResponse(response, 200, {
      "Cache-Control": "no-store",
      "X-RateLimit-Limit": String(RATE_LIMIT),
    });
  } catch (error) {
    if (error instanceof PublicApiError) {
      return jsonError(error.status, error.message);
    }
    return jsonError(500, "The analyzer could not process this listing. Try again.");
  }
}

export function OPTIONS(): Response {
  return corsPreflight();
}

export async function POST(request: Request): Promise<Response> {
  const limited = rateLimited(request);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Send a JSON body with one of: `url`, `text`, or `manualDetails`.");
  }
  return handle(body as PublicAnalyzeInput);
}

const getQuerySchema = z.object({
  url: z.string().optional(),
  text: z.string().optional(),
});

export async function GET(request: Request): Promise<Response> {
  const limited = rateLimited(request);
  if (limited) return limited;

  const { searchParams } = new URL(request.url);
  const query = getQuerySchema.parse({
    url: searchParams.get("url") ?? undefined,
    text: searchParams.get("text") ?? undefined,
  });

  if (!query.url && !query.text) {
    return jsonResponse(
      {
        service: "DealScan deal-analysis API",
        version: "1.0.0",
        usage: {
          post: "POST /api/v1/analyze with JSON { url } | { text } | { manualDetails }",
          get: "GET /api/v1/analyze?url=<listing-url> or ?text=<listing-text>",
        },
        docs: "https://dealscan.dev/api/openapi.json",
        mcp: "https://dealscan.dev/api/mcp",
      },
      200,
      { ...CORS_HEADERS },
    );
  }

  return handle(query);
}
