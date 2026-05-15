import { NextResponse } from "next/server";
import type { AnalyzeListingRequest, AnalyzeListingResult } from "@/lib/analyzer-types";
import { getAnalysisCacheKey, getCachedAnalysis, setCachedAnalysis } from "@/lib/analysis-cache";
import { analyzeListingRequestSchema } from "@/lib/analyze-listing-schema";
import { getAiProviderConfig, runGroqAnalysis } from "@/lib/ai-providers";
import { analyzeListingLocally } from "@/lib/local-analyzer";

export const runtime = "edge";

export async function POST(request: Request) {
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

  let result: AnalyzeListingResult;

  try {
    result = await runGroqAnalysis(body, localResult);
  } catch (caughtError) {
    return NextResponse.json(
      { error: caughtError instanceof Error ? caughtError.message : "Groq analysis failed." },
      { status: 502 },
    );
  }

  const analysisMode = "groq";

  setCachedAnalysis(cacheKey, result, analysisMode);

  return NextResponse.json({
    result,
    analysisMode,
    cached: false,
    provider: providerConfig.provider,
  });
}
