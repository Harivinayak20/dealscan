import type { AnalyzeListingResult } from "@/lib/analyzer-types";

const ROUGH_ESTIMATE_NOTE = "This is a rough estimate based on listing text, not a licensed market valuation.";

function roundMoney(value: number) {
  return Math.round(value / 50) * 50;
}

export function estimateRoughPricing({
  price,
  score,
  redFlags,
  greenFlags,
}: {
  price: number | null;
  score: number;
  redFlags: string[];
  greenFlags: string[];
}): Pick<AnalyzeListingResult, "estimatedFairValueRange" | "suggestedOfferRange"> {
  if (price === null) {
    return {
      estimatedFairValueRange: {
        low: null,
        high: null,
        note: `${ROUGH_ESTIMATE_NOTE} No estimate was created because the listing price is missing.`,
      },
      suggestedOfferRange: {
        low: null,
        high: null,
        note: "No suggested offer was created because the listing price is missing.",
      },
    };
  }

  const risky = score < 55 || redFlags.length >= 3;
  const strong = score >= 85 || greenFlags.length >= 4;
  const fairLow = risky ? 0.75 : strong ? 0.95 : 0.9;
  const fairHigh = risky ? 0.95 : strong ? 1.1 : 1.05;
  const offer: [number, number] | null =
    score >= 85
      ? [0.94, 0.98]
      : score >= 70
        ? [0.88, 0.95]
        : score >= 55
          ? [0.75, 0.88]
          : null;

  return {
    estimatedFairValueRange: {
      low: roundMoney(price * fairLow),
      high: roundMoney(price * fairHigh),
      note: ROUGH_ESTIMATE_NOTE,
    },
    suggestedOfferRange: offer
      ? {
          low: roundMoney(price * offer[0]),
          high: roundMoney(price * offer[1]),
          note: "Use this only as a starting point. Lower the offer if title, inspection, or maintenance proof is missing.",
        }
      : {
          low: null,
          high: null,
          note: "Do not make an offer unless the car is inspected and title risk is resolved.",
        },
  };
}
