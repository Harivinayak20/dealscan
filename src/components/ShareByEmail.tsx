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
        className="btn-secondary !text-lg"
      >
        <Send className="h-5 w-5" aria-hidden="true" />
        Share by Email
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-[rgba(169,130,83,0.40)] bg-[rgba(169,130,83,0.06)] p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-black text-[var(--graphite)]">Email this analysis</span>
        <button type="button" onClick={() => setOpen(false)} className="btn-ghost !min-h-0 !px-2 !py-1 !text-xs !font-bold !text-[var(--text-muted)] hover:!text-[var(--danger)]">
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
            className="input flex-1 !rounded-xl"
          />
          <button
            type="submit"
            className="btn-secondary !bg-[var(--champagne)] !border-0 hover:!bg-[var(--ivory)]"
          >
            Send
          </button>
        </form>
      )}
      {error && <p className="mt-2 text-xs font-bold text-[var(--danger)]">{error}</p>}
    </div>
  );
}
