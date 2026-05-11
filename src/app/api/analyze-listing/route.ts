import { NextResponse } from "next/server";
import type { AnalyzeListingRequest } from "@/lib/analyzer-types";
import { getAnalysisCacheKey, getCachedAnalysis, setCachedAnalysis } from "@/lib/analysis-cache";
import { analyzeListingRequestSchema } from "@/lib/analyze-listing-schema";
import { getAiProviderConfig, runOptionalAiAnalysis } from "@/lib/ai-providers";
import { analyzeListingLocally } from "@/lib/local-analyzer";

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

  const cacheKey = getAnalysisCacheKey(body);
  const cachedResult = getCachedAnalysis(cacheKey);
  const providerConfig = getAiProviderConfig();

  if (cachedResult) {
    return NextResponse.json({
      result: cachedResult.result,
      analysisMode: cachedResult.analysisMode,
      cached: true,
      provider: providerConfig.provider,
    });
  }

  const localResult = analyzeListingLocally(body);
  const enhancedResult = await runOptionalAiAnalysis(body, localResult);
  const result = enhancedResult ?? localResult;
  const analysisMode = enhancedResult ? "ai" : "local";

  setCachedAnalysis(cacheKey, result, analysisMode);

  return NextResponse.json({
    result,
    analysisMode,
    cached: false,
    provider: providerConfig.provider,
  });
}
