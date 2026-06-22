"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-5 z-50 grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] bg-[var(--paper)] shadow-lg transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl sm:bottom-8 sm:right-7"
    >
      <ChevronUp className="h-5 w-5 text-[var(--graphite)]" aria-hidden="true" />
    </button>
  );
}
