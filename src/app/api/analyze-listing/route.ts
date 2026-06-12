import { NextResponse } from "next/server";
import type { AnalyzeListingRequest, AnalyzeListingResult } from "@/lib/analyzer-types";
import { getAnalysisCacheKey, getCachedAnalysis, setCachedAnalysis } from "@/lib/analysis-cache";
import { analyzeListingRequestSchema } from "@/lib/analyze-listing-schema";
import { getAiProviderConfig, runAnalysisWithFailover } from "@/lib/ai-providers";
import { analyzeListingLocally } from "@/lib/local-analyzer";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limit = 10;
  const rl = checkRateLimit(request, limit);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterMs, limit);
  let body: AnalyzeListingRequest;

  try {
    const parsed = analyzeListingRequestSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Check the listing details and try again." },
        { status: 400 },
      );
    }

    body = parsed.data;
  } catch {
    return NextResponse.json({ error: "Send valid listing details as JSON." }, { status: 400 });
  }

  const providerConfig = getAiProviderConfig();
  const cacheVariant = providerConfig.enabled
    ? `${providerConfig.provider}:${process.env.GROQ_MODEL ?? ""}`
    : "local";
  const cacheKey = getAnalysisCacheKey(body, cacheVariant);
  const cachedResult = getCachedAnalysis(cacheKey);

  if (cachedResult) {
    return NextResponse.json({
      result: cachedResult.result,
      analysisMode: cachedResult.analysisMode,
      cached: true,
      provider: cachedResult.analysisMode === "local" ? "local" : providerConfig.provider,
    });
  }

  let localResult: AnalyzeListingResult;

  try {
    localResult = analyzeListingLocally(body);
  } catch {
    return NextResponse.json(
      { error: "The local analyzer could not process this listing. Check the listing text and try again." },
      { status: 500 },
    );
  }

  if (!providerConfig.enabled) {
    setCachedAnalysis(cacheKey, localResult, "local");

    return NextResponse.json({
      result: localResult,
      analysisMode: "local",
      cached: false,
      provider: "local",
      notice: "Local analysis is shown because GROQ_API_KEY is not configured. Add it for AI-enhanced scoring.",
    });
  }

  const { result, analysisMode, notice } = await runAnalysisWithFailover(body, localResult);

  // Do not cache local fallbacks under the AI cache variant: the next
  // request should retry the AI providers instead of reusing the downgrade.
  if (analysisMode !== "local") {
    setCachedAnalysis(cacheKey, result, analysisMode);
  }

  return NextResponse.json({
    result,
    analysisMode,
    cached: false,
    provider: analysisMode,
    ...(notice ? { notice } : {}),
  });
}
