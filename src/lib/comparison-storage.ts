import type { ComparisonResult } from "@/lib/compare-listings";

const STORAGE_KEY = "dealscan_saved_comparisons";

export type SavedComparison = ComparisonResult & {
  savedAt: string;
};

export function loadSavedComparisons(): SavedComparison[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedComparison[];
  } catch {
    return [];
  }
}

export function saveSavedComparisons(comparisons: SavedComparison[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comparisons));
    return true;
  } catch { /* storage full or unavailable */ }
  return false;
}

export function deleteComparison(index: number): boolean {
  const all = loadSavedComparisons();
  if (index < 0 || index >= all.length) return false;
  all.splice(index, 1);
  return saveSavedComparisons(all);
}

export function isDuplicateComparison(existing: SavedComparison[], candidate: ComparisonResult): boolean {
  return existing.some(
    (c) =>
      c.aTitle === candidate.aTitle &&
      c.bTitle === candidate.bTitle &&
      c.scoreDelta === candidate.scoreDelta &&
      c.winner === candidate.winner,
  );
}

export function clearSavedComparisons(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* noop */ }
}
