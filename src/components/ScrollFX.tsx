"use client";

import { useEffect } from "react";

/**
 * Site-wide scroll effects, plain JS + CSS transitions so they work in
 * every browser: a progress bar that fills while scrolling, and sections
 * that fade-and-rise into place as they enter the viewport.
 */
export function ScrollFX() {
  useEffect(() => {
    const bar = document.createElement("div");
    bar.className = "scrollfx-bar";
    document.body.appendChild(bar);

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? doc.scrollTop / max : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("fx-in", entry.isIntersecting);
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );

    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll("main section, main footer, main article > div").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        const rect = el.getBoundingClientRect();
        el.classList.add("fx-reveal");
        // Content already on screen at load shows instantly: no blank flash.
        if (rect.top < window.innerHeight * 0.95) {
          el.classList.add("fx-in");
        }
        observer.observe(el);
      });
    };
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer.disconnect();
      mutations.disconnect();
      bar.remove();
    };
  }, []);

  return null;
}
