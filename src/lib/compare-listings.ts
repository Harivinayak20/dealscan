import type { AnalyzeListingResult } from "@/lib/analyzer-types";

export type ListingDraftState = "empty" | "url" | "notes" | "manual" | "extracting" | "error" | "done";

export type ListingDraft = {
  label: "A" | "B";
  state: ListingDraftState;
  url: string;
  notes: string;
  manual: {
    year: string;
    make: string;
    model: string;
    mileage: string;
    price: string;
    titleStatus: string;
    sellerNotes: string;
  };
  error: string;
  result: AnalyzeListingResult | null;
  vehicleTitle: string;
};

export type CompareWinner = "A" | "B" | "tie" | "inconclusive";

export type ComparisonResult = {
  listingA: AnalyzeListingResult | null;
  listingB: AnalyzeListingResult | null;
  winner: CompareWinner;
  winnerLabel: string;
  winnerReason: string;
  priceDelta: string;
  scoreDelta: number;
  riskDelta: string;
  missingInfoComparison: string;
  recommendedNextStep: string;
  aTitle: string;
  bTitle: string;
};

export function createEmptyDraft(label: "A" | "B"): ListingDraft {
  return {
    label,
    state: "empty",
    url: "",
    notes: "",
    manual: { year: "", make: "", model: "", mileage: "", price: "", titleStatus: "", sellerNotes: "" },
    error: "",
    result: null,
    vehicleTitle: "",
  };
}

export function parseMultipleUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s,;]+/g;
  const matches = text.match(urlRegex);
  if (!matches) return [];
  return matches.slice(0, 2);
}

export function draftToRequestText(draft: ListingDraft): string {
  switch (draft.state) {
    case "url":
      return draft.notes;
    case "notes":
      return draft.notes;
    case "manual": {
      const parts = [
        draft.manual.year,
        draft.manual.make,
        draft.manual.model,
        draft.manual.mileage,
        draft.manual.price,
        draft.manual.titleStatus,
        draft.manual.sellerNotes,
      ].filter(Boolean);
      return parts.join(", ");
    }
    default:
      return "";
  }
}

export function draftVehicleTitle(draft: ListingDraft): string {
  if (draft.vehicleTitle) return draft.vehicleTitle;
  if (draft.state === "manual") {
    return [draft.manual.year, draft.manual.make, draft.manual.model].filter(Boolean).join(" ") || `Car ${draft.label}`;
  }
  const match = draftToRequestText(draft).match(/\b(19|20)\d{2}\s+[A-Za-z]+\s+[A-Za-z0-9-]+/);
  return match?.[0] || `Car ${draft.label}`;
}

