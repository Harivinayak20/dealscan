import { BadgeDollarSign } from "lucide-react";
import type { AnalyzeListingResult } from "@/lib/analyzer-types";

type NegotiationCardProps = {
  result: AnalyzeListingResult;
};

function formatMoney(value: number | null) {
  if (value === null) {
    return "Unknown";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function NegotiationCard({ result }: NegotiationCardProps) {
  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-950 p-5 text-white shadow-sm">
      <h2 className="flex items-center gap-2 text-xl font-black">
        <BadgeDollarSign className="h-6 w-6" aria-hidden="true" />
        Suggested offer
      </h2>
      <div className="mt-3 text-3xl font-black">
        {formatMoney(result.suggestedOfferRange.low)} - {formatMoney(result.suggestedOfferRange.high)}
      </div>
      <p className="mt-2 text-base leading-7 text-emerald-50">{result.suggestedOfferRange.note}</p>
      <div className="mt-4 rounded-lg bg-white/10 p-4">
        <h3 className="text-base font-extrabold">Negotiation tip</h3>
        <p className="mt-1 text-base leading-7 text-emerald-50">{result.negotiationTip}</p>
      </div>
    </section>
  );
}
