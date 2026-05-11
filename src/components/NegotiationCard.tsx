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
    <section className="rounded-2xl border border-[rgba(201,168,106,0.24)] bg-[var(--racing-green)] p-5 text-[var(--ivory)] shadow-[0_24px_70px_-46px_rgba(11,13,16,0.80)]">
      <h2 className="flex items-center gap-2 text-xl font-black">
        <BadgeDollarSign className="h-6 w-6 text-[var(--champagne)]" aria-hidden="true" />
        Suggested offer
      </h2>
      <div className="mt-3 text-3xl font-black">
        {formatMoney(result.suggestedOfferRange.low)} - {formatMoney(result.suggestedOfferRange.high)}
      </div>
      <p className="mt-2 text-base leading-7 text-[rgba(244,240,232,0.82)]">{result.suggestedOfferRange.note}</p>
      <div className="mt-4 rounded-xl border border-white/10 bg-white/10 p-4">
        <h3 className="text-base font-extrabold">Negotiation tip</h3>
        <p className="mt-1 text-base leading-7 text-[rgba(244,240,232,0.82)]">{result.negotiationTip}</p>
      </div>
    </section>
  );
}
