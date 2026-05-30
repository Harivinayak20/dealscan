"use client";

import { useState } from "react";
import { ArrowLeft, Heart, Search, ShoppingCart, Trash2, TrendingDown, TrendingUp, Minus, Gauge, GitCompareArrows, Download } from "lucide-react";
import { getWatchlist, removeWatch, getPriceTrend } from "@/lib/watchlist";
import type { WatchEntry } from "@/lib/watchlist";
import { loadSavedResults } from "@/lib/local-storage";
import type { SavedResult } from "@/components/CompareView";
import { loadSavedComparisons, deleteComparison, clearSavedComparisons } from "@/lib/comparison-storage";
import type { SavedComparison } from "@/lib/comparison-storage";
import { scoreTone } from "@/components/ScoreRing";
import { exportToCsv } from "@/lib/export-csv";

function TrendIcon({ entry }: { entry: WatchEntry }) {
  const trend = getPriceTrend(entry);
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-[var(--success)]" aria-hidden="true" />;
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-[var(--danger)]" aria-hidden="true" />;
  return <Minus className="h-4 w-4 text-neutral-400" aria-hidden="true" />;
}

function formatSavedDate(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

export function DashboardView({ onBack }: { onBack: () => void }) {
  const [watchEntries, setWatchEntries] = useState<WatchEntry[]>(() => getWatchlist());
  const [scanHistory] = useState<SavedResult[]>(() => loadSavedResults<SavedResult>());
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>(() => loadSavedComparisons());
  const [now] = useState(() => Date.now());

  const avgScore = scanHistory.length > 0
    ? Math.round(scanHistory.reduce((s, r) => s + r.result.score, 0) / scanHistory.length)
    : 0;

  function handleDeleteComparison(index: number) {
    deleteComparison(index);
    setSavedComparisons(loadSavedComparisons());
  }

  function clearComparisons() {
    clearSavedComparisons();
    setSavedComparisons([]);
  }

  function exportScans() {
    if (scanHistory.length === 0) return;
    const rows = scanHistory.map((s) => [
      s.vehicleTitle,
      String(s.result.score),
      s.result.verdict,
      s.result.confidence,
      s.sourceText.slice(0, 200),
      new Date(s.timestamp).toISOString(),
    ]);
    exportToCsv("dealscan-scans.csv", ["Vehicle", "Score", "Verdict", "Confidence", "Notes", "Date"], rows);
  }

  function exportComparisons() {
    if (savedComparisons.length === 0) return;
    const rows = savedComparisons.map((c) => [
      c.aTitle,
      c.bTitle,
      c.winnerLabel,
      String(c.scoreDelta),
      c.priceDelta,
      c.riskDelta,
      c.recommendedNextStep,
      c.savedAt,
    ]);
    exportToCsv("dealscan-comparisons.csv", ["Car A", "Car B", "Winner", "Score Delta", "Price", "Risk", "Next Step", "Saved At"], rows);
  }

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

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[rgba(201,168,106,0.12)]">
                <Search className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
              </div>
              <div>
                <div className="kpi-value">{scanHistory.length}</div>
                <div className="kpi-label">Total Scans</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[rgba(201,168,106,0.12)]">
                <Gauge className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
              </div>
              <div>
                <div className="kpi-value">{avgScore}</div>
                <div className="kpi-label">Avg Score</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[rgba(201,168,106,0.12)]">
                <Heart className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
              </div>
              <div>
                <div className="kpi-value">{watchEntries.length}</div>
                <div className="kpi-label">Watching</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[rgba(201,168,106,0.12)]">
                <GitCompareArrows className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
              </div>
              <div>
                <div className="kpi-value">{savedComparisons.length}</div>
                <div className="kpi-label">Comparisons</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {scanHistory.length > 0 && (
            <button
              type="button"
              onClick={exportScans}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Export Scans CSV
            </button>
          )}
          {savedComparisons.length > 0 && (
            <button
              type="button"
              onClick={exportComparisons}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Export Comparisons CSV
            </button>
          )}
        </div>

        {savedComparisons.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-black">
                <GitCompareArrows className="h-5 w-5 text-[var(--accent-2)]" aria-hidden="true" />
                Saved Comparisons
              </h2>
              <button
                type="button"
                onClick={clearComparisons}
                className="text-xs font-bold text-neutral-400 hover:text-[var(--danger)] transition"
              >
                Clear all
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {savedComparisons.map((comp, i) => (
                <div key={i} className="card flex items-center justify-between gap-4 !p-4">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--accent-2)] text-white">
                      <span className="text-xs font-black">VS</span>
                    </div>
                    <div>
                      <div className="font-black text-[var(--graphite)]">
                        {comp.aTitle} <span className="text-neutral-400">vs</span> {comp.bTitle}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <span className="font-bold text-[var(--accent-2)]">{comp.winnerLabel}</span>
                        <span className="text-neutral-300">&middot;</span>
                        <span className={comp.scoreDelta > 0 ? "text-green-700" : comp.scoreDelta < 0 ? "text-red-700" : "text-amber-600"}>
                          {comp.scoreDelta > 0 ? "+" : ""}{comp.scoreDelta} pts
                        </span>
                        <span className="text-neutral-300">&middot;</span>
                        <span>{comp.priceDelta}</span>
                        <span className="text-neutral-300">&middot;</span>
                        <span className="text-xs text-neutral-400">{formatSavedDate(comp.savedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteComparison(i)}
                    className="shrink-0 rounded-full p-2 text-neutral-400 transition hover:bg-red-50 hover:text-[var(--danger)]"
                    aria-label={`Delete comparison ${comp.aTitle} vs ${comp.bTitle}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

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
                  <div key={entry.id} className="card flex items-center justify-between gap-4 !p-4">
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ background: `${tone.ring}18` }}>
                        <ToneIcon className="h-6 w-6" style={{ color: tone.ring }} aria-hidden="true" />
                      </div>
                      <div>
                        <div className="font-black text-[var(--graphite)]">{entry.vehicleTitle}</div>
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <span className="font-bold" style={{ color: tone.ring }}>{entry.result.score}/100</span>
                          <span className="text-neutral-300">&middot;</span>
                          <TrendIcon entry={entry} />
                          {entry.price !== null && <span className="font-bold">${entry.price.toLocaleString()}</span>}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { removeWatch(entry.id); setWatchEntries(getWatchlist()); }}
                      className="btn-ghost !rounded-full !p-2 !min-h-0 text-neutral-400 hover:!bg-red-50 hover:!text-[var(--danger)]"
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
                  <div key={saved.id} className="card flex items-center justify-between gap-4 !p-4">
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ background: `${tone.ring}18` }}>
                        <ToneIcon className="h-6 w-6" style={{ color: tone.ring }} aria-hidden="true" />
                      </div>
                      <div>
                        <div className="font-black text-[var(--graphite)]">{saved.vehicleTitle}</div>
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <span className="font-bold" style={{ color: tone.ring }}>{saved.result.score}/100</span>
                          <span className="text-neutral-300">&middot;</span>
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

        {watchEntries.length === 0 && scanHistory.length === 0 && savedComparisons.length === 0 && (
          <div className="mt-20 text-center">
            <Heart className="mx-auto h-16 w-16 text-neutral-300" aria-hidden="true" />
            <h2 className="mt-6 text-2xl font-black text-neutral-400">No activity yet</h2>
            <p className="mt-3 text-base text-neutral-500">
              Analyze a listing or compare two cars and it&apos;ll show up here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
