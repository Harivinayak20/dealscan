import { LISTING_TEXT_MAX_LENGTH } from "./listing-validation.ts";
import { parseSafeHttpUrl } from "./url-safety.ts";
import { ExtractionCache } from "./extraction-cache.ts";

const MAX_HTML_BYTES = 1_500_000;
const MAX_REDIRECTS = 4;

type FetchLike = typeof fetch;

export type ScrapedListing = {
  url: string;
  title: string;
  text: string;
  engine: "safe-fetch";
};

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function normalizeWhitespace(value: string) {
  return decodeHtml(value)
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function readMeta(html: string, name: string) {
  const tags = Array.from(html.matchAll(/<meta\s+[^>]*>/gi)).map((match) => match[0]);

  for (const tag of tags) {
    const key = tag.match(/\s(?:name|property)=["']([^"']+)["']/i)?.[1];

    if (key?.toLowerCase() !== name.toLowerCase()) {
      continue;
    }

    const content = tag.match(/\scontent=["']([^"']+)["']/i)?.[1];

    if (content) {
      return content;
    }
  }

  return "";
}

function readTitle(html: string) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
}

function extractJsonLdText(html: string) {
  const matches = Array.from(html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi));
  const values: string[] = [];

  for (const match of matches) {
    try {
      const parsed = JSON.parse(decodeHtml(match[1] ?? ""));
      const queue = Array.isArray(parsed) ? [...parsed] : [parsed];

      while (queue.length) {
        const item = queue.shift();

        if (!item || typeof item !== "object") {
          continue;
        }

        for (const [key, value] of Object.entries(item as Record<string, unknown>)) {
          if (typeof value === "string" && /name|title|description|price|mileage|model|brand|vehicle|body/i.test(key)) {
            values.push(value);
          } else if (Array.isArray(value)) {
            queue.push(...value);
          } else if (value && typeof value === "object") {
            queue.push(value);
          }
        }
      }
    } catch {
      continue;
    }
  }

  return values.join("\n");
}

function htmlToText(html: string) {
  return normalizeWhitespace(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<(br|p|div|li|tr|section|article|h[1-6])\b[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  );
}

export function extractListingTextFromHtml(html: string) {
  const title = normalizeWhitespace(readTitle(html));
  const metaDescription = normalizeWhitespace(readMeta(html, "description") || readMeta(html, "og:description"));
  const ogTitle = normalizeWhitespace(readMeta(html, "og:title"));
  const jsonLd = normalizeWhitespace(extractJsonLdText(html));
  const bodyText = htmlToText(html);
  const seen = new Set<string>();
  const lines = [ogTitle, title, metaDescription, jsonLd, bodyText]
    .join("\n")
    .split("\n")
    .map((line) => normalizeWhitespace(line))
    .filter((line) => line.length >= 3)
    .filter((line) => {
      const key = line.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });

  return {
    title: ogTitle || title || "Scraped listing",
    text: lines.join("\n").slice(0, LISTING_TEXT_MAX_LENGTH),
  };
}

/**
 * Sites increasingly answer bots with HTTP 200 and a block page, so status
 * codes alone cannot be trusted. Autotrader serves "page unavailable" as a 200.
 */
const BLOCK_PAGE_SIGNATURES = [
  /page unavailable/i,
  /site is currently unavailable/i,
  /temporarily unavailable/i,
  /access denied/i,
  /request blocked/i,
  /pardon our interruption/i,
  /attention required/i,
  /are you a (human|robot)/i,
  /verify (you are|you're) (a )?human/i,
  /unusual traffic/i,
  /enable javascript/i,
  /captcha/i,
  /incident number/i,
  /reference ?id/i,
  /forbidden/i,
];

/** Thrown when a page loaded but is not a readable car listing. Not worth retrying. */
export class UnreadableListingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnreadableListingError";
  }
}

function looksLikeBlockPage(title: string, text: string) {
  const sample = `${title}\n${text.slice(0, 1200)}`;
  return BLOCK_PAGE_SIGNATURES.some((pattern) => pattern.test(sample));
}

/**
 * A real listing names a model year plus a price or mileage. Without those the
 * analyzer would be scoring navigation chrome or an error page as if it were a car.
 */
export function looksLikeCarListing(text: string) {
  const hasYear = /\b(19[89]\d|20[0-5]\d)\b/.test(text);
  const hasPrice = /\$\s?\d[\d,]{2,}/.test(text);
  const hasMileage = /\b\d{1,3}(?:,\d{3})*\s?(?:miles|mi)\b/i.test(text);

  return hasYear && (hasPrice || hasMileage);
}

