/**
 * Dependency-light core for the public API. Holds the request schema, source
 * resolution (url/text/manual -> internal request), and the public-response
 * mapper. Kept free of the AI-provider / analytics / Cloudflare imports so it
 * can be unit-tested directly; the heavy orchestration lives in `public-api.ts`.
 */
import { z } from "zod";
import type {
  AnalyzeListingRequest,
  AnalyzeListingResult,
  ManualDetails,
} from "./analyzer-types.ts";
import { LISTING_TEXT_MAX_LENGTH, LISTING_TEXT_MIN_LENGTH } from "./listing-validation.ts";
import { scrapeListingUrl, BlockedListingError } from "./listing-scraper.ts";

export const PUBLIC_API_VERSION = "1.0.0";

export const PUBLIC_DISCLAIMER =
  "DealScan is an independent estimate generated from listing text, not a vehicle inspection, licensed valuation, or vehicle history report. Confirm with a mechanic and a title/odometer check before buying.";

// Marketplaces that require a login and block automated reads. Fail fast with
// a useful message instead of burning a slow fetch that will be blocked.
const BLOCKED_URL = /(^|\/\/|\.)(facebook\.com|fb\.com|fb\.me|instagram\.com)/i;

/** A typed error whose HTTP status flows straight to the JSON response. */
export class PublicApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "PublicApiError";
    this.status = status;
  }
}

export const manualDetailsInputSchema = z
  .object({
    year: z.string().trim().optional(),
    make: z.string().trim().optional(),
    model: z.string().trim().optional(),
    mileage: z.string().trim().optional(),
    price: z.string().trim().optional(),
    titleStatus: z.string().trim().optional(),
    sellerNotes: z.string().trim().optional(),
  })
  .strict();

export const analyzeInputSchema = z
  .object({
    url: z.string().url().optional(),
    text: z.string().trim().optional(),
    manualDetails: manualDetailsInputSchema.optional(),
  })
  .strict()
  .refine((v) => Boolean(v.url || v.text || v.manualDetails), {
    message: "Provide one of: `url`, `text`, or `manualDetails`.",
  });

export type PublicAnalyzeInput = z.infer<typeof analyzeInputSchema>;

export type PublicAnalysisSource =
  | { type: "url"; url: string; title: string }
  | { type: "text" }
  | { type: "manual" };

export type PublicAnalysisResponse = {
  apiVersion: string;
  analysis: {
    score: number;
    verdict: string;
    summary: string;
    confidence: AnalyzeListingResult["confidence"];
    fairValue: AnalyzeListingResult["estimatedFairValueRange"];
    suggestedOffer: AnalyzeListingResult["suggestedOfferRange"];
    categories: AnalyzeListingResult["categories"];
    redFlags: string[];
    greenFlags: string[];
    missingInfo: string[];
    negotiationTip: string;
    sellerQuestions: string[];
  };
  meta: {
    analysisMode: "groq" | "gemini" | "local";
    cached: boolean;
    source: PublicAnalysisSource;
    disclaimer: string;
  };
};

export function manualDetailsToText(details: ManualDetails): string {
  const lines: string[] = [];
  const push = (label: string, value?: string) => {
    if (value && value.trim()) lines.push(`${label}: ${value.trim()}`);
  };
  push("Year", details.year);
  push("Make", details.make);
  push("Model", details.model);
  push("Mileage", details.mileage);
  push("Price", details.price);
  push("Title status", details.titleStatus);
  push("Seller notes", details.sellerNotes);
  return lines.join("\n");
}

function assertListingLength(text: string): void {
  if (text.length < LISTING_TEXT_MIN_LENGTH) {
    throw new PublicApiError(
      422,
      `Not enough listing detail to analyze (need at least ${LISTING_TEXT_MIN_LENGTH} characters).`,
    );
  }
}

/**
 * Turn a caller's `{ url | text | manualDetails }` into the internal
 * `AnalyzeListingRequest`, scraping the URL when needed. Throws
 * `PublicApiError` with an appropriate status on bad or unreadable input.
 * `fetcher` is injectable for tests.
 */
export async function resolvePublicListing(
  input: PublicAnalyzeInput,
  fetcher: typeof fetch = fetch,
): Promise<{ request: AnalyzeListingRequest; source: PublicAnalysisSource }> {
  if (input.url) {
    if (BLOCKED_URL.test(input.url)) {
      throw new PublicApiError(
        422,
        "Facebook and Instagram listings require a login and can't be read. Send the ad text via `text` instead.",
      );
    }

    let scraped;
    try {
      scraped = await scrapeListingUrl(input.url, fetcher);
    } catch (error) {
      if (error instanceof BlockedListingError) {
        throw new PublicApiError(
          422,
          "That site blocked the automated read. Send the ad text via `text` instead.",
        );
      }
      const message = error instanceof Error ? error.message : "Could not read that listing URL.";
      throw new PublicApiError(422, message);
    }

    const text = scraped.text.slice(0, LISTING_TEXT_MAX_LENGTH);
    assertListingLength(text);
    return {
      request: { inputType: "url", listingText: text, sourceUrl: scraped.url },
      source: { type: "url", url: scraped.url, title: scraped.title },
    };
  }

  if (input.manualDetails) {
    const text = manualDetailsToText(input.manualDetails);
    assertListingLength(text);
    return {
      request: {
        inputType: "manual",
        listingText: text.slice(0, LISTING_TEXT_MAX_LENGTH),
        manualDetails: input.manualDetails,
      },
      source: { type: "manual" },
    };
  }

  const text = (input.text ?? "").trim();
  assertListingLength(text);
  if (text.length > LISTING_TEXT_MAX_LENGTH) {
    throw new PublicApiError(
      422,
      `Keep the listing under ${LISTING_TEXT_MAX_LENGTH.toLocaleString()} characters.`,
    );
  }
  return { request: { inputType: "text", listingText: text }, source: { type: "text" } };
}

/** Shape the internal result into the stable public v1 envelope. */
export function toPublicResponse(
  result: AnalyzeListingResult,
  analysisMode: "groq" | "gemini" | "local",
  cached: boolean,
  source: PublicAnalysisSource,
): PublicAnalysisResponse {
  return {
    apiVersion: PUBLIC_API_VERSION,
    analysis: {
      score: result.score,
      verdict: result.verdict,
      summary: result.summary,
      confidence: result.confidence,
      fairValue: result.estimatedFairValueRange,
      suggestedOffer: result.suggestedOfferRange,
      categories: result.categories,
      redFlags: result.redFlags,
      greenFlags: result.greenFlags,
      missingInfo: result.missingInfo,
      negotiationTip: result.negotiationTip,
      sellerQuestions: result.sellerQuestions,
    },
    meta: {
      analysisMode,
      cached,
      source,
      disclaimer: PUBLIC_DISCLAIMER,
    },
  };
}
