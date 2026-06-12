const STORAGE_KEY = "dealscan_saved_results";

export function loadSavedResults<T>(): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export function saveSavedResults<T>(results: T[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch { /* storage full or unavailable */ }
}
