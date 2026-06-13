"use client";

import { usePathname } from "next/navigation";
import { ScrollFX } from "@/components/ScrollFX";
import { ThemeToggle } from "@/components/ThemeToggle";

// Site-wide chrome (scroll effects + theme toggle) that must NOT render inside
// the embeddable widget, so embeds stay clean on other people's pages.
export function SiteChrome() {
  const pathname = usePathname();
  if (pathname?.startsWith("/embed")) return null;
  return (
    <>
      <ScrollFX />
      <ThemeToggle />
    </>
  );
}
