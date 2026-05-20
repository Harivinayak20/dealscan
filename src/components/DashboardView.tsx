"use client";

import { useState } from "react";
import { ArrowLeft, Heart, Search, ShoppingCart, Trash2, TrendingDown, TrendingUp, Minus, Gauge } from "lucide-react";
import { getWatchlist, removeWatch, getPriceTrend } from "@/lib/watchlist";
import type { WatchEntry } from "@/lib/watchlist";
import { loadSavedResults } from "@/lib/local-storage";
import type { SavedResult } from "@/components/CompareView";
import { scoreTone } from "@/components/ScoreRing";

function TrendIcon({ entry }: { entry: WatchEntry }) {
  const trend = getPriceTrend(entry);
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-[var(--success)]" aria-hidden="true" />;
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-[var(--danger)]" aria-hidden="true" />;
  return <Minus className="h-4 w-4 text-neutral-400" aria-hidden="true" />;
}

export function DashboardView({ onBack }: { onBack: () => void }) {
  const [watchEntries, setWatchEntries] = useState<WatchEntry[]>(() => getWatchlist());
  const [scanHistory] = useState<SavedResult[]>(() => loadSavedResults<SavedResult>());
  const [now] = useState(() => Date.now());

  const avgScore = scanHistory.length > 0
    ? Math.round(scanHistory.reduce((s, r) => s + r.result.score, 0) / scanHistory.length)
    : 0;

  return (
    <section className="min-h-screen bg-[rgba(244,240,232,0.94)] px-5 py-8 text-[var(--graphite)] sm:px-7">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-bold text-neutral-700 transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
          <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[rgba(201,168,106,0.12)]">
                <Search className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
              </div>
              <div>
                <div className="text-2xl font-black">{scanHistory.length}</div>
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-neutral-500">Total Scans</div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[rgba(201,168,106,0.12)]">
                <Gauge className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
              </div>
              <div>
                <div className="text-2xl font-black">{avgScore}</div>
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-neutral-500">Avg Score</div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[rgba(201,168,106,0.12)]">
                <Heart className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
              </div>
              <div>
                <div className="text-2xl font-black">{watchEntries.length}</div>
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-neutral-500">Watching</div>
              </div>
            </div>
          </div>
        </div>

        {watchEntries.length > 0 && (
          <section className="mt-8">
            <h2 className="flex items-center gap-2 text-xl font-black">
              <Heart className="h-5 w-5 text-[var(--danger)]" aria-hidden="true" />
              Watchlist
            </h2>
            <div className="mt-4 grid gap-3">
              {watchEntries.map((entry) => {
                const tone = scoreTone(entry.result.score);
                const ToneIcon = tone.icon;
                return (
                  <div key={entry.id} className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ background: `${tone.ring}18` }}>
                        <ToneIcon className="h-6 w-6" style={{ color: tone.ring }} aria-hidden="true" />
                      </div>
                      <div>
                        <div className="font-black text-[var(--graphite)]">{entry.vehicleTitle}</div>
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <span className="font-bold" style={{ color: tone.ring }}>{entry.result.score}/100</span>
                          <span className="text-neutral-300">·</span>
                          <TrendIcon entry={entry} />
                          {entry.price !== null && <span className="font-bold">${entry.price.toLocaleString()}</span>}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { removeWatch(entry.id); setWatchEntries(getWatchlist()); }}
                      className="rounded-full p-2 text-neutral-400 transition hover:bg-red-50 hover:text-[var(--danger)]"
                      aria-label="Remove from watchlist"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {scanHistory.length > 0 && (
          <section className="mt-8">
            <h2 className="flex items-center gap-2 text-xl font-black">
              <ShoppingCart className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
              Recent Scans
            </h2>
            <div className="mt-4 grid gap-3">
              {scanHistory.slice(0, 10).map((saved) => {
                const tone = scoreTone(saved.result.score);
                const ToneIcon = tone.icon;
                const ago = Math.floor((now - saved.timestamp) / 3600000);
                return (
                  <div key={saved.id} className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ background: `${tone.ring}18` }}>
                        <ToneIcon className="h-6 w-6" style={{ color: tone.ring }} aria-hidden="true" />
                      </div>
                      <div>
                        <div className="font-black text-[var(--graphite)]">{saved.vehicleTitle}</div>
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <span className="font-bold" style={{ color: tone.ring }}>{saved.result.score}/100</span>
                          <span className="text-neutral-300">·</span>
                          <span>{ago < 1 ? "Just now" : ago < 24 ? `${ago}h ago` : `${Math.floor(ago / 24)}d ago`}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {watchEntries.length === 0 && scanHistory.length === 0 && (
          <div className="mt-20 text-center">
            <Heart className="mx-auto h-16 w-16 text-neutral-300" aria-hidden="true" />
            <h2 className="mt-6 text-2xl font-black text-neutral-400">No activity yet</h2>
            <p className="mt-3 text-base text-neutral-500">
              Scan a listing, watch a deal, and it&apos;ll show up here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
