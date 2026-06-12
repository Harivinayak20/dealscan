"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT_ID, isAdSenseReady } from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

type AdUnitProps = {
  slot?: string;
  className?: string;
};

export function AdUnit({ slot, className = "" }: AdUnitProps) {
  const ready = isAdSenseReady(slot);

  useEffect(() => {
    if (!ready) return;

    const timer = window.setTimeout(() => {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch {
        // Ad blockers or repeated client-side renders can reject ad refreshes.
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [ready, slot]);

  if (!ready || !slot) {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`mx-auto w-full max-w-[970px] rounded-xl border border-[rgba(255,255,255,0.10)] bg-[var(--paper)] p-3 text-[var(--graphite)] shadow-[inset_0_1px_0_rgba(255,255,255,0.64)] ${className}`}
    >
      <div className="mb-2 text-center text-[10px] font-black uppercase text-[#7b857f]">
        Advertisement
      </div>
      <ins
        className="adsbygoogle block min-h-[120px]"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
