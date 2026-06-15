"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/track-client";

// Fires a cookieless pageview on every route change. Skips the admin area so the
// owner's own visits don't pollute the stats.
export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    track("pageview");
  }, [pathname]);

  return null;
}
