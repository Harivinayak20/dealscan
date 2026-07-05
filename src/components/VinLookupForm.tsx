"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;

export function VinLookupForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const vin = value.trim().toUpperCase();
    if (!VIN_PATTERN.test(vin)) {
      setError("Enter the full 17-character VIN (letters I, O, and Q are never used in a VIN).");
      return;
    }
    setError("");
    setIsNavigating(true);
    router.push(`/vin/${vin}`);
  }

  return (
    <form onSubmit={submit} className={compact ? "" : "max-w-xl"}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          maxLength={17}
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          placeholder="Enter 17-character VIN (e.g. 1HGCM82633A004352)"
          aria-label="Vehicle Identification Number"
          className="min-h-12 flex-1 rounded-xl border border-[var(--line)] bg-white px-4 font-mono text-base tracking-wide shadow-sm focus:border-[var(--champagne)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--champagne)]"
        />
        <button
          type="submit"
          disabled={isNavigating}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--graphite)] px-6 text-base font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
          {isNavigating ? "Looking up…" : "Free VIN lookup"}
        </button>
      </div>
      {error ? <p className="mt-2 text-sm font-semibold text-[var(--warning)]">{error}</p> : null}
    </form>
  );
}
