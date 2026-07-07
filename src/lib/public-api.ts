/**
 * Orchestration for the public API surfaces (`/api/v1/*`, `/api/mcp`). Composes
 * the dependency-light core (`public-api-core.ts`) with the same scraper, local
 * analyzer, AI failover, and cache the website uses, so an API result and an
 * on-site result are always identical.
 */
import type { AnalyzeListingRequest, AnalyzeListingResult } from "@/lib/analyzer-types";
import { getAnalysisCacheKey, getCachedAnalysis, setCachedAnalysis } from "@/lib/analysis-cache";
import { getAiProviderConfig, runAnalysisWithFailover } from "@/lib/ai-providers";
import { analyzeListingLocally } from "@/lib/local-analyzer";
import { recordScan } from "@/lib/analytics";
import { verdictToStatus } from "@/lib/admin-types";
import {
  resolvePublicListing,
  toPublicResponse,
  type PublicAnalyzeInput,
  type PublicAnalysisResponse,
} from "@/lib/public-api-core";

export {
  PUBLIC_API_VERSION,
  PUBLIC_DISCLAIMER,
  PublicApiError,
  analyzeInputSchema,
  manualDetailsInputSchema,
  resolvePublicListing,
  toPublicResponse,
} from "@/lib/public-api-core";
export type {
  PublicAnalyzeInput,
  PublicAnalysisResponse,
  PublicAnalysisSource,
} from "@/lib/public-api-core";

function extractVehicleTitle(text: string): string | null {
  const match = text.match(/\b(19|20)\d{2}\s+[A-Za-z]+\s+[A-Za-z0-9-]+(?:\s+[A-Za-z0-9-]+){0,3}/);
  return match?.[0].replace(/,$/, "") ?? null;
}

/**
 * Run the full analysis pipeline for a resolved request. Mirrors the internal
 * `/api/analyze-listing` route: cache -> local analyzer -> AI failover, with
 * analytics recorded once. Never throws for a well-formed request; falls back
 * to the local analyzer when no AI provider is configured.
 */
export async function runPublicAnalysis(request: AnalyzeListingRequest): Promise<{
  result: AnalyzeListingResult;
  analysisMode: "groq" | "gemini" | "local";
  cached: boolean;
}> {
  const providerConfig = getAiProviderConfig();
  const cacheVariant = providerConfig.enabled
    ? `${providerConfig.provider}:${process.env.GROQ_MODEL ?? ""}`
    : "local";
  const cacheKey = getAnalysisCacheKey(request, cacheVariant);
  const cached = getCachedAnalysis(cacheKey);

  if (cached) {
    await recordScan({
      vehicleTitle: extractVehicleTitle(request.listingText),
      score: cached.result.score,
      verdict: verdictToStatus(cached.result.verdict),
      confidence: cached.result.confidence,
      inputType: request.inputType,
      source: cached.analysisMode === "local" ? "local" : "groq",
    });
    return { result: cached.result, analysisMode: cached.analysisMode, cached: true };
  }

  const localResult = analyzeListingLocally(request);

  if (!providerConfig.enabled) {
    setCachedAnalysis(cacheKey, localResult, "local");
    await recordScan({
      vehicleTitle: extractVehicleTitle(request.listingText),
      score: localResult.score,
      verdict: verdictToStatus(localResult.verdict),
      confidence: localResult.confidence,
      inputType: request.inputType,
      source: "local",
    });
    return { result: localResult, analysisMode: "local", cached: false };
  }

  const { result, analysisMode } = await runAnalysisWithFailover(request, localResult);
  if (analysisMode !== "local") {
    setCachedAnalysis(cacheKey, result, analysisMode);
  }

  await recordScan({
    vehicleTitle: extractVehicleTitle(request.listingText),
    score: result.score,
    verdict: verdictToStatus(result.verdict),
    confidence: result.confidence,
    inputType: request.inputType,
    source: analysisMode === "local" ? "local" : "groq",
  });

  return { result, analysisMode, cached: false };
}

/** End-to-end helper used by both the REST route and the MCP tool. */
export async function analyzePublicListing(
  input: PublicAnalyzeInput,
): Promise<PublicAnalysisResponse> {
  const { request, source } = await resolvePublicListing(input);
  const { result, analysisMode, cached } = await runPublicAnalysis(request);
  return toPublicResponse(result, analysisMode, cached, source);
}