export function computeComparison(a: AnalyzeListingResult | null, b: AnalyzeListingResult | null): ComparisonResult {
  if (!a && !b) {
    return {
      listingA: null, listingB: null,
      winner: "inconclusive", winnerLabel: "No data", winnerReason: "Both listings could not be analyzed.",
      priceDelta: "N/A", scoreDelta: 0, riskDelta: "N/A",
      missingInfoComparison: "Both sides are missing data.",
      recommendedNextStep: "Add details for at least one listing and try again.",
      aTitle: "Car A", bTitle: "Car B",
    };
  }

  if (!a) {
    return {
      listingA: null, listingB: b,
      winner: "B", winnerLabel: "Only B has data", winnerReason: "Car A could not be analyzed.",
      priceDelta: "N/A", scoreDelta: 0, riskDelta: "N/A",
      missingInfoComparison: "Car A has no data.",
      recommendedNextStep: "Fix Car A and re-run the comparison.",
      aTitle: "Car A", bTitle: draftVehicleTitle({ label: "B", state: "done", result: b } as ListingDraft),
    };
  }

  if (!b) {
    return {
      listingA: a, listingB: null,
      winner: "A", winnerLabel: "Only A has data", winnerReason: "Car B could not be analyzed.",
      priceDelta: "N/A", scoreDelta: 0, riskDelta: "N/A",
      missingInfoComparison: "Car B has no data.",
      recommendedNextStep: "Fix Car B and re-run the comparison.",
      aTitle: draftVehicleTitle({ label: "A", state: "done", result: a } as ListingDraft),
      bTitle: "Car B",
    };
  }

  const scoreDelta = a.score - b.score;
  const riskDeltaText = () => {
    const aRisk = a.redFlags.length;
    const bRisk = b.redFlags.length;
    if (aRisk < bRisk) return `Car A has fewer risks (${aRisk} vs ${bRisk})`;
    if (bRisk < aRisk) return `Car B has fewer risks (${bRisk} vs ${aRisk})`;
    return "Both have the same number of risk flags.";
  };

  const winner = (): CompareWinner => {
    const diff = Math.abs(scoreDelta);
    if (diff <= 3) return "tie";
    return scoreDelta > 0 ? "A" : "B";
  };

  const w = winner();

  const winnerLabel = w === "tie" ? "Too close to call" : w === "A" ? "Better deal" : "Better deal";
  const winnerReason = (() => {
    if (w === "tie") {
      if (a.verdict === b.verdict) return `Both are "${a.verdict}" within 3 points.`;
      return `${a.verdict} vs ${b.verdict} — the scores are close. Check the differences below.`;
    }
    const leader = w === "A" ? "Car A" : "Car B";
    const parts: string[] = [];
    if (Math.abs(scoreDelta) >= 15) parts.push(`${leader} scores ${Math.abs(scoreDelta)} points higher.`);
    else if (Math.abs(scoreDelta) >= 8) parts.push(`${leader} scores ${Math.abs(scoreDelta)} points higher overall.`);
    else parts.push(`${leader} edges ahead by ${Math.abs(scoreDelta)} points.`);

    const aGreen = a.greenFlags.length;
    const bGreen = b.greenFlags.length;
    if (w === "A" && aGreen > bGreen) parts.push("More positive signals.");
    if (w === "B" && bGreen > aGreen) parts.push("More positive signals.");

    return parts.join(" ");
  })();

  const priceDeltaText = (() => {
    const aPrice = extractPrice(a);
    const bPrice = extractPrice(b);
    if (aPrice !== null && bPrice !== null) {
      const diff = Math.abs(aPrice - bPrice);
      const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(diff);
      if (aPrice < bPrice) return `Car A is ${formatted} less`;
      if (bPrice < aPrice) return `Car B is ${formatted} less`;
      return "Both are priced the same";
    }
    if (aPrice !== null) return "Only Car A has a price";
    if (bPrice !== null) return "Only Car B has a price";
    return "Neither has a price listed";
  })();

  const missingInfoComparison = (() => {
    const aMissing = a.missingInfo.length;
    const bMissing = b.missingInfo.length;
    if (aMissing === 0 && bMissing === 0) return "Both listings have complete data.";
    if (aMissing === bMissing) return `Both are missing ${aMissing} pieces of information.`;
    if (aMissing < bMissing) return `Car A has fewer gaps (${aMissing} vs ${bMissing}).`;
    return `Car B has fewer gaps (${bMissing} vs ${aMissing}).`;
  })();

  const nextStep = (() => {
    if (a.missingInfo.length > 3 && b.missingInfo.length > 3) {
      return "Both listings are missing key details. Request VIN, title photo, and maintenance records before deciding.";
    }
    if (w === "tie") {
      return "The scores are close. Compare the missing info, risk flags, and fair price range to decide which car to inspect first.";
    }
    return "Focus on the winning car. Verify its title, VIN, and request a pre-purchase inspection before making an offer.";
  })();

  return {
    listingA: a,
    listingB: b,
    winner: w,
    winnerLabel,
    winnerReason,
    priceDelta: priceDeltaText,
    scoreDelta,
    riskDelta: riskDeltaText(),
    missingInfoComparison,
    recommendedNextStep: nextStep,
    aTitle: draftVehicleTitle({ label: "A", state: "done", result: a } as ListingDraft),
    bTitle: draftVehicleTitle({ label: "B", state: "done", result: b } as ListingDraft),
  };
}

function extractPrice(result: AnalyzeListingResult): number | null {
  return result.estimatedFairValueRange.low ?? null;
}
