import type { AnalyzeListingRequest, AnalyzeListingResult } from "@/lib/analyzer-types";

export type AiProvider = "none" | "anthropic" | "gemini" | "groq" | "openrouter";

type ProviderConfig = {
  provider: AiProvider;
  apiKey: string | null;
  enabled: boolean;
};

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";

const systemPrompt =
  "You are a skeptical but fair used car expert. Analyze only information provided by the user. Do not claim certainty. If fair market value is estimated, clearly label it as an estimate. Penalize vague listings, missing title info, missing VIN, missing mileage, suspicious wording, and unclear seller claims. Reward clean title, one owner, service records, detailed maintenance, reasonable mileage, and transparent seller language. Return only valid JSON.";

function parseProvider(value: string | undefined): AiProvider {
  if (value === "anthropic" || value === "gemini" || value === "groq" || value === "openrouter") {
    return value;
  }

  return "none";
}

function keyForProvider(provider: AiProvider) {
  if (provider === "anthropic") return process.env.ANTHROPIC_API_KEY || null;
  if (provider === "gemini") return process.env.GEMINI_API_KEY || null;
  if (provider === "groq") return process.env.GROQ_API_KEY || null;
  if (provider === "openrouter") return process.env.OPENROUTER_API_KEY || null;

  return null;
}

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
    throw new Error("AI provider did not return JSON.");
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
    categories: result.categories.map((category) => ({
      ...category,
      score: Math.max(0, Math.min(100, Math.round(category.score))),
    })),
  };
}

function buildUserPrompt(request: AnalyzeListingRequest, localResult: AnalyzeListingResult) {
  return `Analyze this used car listing and return JSON only.

Use the local heuristic result as a baseline, not as a guarantee.

Input type: ${request.inputType}

Listing text:
${request.listingText}

Manual details:
${JSON.stringify(request.manualDetails ?? {}, null, 2)}

Local heuristic result:
${JSON.stringify(localResult, null, 2)}

Return the same JSON schema as the local result. Use simple language. Do not provide legal, financing, insurance, or tax advice.`;
}

async function runAnthropic(request: AnalyzeListingRequest, localResult: AnalyzeListingResult, apiKey: string) {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1600,
      temperature: 0.2,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(request, localResult),
        },
      ],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const text = data.content?.find((item) => item.type === "text")?.text;

  return text ? normalizeResult(extractJson(text)) : null;
}

export function getAiProviderConfig(): ProviderConfig {
  const provider = parseProvider(process.env.AI_PROVIDER);
  const apiKey = keyForProvider(provider);

  return {
    provider,
    apiKey,
    enabled: provider !== "none" && Boolean(apiKey),
  };
}

export async function runOptionalAiAnalysis(request: AnalyzeListingRequest, localResult: AnalyzeListingResult) {
  const config = getAiProviderConfig();

  if (!config.enabled || !config.apiKey) {
    return null;
  }

  try {
    if (config.provider === "anthropic") {
      return await runAnthropic(request, localResult, config.apiKey);
    }

    // TODO: Add Gemini, Groq, and OpenRouter calls here. Until then, selected providers fall back to local analysis.
    return null;
  } catch {
    return null;
  }
}
