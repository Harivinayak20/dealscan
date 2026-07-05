import type { AnalyzeListingResult } from "@/lib/analyzer-types";

// A paste-ready block for forums, Reddit, or a message to the seller.
// Deliberately plain text so it survives any paste target, with the caveat
// baked in — a score that travels without context is a liability.

function money(value: number | null): string {
  return value === null ? "?" : `$${Math.round(value).toLocaleString("en-US")}`;
}

export function generateChallengeText(args: {
  result: AnalyzeListingResult;
  vehicleTitle: string;
  askingPrice: number | null;
}): string {
  const { result, vehicleTitle, askingPrice } = args;
  const lines: string[] = [];

  lines.push(`I ran this ${vehicleTitle} through DealScan (free deal analyzer):`);
  lines.push("");
  lines.push(`Deal score: ${result.score}/100 — ${result.verdict}`);
  if (askingPrice !== null) lines.push(`Asking price: ${money(askingPrice)}`);
  if (result.estimatedFairValueRange.low !== null && result.estimatedFairValueRange.high !== null) {
    lines.push(`Estimated fair range: ${money(result.estimatedFairValueRange.low)}-${money(result.estimatedFairValueRange.high)}`);
  }
  if (result.suggestedOfferRange.high !== null) {
    lines.push(`Suggested opening offer: around ${money(result.suggestedOfferRange.low)}-${money(result.suggestedOfferRange.high)}`);
  }

  if (result.redFlags.length) {
    lines.push("");
    lines.push("Red flags it found:");
    for (const flag of result.redFlags.slice(0, 4)) lines.push(`- ${flag}`);
  }
  if (result.missingInfo.length) {
    lines.push("");
    lines.push("Still missing from the listing:");
    for (const item of result.missingInfo.slice(0, 3)) lines.push(`- ${item}`);
  }

  lines.push("");
  lines.push("(Estimates from listing text only — verify title, history, and inspection. Scan any listing free at dealscan.dev)");

  return lines.join("\n");
}
