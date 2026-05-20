"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function ShareByEmail({
  vehicleTitle,
  score,
}: {
  vehicleTitle: string;
  score: number;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSent(false);
    setError("");
    try {
      const res = await fetch("/api/share-report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, vehicleTitle, score }),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        setEmail("");
      } else {
        setError(data.error || "Failed to send.");
      }
    } catch {
      setError("Network error. Try again.");
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 text-lg font-black text-[var(--graphite)] shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--champagne)]"
      >
        <Send className="h-5 w-5" aria-hidden="true" />
        Share by Email
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-[rgba(201,168,106,0.40)] bg-[rgba(201,168,106,0.06)] p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-black text-[var(--graphite)]">Email this analysis</span>
        <button type="button" onClick={() => setOpen(false)} className="text-xs font-bold text-neutral-500 hover:text-[var(--danger)]">
          Cancel
        </button>
      </div>
      {sent ? (
        <p className="mt-3 text-sm font-bold text-[var(--success)]">✓ Request received. Email delivery will be available when connected to an email provider.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="friend@example.com"
            className="min-h-11 flex-1 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-bold text-[var(--graphite)] outline-none transition focus:border-[var(--champagne)] focus:ring-2 focus:ring-[rgba(201,168,106,0.20)]"
          />
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--champagne)] px-5 text-sm font-black text-[var(--graphite)] transition hover:bg-[var(--ivory)]"
          >
            Send
          </button>
        </form>
      )}
      {error && <p className="mt-2 text-xs font-bold text-[var(--danger)]">{error}</p>}
    </div>
  );
}
