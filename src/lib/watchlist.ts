import type { AnalyzeListingResult } from "@/lib/analyzer-types";

export type WatchEntry = {
  id: string;
  result: AnalyzeListingResult;
  vehicleTitle: string;
  sourceText: string;
  price: number | null;
  addedAt: number;
  priceHistory: { date: number; price: number | null }[];
};

const WATCH_KEY = "dealscan_watchlist";

function loadRaw(): WatchEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WATCH_KEY);
    return raw ? JSON.parse(raw) as WatchEntry[] : [];
  } catch {
    return [];
  }
}

function saveRaw(entries: WatchEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WATCH_KEY, JSON.stringify(entries));
  } catch { /* noop */ }
}

export function getWatchlist(): WatchEntry[] {
  return loadRaw().sort((a, b) => b.addedAt - a.addedAt);
}

export function isWatched(id: string): boolean {
  return loadRaw().some((e) => e.id === id);
}

export function toggleWatch(
  id: string,
  result: AnalyzeListingResult,
  vehicleTitle: string,
  sourceText: string,
  price: number | null,
): boolean {
  const entries = loadRaw();
  const existing = entries.findIndex((e) => e.id === id);
  if (existing >= 0) {
    entries.splice(existing, 1);
    saveRaw(entries);
    return false;
  }
  const now = Date.now();
  const entry: WatchEntry = {
    id,
    result,
    vehicleTitle,
    sourceText,
    price,
    addedAt: now,
    priceHistory: [{ date: now, price }],
  };
  entries.unshift(entry);
  saveRaw(entries);
  return true;
}

export function removeWatch(id: string): void {
  const entries = loadRaw().filter((e) => e.id !== id);
  saveRaw(entries);
}

export function simulatePriceChange(id: string): WatchEntry | null {
  const entries = loadRaw();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx < 0) return null;
  const entry = entries[idx];
  const currentPrice = entry.price;
  if (currentPrice === null) return entry;
  const drop = Math.round(currentPrice * (0.02 + Math.random() * 0.06));
  const newPrice = currentPrice - drop;
  entry.price = newPrice;
  entry.priceHistory.push({ date: Date.now(), price: newPrice });
  entries[idx] = entry;
  saveRaw(entries);
  return entry;
}

export function getPriceTrend(entry: WatchEntry): "up" | "down" | "stable" {
  if (entry.priceHistory.length < 2) return "stable";
  const first = entry.priceHistory[0].price;
  const last = entry.priceHistory[entry.priceHistory.length - 1].price;
  if (first === null || last === null) return "stable";
  if (last < first) return "down";
  if (last > first) return "up";
  return "stable";
}
