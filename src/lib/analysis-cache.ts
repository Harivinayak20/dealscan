import type { AnalysisMode, AnalyzeListingRequest, AnalyzeListingResult } from "@/lib/analyzer-types";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

type CacheEntry = {
  expiresAt: number;
  analysisMode: AnalysisMode;
  result: AnalyzeListingResult;
};

const analysisCache = new Map<string, CacheEntry>();

export function normalizeAnalysisInput(request: AnalyzeListingRequest) {
  return `${request.sourceUrl ?? ""} ${request.listingText} ${Object.values(request.manualDetails ?? {}).join(" ")}`
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

export function getAnalysisCacheKey(request: AnalyzeListingRequest, variant = "groq") {
  return hashString(`${variant}:${normalizeAnalysisInput(request)}`);
}

export function getCachedAnalysis(key: string) {
  const entry = analysisCache.get(key);

  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    analysisCache.delete(key);
    return null;
  }

  return {
    analysisMode: entry.analysisMode,
    result: entry.result,
  };
}

export function setCachedAnalysis(key: string, result: AnalyzeListingResult, analysisMode: AnalysisMode) {
  analysisCache.set(key, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    analysisMode,
    result,
  });
}

// TODO: Replace this process-local cache with Cloudflare KV, Upstash, or Supabase when multi-instance caching is needed.
