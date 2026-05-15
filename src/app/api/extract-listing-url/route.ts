import { NextResponse } from "next/server";
import { scrapeListingUrl } from "@/lib/listing-scraper";

export const runtime = "edge";

export async function POST(request: Request) {
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
    return NextResponse.json(
      { error: caughtError instanceof Error ? caughtError.message : "Could not extract that listing." },
      { status: 400 },
    );
  }
}
