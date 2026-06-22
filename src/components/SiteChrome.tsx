"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollFX } from "@/components/ScrollFX";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ThemeToggle } from "@/components/ThemeToggle";

// Site-wide chrome (scroll effects + theme toggle) that must NOT render inside
// the embeddable widget, so embeds stay clean on other people's pages. Also
// registers the PWA service worker (skipped for embeds).
export function SiteChrome() {
  const pathname = usePathname();
  const isEmbed = pathname?.startsWith("/embed") ?? false;
  // The admin dashboard is a data tool, not the marketing site: no scrolling car.
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (isEmbed) return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, [isEmbed]);

  if (isEmbed) return null;
  return (
    <>
      <div className="ambient" aria-hidden="true">
        <span className="balloon balloon-1" />
        <span className="balloon balloon-2" />
        <span className="balloon balloon-3" />
        <span className="balloon balloon-4" />
        <span className="balloon balloon-5" />
      </div>
      {!isAdmin && <ScrollFX />}
      <ThemeToggle />
      <ScrollToTop />
    </>
  );
}
