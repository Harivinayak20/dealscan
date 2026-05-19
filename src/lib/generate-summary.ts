import type { AnalyzeListingResult } from "@/lib/analyzer-types";

export function generateDealSummary(result: AnalyzeListingResult, sourceText: string): string {
  const parts: string[] = [];

  const hasCleanTitle = /clean title/i.test(sourceText);
  const isOneOwner = /\b(one owner|1 owner)\b/i.test(sourceText);
  const hasServiceRecords = /\b(service records?|maintenance records?)\b/i.test(sourceText);
  const hasAccidentFree = /\bno accidents?\b/i.test(sourceText);
  const hasNewTires = /\bnew tires?\b/i.test(sourceText);
  const hasNewBrakes = /\bnew brakes?\b/i.test(sourceText);
  const hasCarfax = /\bclean carfax\b/i.test(sourceText);
  const hasVin = /\b[A-HJ-NPR-Z0-9]{17}\b/.test(sourceText);
  const hasPrice = result.estimatedFairValueRange.low !== null && result.estimatedFairValueRange.high !== null;

  if (hasCleanTitle) parts.push("Clean title");
  if (isOneOwner) parts.push("One owner");
  if (hasServiceRecords) parts.push("Service records available");
  if (hasAccidentFree) parts.push("No accidents reported");
  if (hasCarfax) parts.push("Clean Carfax");
  if (hasNewTires) parts.push("New tires");
  if (hasNewBrakes) parts.push("New brakes");

  if (result.greenFlags.length > 0) {
    const count = result.greenFlags.length;
    if (parts.length > 0) {
      parts.push(`${count} green flag${count > 1 ? "s" : ""}`);
    }
  }

  if (result.redFlags.length > 0) {
    parts.push(`${result.redFlags.length} red flag${result.redFlags.length > 1 ? "s" : ""}`);
  } else if (!hasCleanTitle) {
    parts.push("Title status unclear");
  }

  if (hasPrice) {
    parts.push("Market price available");
  } else {
    parts.push("Price not provided");
  }

  if (hasVin) parts.push("VIN detected");

  const missingKey = result.missingInfo.filter(
    (m) => !m.startsWith("VIN") && !m.startsWith("Title photo") && !m.startsWith("Maintenance") && !m.startsWith("Recent inspection"),
  );
  if (missingKey.length > 0 && result.missingInfo.length > 3) {
    parts.push(`${missingKey.length} details missing`);
  }

  const confidenceText = result.confidence === "High" ? "High confidence" : result.confidence === "Medium" ? "Medium confidence" : "Low confidence";

  const joined = parts.slice(0, 5).join(" · ");

  return `${joined} — ${result.verdict} (${result.score}/100) · ${confidenceText}`;
}
