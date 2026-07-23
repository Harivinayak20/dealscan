import { LISTING_TEXT_MAX_LENGTH } from "./listing-validation.ts";

const DEFAULT_API_URL = "https://api.firecrawl.dev";
const FIRECRAWL_TIMEOUT_MS = 25_000;

export type FirecrawlPage = {
  title: string;
  text: string;
  finalUrl: string;
};

export function hasFirecrawl(): boolean {
  return Boolean(process.env.FIRECRAWL_API_KEY?.trim());
}

/**
 * Renders a page through Firecrawl (cloud or a self-hosted instance) to get past
 * bot walls that block a plain server fetch. Set FIRECRAWL_API_URL to point at your
 * own deployment of github.com/firecrawl/firecrawl; it defaults to their cloud API.
 */
export async function scrapeViaFirecrawl(url: string): Promise<FirecrawlPage> {
  const apiKey = process.env.FIRECRAWL_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("FIRECRAWL_API_KEY is not configured.");
  }

  const baseUrl = (process.env.FIRECRAWL_API_URL?.trim() || DEFAULT_API_URL).replace(/\/+$/, "");

  const response = await fetch(`${baseUrl}/v2/scrape`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      onlyMainContent: true,
      // "auto" starts on the cheap proxy and escalates to stealth residential only when
      // a site blocks it, so tougher sites (Autotrader, Craigslist) still get through.
      proxy: "auto",
      timeout: 20_000,
    }),
    signal: AbortSignal.timeout(FIRECRAWL_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Firecrawl returned HTTP ${response.status}.`);
  }

  const body = (await response.json()) as {
    success?: boolean;
    error?: string;
    data?: {
      markdown?: string;
      metadata?: { title?: string | string[]; url?: string; sourceURL?: string };
    };
  };

  if (!body.success || !body.data) {
    throw new Error(body.error || "Firecrawl could not read that page.");
  }

  const text = (body.data.markdown ?? "").trim();

  if (!text) {
    throw new Error("Firecrawl returned no content for that page.");
  }

  const rawTitle = body.data.metadata?.title;
  const title = (Array.isArray(rawTitle) ? rawTitle[0] : rawTitle)?.trim() || "Scraped listing";

  return {
    title,
    text: text.slice(0, LISTING_TEXT_MAX_LENGTH),
    finalUrl: body.data.metadata?.url || body.data.metadata?.sourceURL || url,
  };
}
