"use client";

import { useMemo, useState } from "react";
import { calculateDepreciation, formatUsd } from "@/lib/depreciation-calculator";

export function DepreciationCalculator() {
  const [price, setPrice] = useState("30000");
  const [age, setAge] = useState("0");
  const [ownYears, setOwnYears] = useState("5");

  const priceNum = Number(price) || 0;
  const ageNum = Number(age) || 0;
  const ownNum = Number(ownYears) || 0;

  const result = useMemo(
    () => calculateDepreciation(priceNum, ageNum, ownNum),
    [priceNum, ageNum, ownNum],
  );

  const maxValue = result.rows[0]?.value || 1;
  const endAge = result.currentAge + result.ownershipYears;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
      {/* Inputs */}
      <div className="rounded-2xl border-2 border-[rgba(183,96,58,0.30)] bg-[var(--accent-2-soft)] p-5 shadow-[0_18px_44px_-26px_rgba(183,96,58,0.45)] sm:p-6">
        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-[var(--graphite)]">Purchase price</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="30000"
              className="input"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-[var(--graphite)]">
              Vehicle age now <span className="font-medium text-[var(--text-muted)]">(years, 0 = new)</span>
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={30}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="0"
              className="input"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-[var(--graphite)]">Years you will own it</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={30}
              value={ownYears}
              onChange={(e) => setOwnYears(e.target.value)}
              placeholder="5"
              className="input"
            />
          </label>

          <div className="grid gap-2 rounded-xl bg-[var(--paper)] p-4">
            <Stat label="Estimated value today" value={formatUsd(result.currentValue)} />
            <Stat label={`Estimated resale in ${endAge} yr`} value={formatUsd(result.resaleValue)} />
            <Stat label="Total depreciation" value={`−${formatUsd(result.totalDepreciation)}`} accent />
          </div>

          <p className="text-xs leading-5 text-[var(--text-muted)]">
            Curve used: about 20% in year one, 15%/yr for years two to five, then 10%/yr, with a 10% residual floor.
            Real depreciation varies by model, mileage, and market — this is a transparent estimate.
          </p>
        </div>
      </div>

      {/* Visualization + table */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--racing-green)]">Value by year</p>

        {/* CSS bar chart */}
        <div className="mt-4 grid gap-1.5">
          {result.rows.map((row) => {
            const pct = Math.max(2, Math.round((row.value / maxValue) * 100));
            const isNow = row.age === result.currentAge;
            const isResale = row.age === endAge && endAge !== result.currentAge;
            return (
              <div key={row.age} className="flex items-center gap-2 text-xs">
                <span className="w-14 shrink-0 tabular-nums text-[var(--text-muted)]">Yr {row.age}</span>
                <div className="h-6 flex-1 overflow-hidden rounded bg-[rgba(11,13,16,0.05)]">
                  <div
                    className="flex h-full items-center justify-end rounded pr-2 font-semibold text-white"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: isNow
                        ? "var(--racing-green)"
                        : isResale
                          ? "var(--accent-2, #b7603a)"
                          : "var(--champagne, #c9a86a)",
                    }}
                  >
                    <span className="tabular-nums">{formatUsd(row.value)}</span>
                  </div>
                </div>
                <span className="w-10 shrink-0 text-right tabular-nums text-[var(--text-muted)]">{row.pctOfOriginal}%</span>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[24rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-left text-xs uppercase tracking-wide text-[var(--text-muted)]">
                <th className="py-2 pr-3 font-semibold">Age</th>
                <th className="py-2 pr-3 font-semibold">Est. value</th>
                <th className="py-2 pr-3 font-semibold">Lost that year</th>
                <th className="py-2 font-semibold">% of original</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.age} className="border-b border-[var(--border-subtle)]">
                  <td className="py-2 pr-3 tabular-nums">Year {row.age}</td>
                  <td className="py-2 pr-3 font-semibold tabular-nums">{formatUsd(row.value)}</td>
                  <td className="py-2 pr-3 tabular-nums text-[var(--text-muted)]">
                    {row.annualLoss > 0 ? `−${formatUsd(row.annualLoss)}` : "—"}
                  </td>
                  <td className="py-2 tabular-nums">{row.pctOfOriginal}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[var(--text-body)]">{label}</span>
      <span className={`text-base font-black tabular-nums ${accent ? "text-[var(--accent-2,#b7603a)]" : "text-[var(--graphite)]"}`}>
        {value}
      </span>
    </div>
  );
}
