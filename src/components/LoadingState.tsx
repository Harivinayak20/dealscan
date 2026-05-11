import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="grid justify-items-center gap-4 rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm" role="status">
      <Loader2 className="h-10 w-10 animate-spin text-emerald-700" aria-hidden="true" />
      <p className="max-w-sm text-xl font-black text-slate-950">
        Checking price, mileage, red flags, and negotiation room...
      </p>
    </div>
  );
}
