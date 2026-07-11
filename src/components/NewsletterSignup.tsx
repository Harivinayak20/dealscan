"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

type Source = "footer" | "guide";

// Reusable, unobtrusive email capture. Used in the footer and at the bottom
// of guide articles. No popups, no exit-intent — inline only.
export function NewsletterSignup({ source, className = "" }: { source: Source; className?: string }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function subscribe(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (data.ok) {
        setDone(true);
        return;
      }
      setError(data.error ?? "Could not sign up.");
    } catch {
      setError("Could not sign up.");
    }
  }

  if (done) {
    return (
      <p className={`text-sm font-bold text-[var(--racing-green)] ${className}`}>
        You&apos;re in — fee alerts and deal tips, no spam.
      </p>
    );
  }

  return (
    <form onSubmit={subscribe} className={`flex flex-col gap-2 ${className}`}>
      <p className="text-sm font-bold">Get used-car fee alerts and deal tips — no spam.</p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          aria-label="Email address"
          className="min-h-11 flex-1 rounded-lg border border-[var(--line)] bg-white px-3 text-sm text-[var(--graphite)] focus:border-[var(--champagne)] focus:outline-none"
        />
        <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--graphite)] px-4 text-sm font-black text-white transition hover:-translate-y-0.5">
          <Mail className="h-4 w-4" aria-hidden="true" />
          Sign up
        </button>
      </div>
      {error ? <p className="text-xs font-semibold text-[var(--warning)]">{error}</p> : null}
    </form>
  );
}
