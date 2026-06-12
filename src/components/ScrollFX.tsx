"use client";

import { useEffect } from "react";

const SVG_NS = "http://www.w3.org/2000/svg";

function svgEl<K extends keyof SVGElementTagNameMap>(name: K): SVGElementTagNameMap[K] {
  return document.createElementNS(SVG_NS, name);
}

/**
 * Site-wide scroll effects, plain JS + CSS transitions so they work in
 * every browser:
 * - a horizontal progress bar that fills while scrolling
 * - a glowing vertical S-curve that draws itself down the page, with a
 *   glowing arrowhead riding its tip
 * - sections that fade-and-rise into place as they enter the viewport
 */
export function ScrollFX() {
  useEffect(() => {
    const bar = document.createElement("div");
    bar.className = "scrollfx-bar";
    document.body.appendChild(bar);

    // --- Glowing S-curve overlay ---
    const svg = svgEl("svg");
    svg.setAttribute("class", "scrollfx-svg");
    svg.setAttribute("aria-hidden", "true");

    const defs = svgEl("defs");
    const grad = svgEl("linearGradient");
    grad.setAttribute("id", "scrollfx-grad");
    grad.setAttribute("x1", "0");
    grad.setAttribute("y1", "0");
    grad.setAttribute("x2", "0");
    grad.setAttribute("y2", "1");
    for (const [offset, color] of [
      ["0%", "#19e58f"],
      ["50%", "#ffd166"],
      ["100%", "#ff8a5c"],
    ]) {
      const stop = svgEl("stop");
      stop.setAttribute("offset", offset);
      stop.setAttribute("stop-color", color);
      grad.appendChild(stop);
    }
    defs.appendChild(grad);
    svg.appendChild(defs);

    const glowPath = svgEl("path");
    glowPath.setAttribute("class", "scrollfx-path-glow");
    const mainPath = svgEl("path");
    mainPath.setAttribute("class", "scrollfx-path-main");
    const corePath = svgEl("path");
    corePath.setAttribute("class", "scrollfx-path-core");
    const arrow = svgEl("g");
    arrow.setAttribute("class", "scrollfx-arrow");
    const arrowShape = svgEl("path");
    arrowShape.setAttribute("d", "M 0 -16 L 12 8 L 0 2 L -12 8 Z");
    const arrowHalo = svgEl("circle");
    arrowHalo.setAttribute("class", "scrollfx-arrow-halo");
    arrowHalo.setAttribute("r", "22");
    arrow.appendChild(arrowHalo);
    arrow.appendChild(arrowShape);
    svg.append(glowPath, mainPath, corePath, arrow);
    document.body.appendChild(svg);

    let total = 0;
    const paths = [glowPath, mainPath, corePath];

    const rebuild = () => {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.scrollHeight;
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.style.width = `${width}px`;
      svg.style.height = `${height}px`;

      const cx = width / 2;
      const amp = Math.min(width * 0.4, 480);
      const step = Math.max(560, height / 12);
      let d = `M ${cx} 0`;
      let side = 1;
      for (let y = 0; y < height - 80; y += step) {
        const x = cx + side * amp;
        const end = Math.min(y + step, height - 80);
        d += ` C ${x} ${y + step * 0.3}, ${x} ${y + step * 0.7}, ${cx} ${end}`;
        side = -side;
      }
      for (const p of paths) p.setAttribute("d", d);
      total = mainPath.getTotalLength();
      for (const p of paths) {
        p.style.strokeDasharray = `${total}`;
      }
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? doc.scrollTop / max : 0;
      bar.style.transform = `scaleX(${progress})`;

      if (total > 0) {
        const drawn = total * progress;
        for (const p of paths) {
          p.style.strokeDashoffset = `${total - drawn}`;
        }
        const tip = mainPath.getPointAtLength(drawn);
        const ahead = mainPath.getPointAtLength(Math.min(drawn + 2, total));
        const angle =
          (Math.atan2(ahead.y - tip.y, ahead.x - tip.x) * 180) / Math.PI + 90;
        arrow.setAttribute(
          "transform",
          `translate(${tip.x} ${tip.y}) rotate(${drawn + 4 > total ? 90 : angle})`
        );
      }
    };

    let raf = 0;
    const queueRebuild = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        rebuild();
        onScroll();
      });
    };

    rebuild();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", queueRebuild);

    // --- Section reveals ---
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
      queueRebuild();
    };
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", queueRebuild);
      observer.disconnect();
      mutations.disconnect();
      bar.remove();
      svg.remove();
    };
  }, []);

  return null;
}
