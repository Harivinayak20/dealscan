"use client";

import { useState } from "react";
import { FileSearch, SearchCheck } from "lucide-react";
import type { ListingDraft } from "@/lib/compare-listings";
import { createEmptyDraft, parseMultipleUrls } from "@/lib/compare-listings";
import { parseSafeHttpUrl } from "@/lib/url-safety";
import { ExtractionCache } from "@/lib/extraction-cache";

type CompareInputPanelProps = {
  onCompare: (draftA: ListingDraft, draftB: ListingDraft) => void;
  isBusy: boolean;
};

function DraftColumn({
  draft,
  index,
  onChange,
}: {
  draft: ListingDraft;
  index: number;
  onChange: (draft: ListingDraft) => void;
}) {
  const label = index === 0 ? "A" : "B";
  const [isExtracting, setIsExtracting] = useState(false);

  function set<K extends keyof ListingDraft>(key: K, value: ListingDraft[K]) {
    onChange({ ...draft, error: "", [key]: value });
  }

  function setManualField(field: keyof ListingDraft["manual"], value: string) {
    onChange({ ...draft, manual: { ...draft.manual, [field]: value } });
  }

  function switchMode(mode: "url" | "notes" | "manual") {
    onChange({ ...draft, state: mode, error: "" });
  }

  async function handleExtractUrl() {
    const url = draft.url.trim();
    if (!url) return;
    try {
      parseSafeHttpUrl(url);
    } catch {
      set("error", "Enter a public listing link (local and private URLs are not supported).");
      return;
    }

    const cached = ExtractionCache.get(url);
    if (cached) {
      onChange({
        ...draft,
        state: "notes",
        notes: cached.text,
        vehicleTitle: cached.title,
        error: "",
      });
      return;
    }

    setIsExtracting(true);
    set("error", "");
    try {
      const res = await fetch("/api/extract-listing-url", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json() as { listing?: { title?: string; text?: string }; error?: string };
       if (!res.ok || data.error) {
         set("error", data.error || "Could not extract listing details.");
         return;
       }
       const listingText = data.listing?.text ?? "";
       const listingTitle = data.listing?.title ?? "";
       if (listingText) {
         ExtractionCache.set(url, { title: listingTitle || "Extracted listing", text: listingText });
       }
       onChange({
         ...draft,
         state: "notes",
         notes: listingText,
         vehicleTitle: listingTitle,
         error: "",
       });
    } catch {
      set("error", "Network error. Please paste seller notes manually.");
    } finally {
      setIsExtracting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--accent-2)] text-xs font-black text-white">
            {label}
          </span>
          <span className="text-sm font-black text-[var(--graphite)]">Car {label}</span>
        </div>
        <div className="flex gap-1 rounded-lg border border-[rgba(255,255,255,0.10)] bg-[var(--paper)] p-0.5">
          {(["url", "notes", "manual"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => switchMode(mode)}
              className={`rounded-md px-2.5 py-1.5 text-[10px] font-bold uppercase transition ${
                draft.state === mode
                  ? "bg-[var(--accent-2)] text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--accent-2)]"
              }`}
            >
              {mode === "url" ? "Link" : mode === "notes" ? "Notes" : "Manual"}
            </button>
          ))}
        </div>
      </div>

      {draft.state === "url" ? (
        <div className="grid gap-2">
          <input
            value={draft.url}
            onChange={(e) => set("url", e.target.value)}
            placeholder="Paste a listing link..."
            className="input"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExtractUrl}
              disabled={!draft.url.trim() || isExtracting}
              className="btn-outline !rounded-xl !border-[rgba(47,192,140,0.32)] !px-3 !py-1.5 !text-xs !text-[var(--racing-green)] hover:!bg-[rgba(47,192,140,0.08)] disabled:opacity-50"
            >
              <FileSearch className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
              {isExtracting ? "Extracting..." : "Get details"}
            </button>
            <button
              type="button"
              onClick={() => {
                onChange({ ...draft, state: "notes", notes: "", error: "" });
              }}
              className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--accent-2)] transition"
            >
              Paste notes instead
            </button>
          </div>
        </div>
      ) : draft.state === "notes" ? (
        <div className="grid gap-2">
          <textarea
            value={draft.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Paste the seller description, price, mileage, and details..."
            className="textarea min-h-24"
          />
          {draft.url ? (
            <button
              type="button"
              onClick={() => set("state", "url")}
              className="self-start text-xs font-bold text-[var(--text-muted)] hover:text-[var(--accent-2)] transition"
            >
              Back to link
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {(["year", "make", "model", "mileage", "price", "titleStatus"] as const).map((field) => (
            <input
              key={field}
              value={draft.manual[field]}
              onChange={(e) => setManualField(field, e.target.value)}
              placeholder={field === "titleStatus" ? "Title (clean/salvage)" : field.charAt(0).toUpperCase() + field.slice(1)}
              className="input"
            />
          ))}
          <textarea
            value={draft.manual.sellerNotes}
            onChange={(e) => setManualField("sellerNotes", e.target.value)}
            placeholder="Seller notes..."
            className="textarea col-span-2 min-h-16"
          />
        </div>
      )}

      {draft.error ? (
        <p className="text-xs font-bold text-[var(--danger)]">{draft.error}</p>
      ) : null}
    </div>
  );
}

