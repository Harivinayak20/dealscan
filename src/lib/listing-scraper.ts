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
