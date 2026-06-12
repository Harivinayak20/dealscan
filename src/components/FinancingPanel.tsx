"use client";

import { useState } from "react";
import { Calculator, ChevronRight } from "lucide-react";
import { calculateFinancing, formatCurrency } from "@/lib/financing-calculator";
import { partnerLinks } from "@/lib/integration-links";

export function FinancingPanel({ price }: { price: number | null }) {
  const [down, setDown] = useState(0);
  const [trade, setTrade] = useState(0);
  const [apr, setApr] = useState(6.5);
  const [open, setOpen] = useState(true);

  if (!price) return null;

  const fin = calculateFinancing(price, down, trade, apr);
  const plan = fin.plans[fin.suggestedPlan];

  return (
    <details open={open} className="card-elevated group">
      <summary
        onClick={(e) => { e.preventDefault(); setOpen(!open); }}
        className="flex cursor-pointer items-center gap-3 px-5 py-4 text-lg font-black text-[var(--graphite)] transition hover:text-[var(--racing-green)]"
      >
        <Calculator className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
        What will this car actually cost you?
        <ChevronRight className={`ml-auto h-5 w-5 transition ${open ? "rotate-90" : ""}`} aria-hidden="true" />
      </summary>
      <div className="border-t border-[rgba(11,13,16,0.10)] px-5 py-4">
        <div className="grid gap-4 sm:grid-cols-4">
          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Down Payment</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">$</span>
              <input
                type="number"
                min={0}
                max={price}
                value={down || ""}
                onChange={(e) => setDown(Math.max(0, Math.min(price, Number(e.target.value) || 0)))}
                className="input !rounded-xl !py-2.5 !pl-8 !pr-3 !text-sm !font-bold"
              />
            </div>
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Trade-In</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">$</span>
              <input
                type="number"
                min={0}
                value={trade || ""}
                onChange={(e) => setTrade(Math.max(0, Number(e.target.value) || 0))}
                className="input !rounded-xl !py-2.5 !pl-8 !pr-3 !text-sm !font-bold"
              />
            </div>
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">APR</span>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={30}
                step={0.1}
                value={apr}
                onChange={(e) => setApr(Math.max(0, Math.min(30, Number(e.target.value) || 0)))}
                className="input !rounded-xl !py-2.5 !px-3 !pr-8 !text-sm !font-bold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">%</span>
            </div>
          </label>
          <div className="grid gap-1">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Loan Amount</span>
            <div className="flex h-[42px] items-center rounded-xl bg-[rgba(201,168,106,0.10)] px-3 text-lg font-black text-[var(--graphite)]">
              {formatCurrency(Math.max(0, price - down - trade))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {fin.plans.map((p) => (
            <div
              key={p.termMonths}
              className={`rounded-xl border-2 p-4 transition ${
                p.termMonths === plan.termMonths
                  ? "border-[var(--champagne)] bg-[rgba(201,168,106,0.08)]"
                  : "border-[var(--border-subtle)] bg-[var(--paper)]"
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">{p.termMonths} months</div>
              <div className="mt-1 text-2xl font-black text-[var(--graphite)]">{formatCurrency(p.monthlyPayment)}</div>
              <div className="mt-1 text-xs text-[var(--text-muted)]">
                <span className="font-bold text-[var(--text-body)]">{formatCurrency(p.totalInterest)}</span> interest
              </div>
              <div className="text-xs text-neutral-400">Total: {formatCurrency(p.totalCost)}</div>
            </div>
          ))}
        </div>

        <a
          href={partnerLinks.payments}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[var(--champagne)] transition hover:text-[var(--racing-green)]"
        >
          Compare real loan rates on Bankrate ↗
        </a>
      </div>
    </details>
  );
}