export function CompareInputPanel({ onCompare, isBusy }: CompareInputPanelProps) {
  const [draftA, setDraftA] = useState<ListingDraft>({ ...createEmptyDraft("A"), state: "url" });
  const [draftB, setDraftB] = useState<ListingDraft>({ ...createEmptyDraft("B"), state: "url" });

  function canCompare(): boolean {
    const aReady = (draftA.state === "url" && !!draftA.url.trim()) ||
      (draftA.state === "notes" && draftA.notes.trim().length > 10) ||
      (draftA.state === "manual" && !!draftA.manual.make && !!draftA.manual.model);
    const bReady = (draftB.state === "url" && !!draftB.url.trim()) ||
      (draftB.state === "notes" && draftB.notes.trim().length > 10) ||
      (draftB.state === "manual" && !!draftB.manual.make && !!draftB.manual.model);
    return aReady && bReady;
  }

  function handleUrlPaste(value: string, setter: (d: ListingDraft) => void, other: ListingDraft, setOther: (d: ListingDraft) => void): boolean {
    const urls = parseMultipleUrls(value);
    if (urls.length > 1) {
      setter({ ...createEmptyDraft("A"), state: "url", url: urls[0] });
      setOther({ ...createEmptyDraft("B"), state: "url", url: urls[1] });
      return true;
    }
    return false;
  }

  function handleCompare() {
    if (!canCompare() || isBusy) return;
    onCompare(draftA, draftB);
  }

  function updateDraftA(d: ListingDraft) {
    if (!handleUrlPaste(d.url, setDraftA, draftB, setDraftB)) setDraftA(d);
  }
  function updateDraftB(d: ListingDraft) {
    if (!handleUrlPaste(d.url, setDraftB, draftA, setDraftA)) setDraftB(d);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="flex-1">
          <DraftColumn draft={draftA} index={0} onChange={updateDraftA} />
        </div>
        <div className="flex items-center gap-3 lg:flex-col lg:gap-0">
          <div className="h-px flex-1 bg-[var(--border-color)] lg:h-full lg:w-px" />
          <span className="px-3 text-xs font-bold uppercase text-[var(--text-muted)] lg:px-0 lg:py-3">vs</span>
          <div className="h-px flex-1 bg-[var(--border-color)] lg:h-full lg:w-px" />
        </div>
        <div className="flex-1">
          <DraftColumn draft={draftB} index={1} onChange={updateDraftB} />
        </div>
      </div>

      <div className="w-full">
        <button
          type="button"
          disabled={!canCompare() || isBusy}
          onClick={handleCompare}
          className="btn-pill w-full"
        >
          <SearchCheck className="h-5 w-5" aria-hidden="true" />
          Compare listings
        </button>
        <p className="mt-2 text-center text-xs text-[var(--text-muted)]">
          Paste two links at once &mdash; they split automatically.
        </p>
      </div>
    </div>
  );
}
