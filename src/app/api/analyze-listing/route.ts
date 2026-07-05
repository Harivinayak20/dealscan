import { NextResponse } from "next/server";
import type { AnalyzeListingRequest, AnalyzeListingResult } from "@/lib/analyzer-types";
import { getAnalysisCacheKey, getCachedAnalysis, setCachedAnalysis } from "@/lib/analysis-cache";
import { analyzeListingRequestSchema } from "@/lib/analyze-listing-schema";
import { getAiProviderConfig, runAnalysisWithFailover } from "@/lib/ai-providers";
import { analyzeListingLocally, detectVehicle } from "@/lib/local-analyzer";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { recordScan } from "@/lib/analytics";
import { getMarketContext, recordListingObservation } from "@/lib/listing-memory";
import { verdictToStatus } from "@/lib/admin-types";

function extractVehicleTitle(text: string): string | null {
  const match = text.match(/\b(19|20)\d{2}\s+[A-Za-z]+\s+[A-Za-z0-9-]+(?:\s+[A-Za-z0-9-]+){0,3}/);
  return match?.[0].replace(/,$/, "") ?? null;
}

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

  // Listing memory + market context never block or break the scan itself.
  const detected = detectVehicle(body);
  const vehicleTitle = extractVehicleTitle(body.listingText);
  const listingMemory = await recordListingObservation(body, detected, vehicleTitle);
  const marketContext = await getMarketContext(detected);
  const memoryFields = {
    ...(listingMemory ? { listingMemory } : {}),
    ...(marketContext ? { marketContext } : {}),
  };

  const providerConfig = getAiProviderConfig();
  const cacheVariant = providerConfig.enabled
    ? `${providerConfig.provider}:${process.env.GROQ_MODEL ?? ""}`
    : "local";
  const cacheKey = getAnalysisCacheKey(body, cacheVariant);
  const cachedResult = getCachedAnalysis(cacheKey);

  if (cachedResult) {
    await recordScan({
      vehicleTitle,
      score: cachedResult.result.score,
      verdict: verdictToStatus(cachedResult.result.verdict),
      confidence: cachedResult.result.confidence,
      inputType: body.inputType,
      source: cachedResult.analysisMode === "local" ? "local" : "groq",
    });
    return NextResponse.json({
      result: cachedResult.result,
      analysisMode: cachedResult.analysisMode,
      cached: true,
      provider: cachedResult.analysisMode === "local" ? "local" : providerConfig.provider,
      ...memoryFields,
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
    await recordScan({
      vehicleTitle,
      score: localResult.score,
      verdict: verdictToStatus(localResult.verdict),
      confidence: localResult.confidence,
      inputType: body.inputType,
      source: "local",
    });

    return NextResponse.json({
      result: localResult,
      analysisMode: "local",
      cached: false,
      provider: "local",
      notice: "Local analysis is shown because GROQ_API_KEY is not configured. Add it for AI-enhanced scoring.",
      ...memoryFields,
    });
  }

  const { result, analysisMode, notice } = await runAnalysisWithFailover(body, localResult);

  // Do not cache local fallbacks under the AI cache variant: the next
  // request should retry the AI providers instead of reusing the downgrade.
  if (analysisMode !== "local") {
    setCachedAnalysis(cacheKey, result, analysisMode);
  }

  await recordScan({
    vehicleTitle: extractVehicleTitle(body.listingText),
    score: result.score,
    verdict: verdictToStatus(result.verdict),
    confidence: result.confidence,
    inputType: body.inputType,
    source: analysisMode === "local" ? "local" : "groq",
  });

  return NextResponse.json({
    result,
    analysisMode,
    cached: false,
    provider: analysisMode,
    ...(notice ? { notice } : {}),
    ...memoryFields,
  });
}
