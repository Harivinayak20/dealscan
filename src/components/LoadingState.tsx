import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div
      className="grid justify-items-center gap-4 rounded-2xl border border-[rgba(201,168,106,0.18)] bg-[rgba(244,240,232,0.96)] p-8 text-center shadow-[0_24px_70px_-46px_rgba(11,13,16,0.80)]"
      role="status"
    >
      <Loader2 className="h-10 w-10 animate-spin text-[var(--champagne)]" aria-hidden="true" />
      <p className="max-w-sm text-xl font-black text-[var(--graphite)]">
        Checking price, mileage, red flags, and negotiation room...
      </p>
    </div>
  );
}
