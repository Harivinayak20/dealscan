"use client";

import { useState } from "react";
import { BellRing, Heart } from "lucide-react";
import { isWatched, toggleWatch } from "@/lib/watchlist";
import type { AnalyzeListingResult } from "@/lib/analyzer-types";
import { extractVin } from "@/lib/vin-decoder";

function listingKey(vehicleTitle: string, sourceText: string): string {
  const vin = extractVin(sourceText);
  if (vin) return `vin:${vin}`;
  const price = sourceText.match(/\$\s?([\d,]+)/)?.[1] ?? "";
  const normalized = `${vehicleTitle.toLowerCase().replace(/\s+/g, "-")}|${price}`;
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) - hash + normalized.charCodeAt(i)) | 0;
  }
  return `car:${Math.abs(hash).toString(36)}`;
}

export function WatchButton({
  result,
  vehicleTitle,
  sourceText,
  price,
  sourceUrl,
}: {
  result: AnalyzeListingResult;
  vehicleTitle: string;
  sourceText: string;
  price: number | null;
  sourceUrl?: string;
}) {
  const id = listingKey(vehicleTitle, sourceText);
  const [watching, setWatching] = useState(() => isWatched(id));
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [email, setEmail] = useState("");
  const [alertState, setAlertState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [alertMessage, setAlertMessage] = useState("");

  function handleToggle() {
    const now = toggleWatch(id, result, vehicleTitle, sourceText, price);
    setWatching(now);
    // Email alerts only work when we have a public URL to re-check later.
    setShowAlertForm(now && Boolean(sourceUrl));
    if (!now) setAlertState("idle");
  }

  async function subscribe(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    setAlertState("saving");
    try {
      const response = await fetch("/api/watch", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          listingUrl: sourceUrl,
          vehicleTitle,
          price,
          listingKey: id,
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string; emailConfigured?: boolean };
      if (!response.ok || !data.ok) {
        setAlertState("error");
        setAlertMessage(data.error ?? "Could not set up the alert. Try again.");
        return;
      }
      setAlertState("done");
      setAlertMessage(
        data.emailConfigured
          ? "Done — we'll email you if the price drops or the listing disappears."
          : "Saved. Email alerts are almost live — you're first in line when they switch on.",
      );
    } catch {
      setAlertState("error");
      setAlertMessage("Could not set up the alert. Try again.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleToggle}
        className={`btn-secondary ${
          watching
            ? "!border-[rgba(196,90,74,0.40)] !bg-[rgba(196,90,74,0.10)] !text-[var(--danger)]"
            : ""
        }`}
      >
        <Heart className={`h-5 w-5 ${watching ? "fill-[var(--danger)]" : ""}`} aria-hidden="true" />
        {watching ? "Watching" : "Watch"}
      </button>

      {watching && showAlertForm ? (
        alertState === "done" ? (
          <p className="max-w-[320px] text-xs font-semibold leading-5 text-[var(--racing-green)]">{alertMessage}</p>
        ) : (
          <form onSubmit={subscribe} className="flex max-w-[360px] flex-col gap-1.5">
            <div className="flex gap-1.5">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email for price-drop alerts"
                className="min-h-10 flex-1 rounded-lg border border-[var(--line)] bg-white px-3 text-sm focus:border-[var(--champagne)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={alertState === "saving"}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[var(--graphite)] px-3 text-xs font-black text-white transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                <BellRing className="h-4 w-4" aria-hidden="true" />
                {alertState === "saving" ? "Saving…" : "Alert me"}
              </button>
            </div>
            <p className="text-[11px] leading-4 text-[var(--text-muted)]">
              Optional: get an email if the price drops or the listing disappears. Used only for these alerts — never
              sold, never shared with dealers. One-click stop in every email.
            </p>
            {alertState === "error" ? (
              <p className="text-xs font-semibold text-[var(--warning)]">{alertMessage}</p>
            ) : null}
          </form>
        )
      ) : null}
    </div>
  );
}
