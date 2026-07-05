"use client";

import { useState } from "react";
import { ClipboardCheck, MessageSquareQuote } from "lucide-react";
import type { AnalyzeListingResult } from "@/lib/analyzer-types";
import { generateChallengeText } from "@/lib/challenge-text";

// One-click copy of a paste-ready "here's what the analyzer found" block —
// built for Reddit threads, forum posts, and messages to the seller.
export function ChallengeShareButton({
  result,
  vehicleTitle,
  askingPrice,
}: {
  result: AnalyzeListingResult;
  vehicleTitle: string;
  askingPrice: number | null;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = generateChallengeText({ result, vehicleTitle, askingPrice });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavailable: ignore */
    }
  }

  return (
    <button type="button" onClick={copy} className="btn-secondary" title="Copy a paste-ready summary for a forum post or a message to the seller">
      {copied ? <ClipboardCheck className="h-5 w-5 text-[var(--racing-green)]" aria-hidden="true" /> : <MessageSquareQuote className="h-5 w-5" aria-hidden="true" />}
      {copied ? "Copied!" : "Challenge the price"}
    </button>
  );
}
