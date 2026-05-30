import assert from "node:assert/strict";
import test from "node:test";
import {
  clearSavedComparisons,
  deleteComparison,
  isDuplicateComparison,
  loadSavedComparisons,
  saveSavedComparisons,
  type SavedComparison,
} from "../src/lib/comparison-storage.ts";

const store = new Map<string, string>();

Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
  },
});

Object.defineProperty(globalThis, "window", {
  value: { localStorage: globalThis.localStorage },
});

function sampleComparison(overrides?: Partial<SavedComparison>): SavedComparison {
  return {
    listingA: null,
    listingB: null,
    winner: "inconclusive",
    winnerLabel: "No data",
    winnerReason: "Both listings could not be analyzed.",
    priceDelta: "N/A",
    scoreDelta: 0,
    riskDelta: "N/A",
    missingInfoComparison: "Both sides are missing data.",
    recommendedNextStep: "Add details for at least one listing and try again.",
    aTitle: "Car A",
    bTitle: "Car B",
    savedAt: "2026-05-28T00:00:00.000Z",
    ...overrides,
  };
}

test("loadSavedComparisons returns empty array when nothing saved", () => {
  clearSavedComparisons();
  assert.deepEqual(loadSavedComparisons(), []);
});

test("saveSavedComparisons persists and returns true", () => {
  clearSavedComparisons();
  const comparisons = [sampleComparison()];
  assert.equal(saveSavedComparisons(comparisons), true);
  assert.deepEqual(loadSavedComparisons(), comparisons);
});

test("clearSavedComparisons removes all data", () => {
  saveSavedComparisons([sampleComparison()]);
  clearSavedComparisons();
  assert.deepEqual(loadSavedComparisons(), []);
});

test("deleteComparison removes item at given index", () => {
  const a = sampleComparison({ aTitle: "First", bTitle: "Second", savedAt: "2026-05-01" });
  const b = sampleComparison({ aTitle: "Third", bTitle: "Fourth", savedAt: "2026-05-02" });
  const c = sampleComparison({ aTitle: "Fifth", bTitle: "Sixth", savedAt: "2026-05-03" });
  saveSavedComparisons([a, b, c]);

  const removed = deleteComparison(1);
  assert.equal(removed, true);
  const remaining = loadSavedComparisons();
  assert.equal(remaining.length, 2);
  assert.equal(remaining[0].aTitle, "First");
  assert.equal(remaining[1].aTitle, "Fifth");
});

test("deleteComparison returns false for invalid index", () => {
  saveSavedComparisons([sampleComparison()]);
  assert.equal(deleteComparison(-1), false);
  assert.equal(deleteComparison(5), false);
  assert.equal(loadSavedComparisons().length, 1);
});

test("isDuplicateComparison returns true for same title+score+winner", () => {
  const existing = [
    sampleComparison({ aTitle: "Civic", bTitle: "Corolla", scoreDelta: 10, winner: "A" }),
  ];
  const candidate = sampleComparison({ aTitle: "Civic", bTitle: "Corolla", scoreDelta: 10, winner: "A" });
  assert.equal(isDuplicateComparison(existing, candidate), true);
});

test("isDuplicateComparison returns false for different data", () => {
  const existing = [
    sampleComparison({ aTitle: "Civic", bTitle: "Corolla", scoreDelta: 10, winner: "A" }),
  ];
  const candidate = sampleComparison({ aTitle: "Civic", bTitle: "Corolla", scoreDelta: 5, winner: "B" });
  assert.equal(isDuplicateComparison(existing, candidate), false);
});

test("isDuplicateComparison returns false for empty list", () => {
  const candidate = sampleComparison();
  assert.equal(isDuplicateComparison([], candidate), false);
});
