import { NextResponse } from "next/server";
import { scrapeListingUrl } from "@/lib/listing-scraper";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limit = 8;
  const rl = checkRateLimit(request, limit);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterMs, limit);
  let url: string;

  try {
    const body = (await request.json()) as { url?: unknown };
    url = typeof body.url === "string" ? body.url : "";
  } catch {
    return NextResponse.json({ error: "Send a listing URL as JSON." }, { status: 400 });
  }

  try {
    const listing = await scrapeListingUrl(url);
    return NextResponse.json({ listing });
  } catch (caughtError) {
    if (caughtError instanceof Error) {
      // Check for blocking HTTP status codes: 403, 429, 503
      const httpErrorMatch = caughtError.message.match(/^Listing page returned HTTP (\d+)\.?$/);
      if (httpErrorMatch) {
        const statusCode = parseInt(httpErrorMatch[1], 10);
        if ([403, 429, 503].includes(statusCode)) {
          return NextResponse.json(
            { error: "This site blocked the page read. Paste seller notes instead." },
            { status: 400 }
          );
        }
      }
    }
    return NextResponse.json(
      { error: caughtError instanceof Error ? caughtError.message : "Could not extract that listing." },
      { status: 400 },
    );
  }
}
