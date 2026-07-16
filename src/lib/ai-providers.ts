import type { AnalyzeListingRequest, AnalyzeListingResult } from "@/lib/analyzer-types";

type ProviderConfig = {
  provider: "groq";
  apiKey: string | null;
  enabled: boolean;
};

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
// llama-3.3-70b-versatile was deprecated by Groq on 2026-06-17;
// gpt-oss-120b is the recommended replacement.
const GROQ_DEFAULT_MODEL = "openai/gpt-oss-120b";
const GROQ_TIMEOUT_MS = 10_000;

const systemPrompt =
  "You are a skeptical but fair used car expert. Analyze only information provided by the user. Do not claim certainty. If fair market value is estimated, clearly label it as an estimate. Penalize vague listings, missing title info, missing VIN, missing mileage, suspicious wording, and unclear seller claims. Reward clean title, one owner, service records, detailed maintenance, reasonable mileage, and transparent seller language. Return only valid JSON.";

function extractJson(text: string): AnalyzeListingResult {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Groq did not return JSON.");
  }

  return JSON.parse(cleaned.slice(start, end + 1)) as AnalyzeListingResult;
}

function verdictForScore(score: number) {
  if (score >= 85) return "Great Deal";
  if (score >= 70) return "Decent Deal";
  if (score >= 55) return "Proceed with Caution";
  if (score >= 40) return "Red Flags Present";

  return "Avoid";
}

function normalizeResult(result: AnalyzeListingResult): AnalyzeListingResult {
  const score = Math.max(0, Math.min(100, Math.round(result.score)));

  return {
    ...result,
    score,
    verdict: verdictForScore(score),
    summary: result.summary || "Analysis completed from the provided listing details.",
    estimatedFairValueRange: result.estimatedFairValueRange ?? {
      low: null,
      high: null,
      note: "Rough estimate unavailable.",
    },
    suggestedOfferRange: result.suggestedOfferRange ?? {
      low: null,
      high: null,
      note: "Suggested offer unavailable.",
    },
    categories: (result.categories ?? []).map((category) => ({
      ...category,
      score: Math.max(0, Math.min(100, Math.round(category.score))),
    })),
    redFlags: result.redFlags ?? [],
    greenFlags: result.greenFlags ?? [],
    missingInfo: result.missingInfo ?? [],
    negotiationTip: result.negotiationTip || "Verify the missing details before making an offer.",
    sellerQuestions: result.sellerQuestions ?? [],
    confidence: result.confidence === "High" || result.confidence === "Medium" ? result.confidence : "Low",
  };
}

function buildUserPrompt(request: AnalyzeListingRequest, localResult: AnalyzeListingResult) {
  return `Analyze this used car listing and return JSON only.

Use the heuristic result only as a schema and sanity-check baseline. Your final answer must be based on the listing text.

Input type: ${request.inputType}
Source URL: ${request.sourceUrl ?? "none"}

Listing text:
${request.listingText}

Manual details:
${JSON.stringify(request.manualDetails ?? {}, null, 2)}

Heuristic schema baseline:
${JSON.stringify(localResult, null, 2)}

Return the same JSON schema as the heuristic baseline. Use simple language. Do not provide legal, financing, insurance, or tax advice.`;
}

export function getAiProviderConfig(): ProviderConfig {
  const apiKey = process.env.GROQ_API_KEY?.trim() || null;

  return {
    provider: "groq",
    apiKey,
    enabled: Boolean(apiKey),
  };
}

const GEMINI_DEFAULT_MODEL = "gemini-2.0-flash";
const GEMINI_TIMEOUT_MS = 10_000;

export async function runGeminiAnalysis(request: AnalyzeListingRequest, localResult: AnalyzeListingResult) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const model = process.env.GEMINI_MODEL || GEMINI_DEFAULT_MODEL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: buildUserPrompt(request, localResult) }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1600,
          responseMimeType: "application/json",
        },
      }),
      signal: controller.signal,
    },
  ).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    throw new Error(`Gemini analysis failed with HTTP ${response.status}.`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini did not return analysis text.");
  }

  return normalizeResult(extractJson(text));
}

export type FailoverAnalysis = {
  result: AnalyzeListingResult;
  analysisMode: "groq" | "gemini" | "local";
  notice?: string;
};

/**
 * Provider chain: Groq -> Gemini (when configured) -> local heuristic.
 * The user always gets an analysis; a notice explains any downgrade.
 */
export async function runAnalysisWithFailover(
  request: AnalyzeListingRequest,
  localResult: AnalyzeListingResult,
): Promise<FailoverAnalysis> {
  try {
    return { result: await runGroqAnalysis(request, localResult), analysisMode: "groq" };
  } catch {
    // fall through
  }

  if (process.env.GEMINI_API_KEY?.trim()) {
    try {
      return { result: await runGeminiAnalysis(request, localResult), analysisMode: "gemini" };
    } catch {
      // fall through
    }
  }

  return {
    result: localResult,
    analysisMode: "local",
    notice: "AI scoring is briefly at capacity, so the built-in analyzer scored this listing. Re-run in a minute for the AI-enhanced version.",
  };
}

export async function runGroqAnalysis(request: AnalyzeListingRequest, localResult: AnalyzeListingResult) {
  const config = getAiProviderConfig();

  if (!config.apiKey) {
    throw new Error("GROQ_API_KEY is required for analysis.");
  }

  const model = process.env.GROQ_MODEL || GROQ_DEFAULT_MODEL;

  if (/prompt-guard/i.test(model)) {
    throw new Error("GROQ_MODEL must be a chat model, not a prompt-guard classifier.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

  const response = await fetch(
    GROQ_API_URL,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${config.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        max_tokens: 1600,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: buildUserPrompt(request, localResult),
          },
        ],
      }),
      signal: controller.signal,
    },
  ).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    throw new Error(`Groq analysis failed with HTTP ${response.status}.`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("Groq did not return analysis text.");
  }

  return normalizeResult(extractJson(text));
}
