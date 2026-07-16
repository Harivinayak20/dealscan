"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  calculateOtd,
  formatUsd,
  getOtdStateDefault,
  otdStateDefaults,
} from "@/lib/otd-calculator";

const STATES = otdStateDefaults;
const DEFAULT_STATE = "CA";

export function OtdCalculator({ initialState }: { initialState?: string } = {}) {
  const [price, setPrice] = useState("25000");
  const [stateAbbr, setStateAbbr] = useState(
    initialState && getOtdStateDefault(initialState) ? initialState : DEFAULT_STATE,
  );
  const [tradeIn, setTradeIn] = useState("");
  const [docFeeOverride, setDocFeeOverride] = useState("");
  const [localTaxRate, setLocalTaxRate] = useState("");

  const stateDefault = getOtdStateDefault(stateAbbr) ?? STATES[0];

  const priceNum = Number(price) || 0;
  const tradeInNum = Number(tradeIn) || 0;
  const docFee = docFeeOverride.trim() === "" ? stateDefault.docFee : Number(docFeeOverride) || 0;
  const localRate = localTaxRate.trim() === "" ? 0 : Number(localTaxRate) || 0;
  const totalRate = stateDefault.salesTaxRate + localRate;

  const breakdown = useMemo(
    () =>
      calculateOtd({
        vehiclePrice: priceNum,
        tradeIn: tradeInNum,
        salesTaxRate: totalRate,
        docFee,
        titleFee: stateDefault.titleFee,
        registrationFee: stateDefault.registrationFee,
      }),
    [priceNum, tradeInNum, totalRate, docFee, stateDefault],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      {/* Inputs */}
      <div className="rounded-2xl border-2 border-[rgba(183,96,58,0.30)] bg-[var(--accent-2-soft)] p-5 shadow-[0_18px_44px_-26px_rgba(183,96,58,0.45)] sm:p-6">
        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-[var(--graphite)]">Vehicle price</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="25000"
              className="input"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-[var(--graphite)]">State</span>
            <select value={stateAbbr} onChange={(e) => setStateAbbr(e.target.value)} className="input">
              {STATES.map((s) => (
                <option key={s.abbr} value={s.abbr}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-[var(--graphite)]">
              Trade-in value <span className="font-medium text-[var(--text-muted)]">(optional)</span>
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={tradeIn}
              onChange={(e) => setTradeIn(e.target.value)}
              placeholder="0"
              className="input"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-sm font-bold text-[var(--graphite)]">
                Doc fee <span className="font-medium text-[var(--text-muted)]">(override)</span>
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={docFeeOverride}
                onChange={(e) => setDocFeeOverride(e.target.value)}
                placeholder={String(stateDefault.docFee)}
                className="input"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-bold text-[var(--graphite)]">
                Local tax % <span className="font-medium text-[var(--text-muted)]">(optional)</span>
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={0.1}
                value={localTaxRate}
                onChange={(e) => setLocalTaxRate(e.target.value)}
                placeholder="0"
                className="input"
              />
            </label>
          </div>

          <p className="text-xs leading-5 text-[var(--text-muted)]">
            Defaults for {stateDefault.name}: {stateDefault.salesTaxRate}% state sales tax, {formatUsd(stateDefault.docFee)} doc
            fee, {formatUsd(stateDefault.titleFee)} title, {formatUsd(stateDefault.registrationFee)} registration. These are
            estimates from our{" "}
            <Link href="/fees" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
              state dealer-fee data
            </Link>
            — verify with your DMV.
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--racing-green)]">Out-the-door price</p>
        <p className="mt-1 text-4xl font-black tracking-tight text-[var(--graphite)]">{formatUsd(breakdown.total)}</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Total sales tax applied: {totalRate}% {localRate > 0 ? `(${stateDefault.salesTaxRate}% state + ${localRate}% local)` : ""}
        </p>

        <dl className="mt-6 divide-y divide-[var(--border-subtle)]">
          {breakdown.lineItems.map((li) => (
            <div key={li.label} className="flex items-center justify-between py-2.5 text-[15px]">
              <dt className="text-[var(--text-body)]">{li.label}</dt>
              <dd className={`font-semibold tabular-nums ${li.amount < 0 ? "text-[var(--racing-green)]" : "text-[var(--graphite)]"}`}>
                {li.amount < 0 ? `−${formatUsd(Math.abs(li.amount))}` : formatUsd(li.amount)}
              </dd>
            </div>
          ))}
          <div className="flex items-center justify-between py-3 text-lg">
            <dt className="font-black text-[var(--graphite)]">Out-the-door total</dt>
            <dd className="font-black tabular-nums text-[var(--graphite)]">{formatUsd(breakdown.total)}</dd>
          </div>
        </dl>

        <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">
          Taxes and fees vary by county and dealer. This is an estimate to sanity-check a quote, not a binding figure.
          Registration is often value- or weight-based, so treat it as a ballpark.
        </p>
      </div>
    </div>
  );
}
