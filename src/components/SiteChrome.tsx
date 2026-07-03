"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollFX } from "@/components/ScrollFX";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ThemeToggle } from "@/components/ThemeToggle";

// Site-wide chrome (scroll-driven car + theme toggle + scroll-to-top) that
// must NOT render inside the embeddable widget, so embeds stay clean on other
// people's pages. Also registers the PWA service worker (skipped for embeds).
// Design simplification kept the tire-track car but dropped the ambient
// balloon layer in favor of the calmer paper background.
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
      {!isAdmin && <ScrollFX />}
      <ThemeToggle />
      <ScrollToTop />
    </>
  );
}