const SEARCH_PAGE_TITLE = /(cars?|vehicles?|suvs?|trucks?)\s+for\s+sale|search results|browse|inventory|listings?\s+near/i;

/**
 * A browse or search page carries many cars at many prices. Scoring one averages
 * a whole page of inventory into a single meaningless verdict.
 */
export function looksLikeSearchResultsPage(title: string, text: string) {
  const distinctPrices = new Set(text.match(/\$\s?\d[\d,]{2,}/g) ?? []);

  return SEARCH_PAGE_TITLE.test(title) && distinctPrices.size >= 6;
}

async function readLimitedText(response: Response) {
  const reader = response.body?.getReader();

  if (!reader) {
    return response.text();
  }

  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    total += value.byteLength;

    if (total > MAX_HTML_BYTES) {
      throw new Error("Listing page is too large to extract safely.");
    }

    chunks.push(value);
  }

  return new TextDecoder().decode(Uint8Array.from(chunks.flatMap((chunk) => Array.from(chunk))));
}

async function fetchWithSafeRedirects(startUrl: URL, fetcher: FetchLike, userAgent?: string) {
  let currentUrl = startUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await fetcher(currentUrl, {
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": userAgent ?? "DealScanBot/1.0 (+https://dealscan.dev)",
      },
      redirect: "manual",
    });

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");

      if (!location) {
        throw new Error("Listing page redirected without a destination.");
      }

      currentUrl = parseSafeHttpUrl(new URL(location, currentUrl).toString());
      continue;
    }

    return { response, finalUrl: currentUrl };
  }

  throw new Error("Listing page redirected too many times.");
}

export async function scrapeListingUrl(rawUrl: string, fetcher: FetchLike = fetch): Promise<ScrapedListing> {
  // Check cache first
  const cached = ExtractionCache.get(rawUrl);
  if (cached) {
    return {
      url: rawUrl,
      title: cached.title,
      text: cached.text,
      engine: "safe-fetch",
    };
  }

  const safeUrl = parseSafeHttpUrl(rawUrl);

  // User agent rotation to appear more like a regular browser
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0",
  ];
  const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

  let lastError: Error | null = null;
  const maxAttempts = 3;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const { response, finalUrl } = await fetchWithSafeRedirects(safeUrl, fetcher, userAgent);

      if (!response.ok) {
        throw new Error(`Listing page returned HTTP ${response.status}.`);
      }

      const contentType = response.headers.get("content-type") ?? "";

      if (contentType && !/text\/html|application\/xhtml\+xml/i.test(contentType)) {
        throw new Error("Listing URL did not return an HTML page.");
      }

      const html = await readLimitedText(response);
      const extracted = extractListingTextFromHtml(html);

      if (extracted.text.length < 80) {
        throw new Error("Could not extract enough listing text from that page.");
      }

      if (looksLikeBlockPage(extracted.title, extracted.text)) {
        throw new UnreadableListingError(
          "This site served a bot-protection page instead of the listing. Copy the listing text and paste it here, or upload a screenshot.",
        );
      }

      if (looksLikeSearchResultsPage(extracted.title, extracted.text)) {
        throw new UnreadableListingError(
          "That link is a search or browse page with many cars on it. Open one specific car and paste that link instead.",
        );
      }

      if (!looksLikeCarListing(extracted.text)) {
        throw new UnreadableListingError(
          "That page loaded, but no vehicle details (year, price, or mileage) could be read from it. Copy the listing text and paste it here, or upload a screenshot.",
        );
      }

      const result: ScrapedListing = {
        url: finalUrl.toString(),
        title: extracted.title,
        text: extracted.text,
        engine: "safe-fetch",
      };

      // Cache successful extraction
      ExtractionCache.set(rawUrl, { title: extracted.title, text: extracted.text });

      return result;
    } catch (err) {
      // A block page or a non-listing page returns the same thing every time.
      if (err instanceof UnreadableListingError) {
        throw err;
      }

      lastError = err as Error;
      // If this is not the last attempt, wait before retrying
      if (attempt < maxAttempts - 1) {
        // Exponential backoff: 100ms, 200ms, 400ms
        await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, attempt)));
      }
    }
  }

  // If we get here, all attempts failed
  throw lastError ?? new Error("Unknown error during extraction");
}
