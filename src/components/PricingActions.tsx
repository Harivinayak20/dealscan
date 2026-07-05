"use client";

import { useState } from "react";
import { ArrowRight, BellRing } from "lucide-react";

export function ProCheckoutButtons({ live }: { live: boolean }) {
  const [busy, setBusy] = useState<"weekly" | "monthly" | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  async function checkout(plan: "weekly" | "monthly") {
    setBusy(plan);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error ?? "Checkout is unavailable right now.");
    } catch {
      setError("Checkout is unavailable right now.");
    }
    setBusy(null);
  }

  async function joinWaitlist(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (data.ok) {
        setJoined(true);
        return;
      }
      setError(data.error ?? "Could not join the waitlist.");
    } catch {
      setError("Could not join the waitlist.");
    }
  }

  if (!live) {
    return joined ? (
      <p className="text-sm font-bold text-[var(--racing-green)]">
        You&apos;re on the founding-member list — we&apos;ll email you when Pro goes live (and never for anything else).
      </p>
    ) : (
      <form onSubmit={joinWaitlist} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            aria-label="Email for the Pro waitlist"
            className="min-h-11 flex-1 rounded-lg border border-[var(--line)] bg-white px-3 text-sm focus:border-[var(--champagne)] focus:outline-none"
          />
          <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--graphite)] px-4 text-sm font-black text-white transition hover:-translate-y-0.5">
            <BellRing className="h-4 w-4" aria-hidden="true" />
            Join waitlist
          </button>
        </div>
        <p className="text-[11px] leading-4 text-[var(--text-muted)]">Pro checkout opens soon. Founding members get the launch price locked in.</p>
        {error ? <p className="text-xs font-semibold text-[var(--warning)]">{error}</p> : null}
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => checkout("weekly")}
          className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--graphite)] px-5 text-base font-black text-white transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy === "weekly" ? "Opening…" : "$4.99 / week"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => checkout("monthly")}
          className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-5 text-base font-black transition hover:-translate-y-0.5 hover:border-[var(--champagne)] disabled:opacity-60"
        >
          {busy === "monthly" ? "Opening…" : "$9.99 / month"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <p className="text-[11px] leading-4 text-[var(--text-muted)]">Cancel anytime in one click — weekly billing exists precisely so you can stop when you&apos;ve found your car.</p>
      {error ? <p className="text-xs font-semibold text-[var(--warning)]">{error}</p> : null}
    </div>
  );
}
