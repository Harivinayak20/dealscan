"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { isWatched, toggleWatch } from "@/lib/watchlist";
import type { AnalyzeListingResult } from "@/lib/analyzer-types";
import { extractVin } from "@/lib/vin-decoder";

function listingKey(vehicleTitle: string, sourceText: string): string {
  const vin = extractVin(sourceText);
  if (vin) return `vin:${vin}`;
  const price = sourceText.match(/\$\s?([\d,]+)/)?.[1] ?? "";
  const normalized = `${vehicleTitle.toLowerCase().replace(/\s+/g, "-")}|${price}`;
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) - hash + normalized.charCodeAt(i)) | 0;
  }
  return `car:${Math.abs(hash).toString(36)}`;
}

export function WatchButton({
  result,
  vehicleTitle,
  sourceText,
  price,
}: {
  result: AnalyzeListingResult;
  vehicleTitle: string;
  sourceText: string;
  price: number | null;
}) {
  const id = listingKey(vehicleTitle, sourceText);
  const [watching, setWatching] = useState(() => isWatched(id));

  function handleToggle() {
    const now = toggleWatch(id, result, vehicleTitle, sourceText, price);
    setWatching(now);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`btn-secondary ${
        watching
          ? "!border-[rgba(196,90,74,0.40)] !bg-[rgba(196,90,74,0.10)] !text-[var(--danger)]"
          : ""
      }`}
    >
      <Heart className={`h-5 w-5 ${watching ? "fill-[var(--danger)]" : ""}`} aria-hidden="true" />
      {watching ? "Watching" : "Watch"}
    </button>
  );
}
