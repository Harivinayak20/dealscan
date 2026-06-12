"use client";

import { useState } from "react";
import { Gauge, ChevronRight } from "lucide-react";
import { calculateTCO } from "@/lib/tco-calculator";
import { formatCurrency } from "@/lib/financing-calculator";

export function TCOPanel({
  make,
  year,
  price,
  mileage,
  score,
  monthlyPayment,
}: {
  make: string | null;
  year: string | null;
  price: number | null;
  mileage: number | null;
  score: number;
  monthlyPayment: number;
}) {
  const [open, setOpen] = useState(true);
  if (!price) return null;

  const tco = calculateTCO(make, (year ? Number(year) : null), price, mileage, score, monthlyPayment);
  const maxMonthly = Math.max(...tco.segments.map((s) => s.monthly), 1);

  return (
    <details open={open} className="card-elevated group">
      <summary
        onClick={(e) => { e.preventDefault(); setOpen(!open); }}
        className="flex cursor-pointer items-center gap-3 px-5 py-4 text-lg font-black text-[var(--graphite)] transition hover:text-[var(--racing-green)]"
      >
        <Gauge className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
        5-Year Total Cost of Ownership
        <ChevronRight className={`ml-auto h-5 w-5 transition ${open ? "rotate-90" : ""}`} aria-hidden="true" />
      </summary>
      <div className="border-t border-[rgba(11,13,16,0.10)] px-5 py-4">
        <div className="grid gap-3">
          {tco.segments.map((seg) => {
            const pct = (seg.monthly / maxMonthly) * 100;
            return (
              <div key={seg.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[var(--graphite)]">{seg.label}</span>
                  <span className="font-black text-[var(--graphite)]">{formatCurrency(seg.monthly)}<span className="text-xs font-bold text-neutral-400">/mo</span></span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-neutral-100">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: seg.color }}
                  />
                </div>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">{seg.detail}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl bg-[var(--graphite)] p-4 text-center text-[var(--ivory)]">
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--champagne)]">True Monthly Cost</div>
          <div className="mt-1 text-3xl font-black">{formatCurrency(tco.totalMonthly)}<span className="text-sm font-bold text-[var(--silver)]">/mo</span></div>
          <div className="mt-1 text-sm text-[var(--silver)]">
            {formatCurrency(tco.totalYearly)}/yr · {formatCurrency(tco.total5Year)} over 5 years
          </div>
        </div>
      </div>
    </details>
  );
}
