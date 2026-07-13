"use client";

import { useEffect } from "react";

const SVG_NS = "http://www.w3.org/2000/svg";

function svgEl<K extends keyof SVGElementTagNameMap>(name: K): SVGElementTagNameMap[K] {
  return document.createElementNS(SVG_NS, name);
}

/**
 * Top-down Nissan Skyline R34 GT-R (nose points toward +x), centered on the
 * origin. A photoreal cutout (public/r34-topdown.webp, trimmed 1200x524) over
 * a soft ground shadow.
 */
function buildCar(): SVGGElement {
  const car = svgEl("g");
  car.setAttribute("class", "scrollfx-car");

  const LENGTH = 120;
  const WIDTH = (LENGTH * 524) / 1200;

  const shadow = svgEl("ellipse");
  shadow.setAttribute("cx", "0");
  shadow.setAttribute("cy", "0");
  shadow.setAttribute("rx", String(LENGTH / 2 - 4));
  shadow.setAttribute("ry", String(WIDTH / 2));
  shadow.setAttribute("fill", "rgba(0,0,0,0.16)");
  car.appendChild(shadow);

  const img = svgEl("image");
  img.setAttribute("href", "/r34-topdown.webp");
  img.setAttribute("x", String(-LENGTH / 2));
  img.setAttribute("y", String(-WIDTH / 2));
  img.setAttribute("width", String(LENGTH));
  img.setAttribute("height", String(WIDTH));
  img.setAttribute("preserveAspectRatio", "xMidYMid meet");
  car.appendChild(img);

  return car;
}

/**
 * Site-wide scroll effects, plain JS + CSS so they work in every browser:
 * - a horizontal progress bar that fills while scrolling
 * - tire tracks drawn down the page gutters as you scroll, with a red
 *   sports car driving at the tip
 * - sections that fade-and-rise into place as they enter the viewport
 */
export function ScrollFX() {
  useEffect(() => {
    // --- Tire-track overlay ---
    const svg = svgEl("svg");
    svg.setAttribute("class", "scrollfx-svg");
    svg.setAttribute("aria-hidden", "true");

    // A clip rect that grows with scroll reveals the tracks. Far cheaper to
    // update per frame than a stroke-dash mask over a page-sized path.
    const defs = svgEl("defs");
    const clip = svgEl("clipPath");
    clip.setAttribute("id", "scrollfx-reveal");
    clip.setAttribute("clipPathUnits", "userSpaceOnUse");
    const clipRect = svgEl("rect");
    clipRect.setAttribute("x", "0");
    clipRect.setAttribute("y", "0");
    clipRect.setAttribute("width", "0");
    clipRect.setAttribute("height", "0");
    clip.appendChild(clipRect);
    defs.appendChild(clip);
    svg.appendChild(defs);

    // invisible geometry path: position/length lookups only
    const maskPath = svgEl("path");
    maskPath.setAttribute("fill", "none");
    maskPath.setAttribute("stroke", "none");
    svg.appendChild(maskPath);

    const tracks = svgEl("g");
    tracks.setAttribute("clip-path", "url(#scrollfx-reveal)");
    const trackBase = svgEl("path");
    trackBase.setAttribute("class", "scrollfx-track");
    const trackGap = svgEl("path");
    trackGap.setAttribute("class", "scrollfx-track-gap");
    tracks.append(trackBase, trackGap);
    svg.appendChild(tracks);

    const car = buildCar();
    svg.appendChild(car);
    document.body.appendChild(svg);

    let total = 0;
    let carScale = 1;
    const pathShapes = [maskPath, trackBase, trackGap];

    const rebuild = () => {
      const width = document.documentElement.clientWidth;
      // Measure the body's own content height, never scrollHeight: the svg is
      // absolutely positioned against the page, so sizing it from scrollHeight
      // lets a stale (taller) svg extend the page below the footer whenever
      // content shrinks or loads late (fonts, ads, collapsed sections).
      const height = Math.ceil(document.body.getBoundingClientRect().height);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.style.width = `${width}px`;
      svg.style.height = `${height}px`;

      // On narrow screens the car weaves within the screen (behind the cards
      // and text) with smaller turns; on wide screens it runs the gutters.
      const narrow = width < 1024;
      carScale = narrow ? 0.45 : 1;

      const gutter = narrow ? 14 : Math.max(18, (width - 1200) / 2 - 28);
      // A fixed left side menu (inner pages, desktop) owns the left gutter:
      // push the car's left rail inward so it never drives under the menu.
      const sideNavPad = !narrow && document.querySelector(".site-side-nav") ? 232 : 0;
      const leftX = gutter + sideNavPad;
      const rightX = width - gutter;
      const sway = narrow ? 130 : 280;
      const minGap = narrow ? 360 : 600;

      // Swing across at the boundaries between sections.
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("main > section, main > footer")
      );
      const scrollY = window.scrollY;
      const crossings = sections
        .slice(1)
        .map((s) => s.getBoundingClientRect().top + scrollY)
        .filter((y) => y > 300 && y < height - 320)
        .filter((y, i, arr) => i === 0 || y - arr[i - 1] > minGap);
      let side = 1 as 0 | 1;
      let x = side === 0 ? leftX : rightX;
      let d = `M ${x} 150`;
      for (const y of crossings) {
        const ox = side === 0 ? rightX : leftX;
        d += ` L ${x} ${y - sway}`;
        d += ` C ${x} ${y}, ${ox} ${y}, ${ox} ${y + sway}`;
        side = side === 0 ? 1 : 0;
        x = ox;
      }
      d += ` L ${x} ${height - 60}`;

      for (const p of pathShapes) p.setAttribute("d", d);
      total = maskPath.getTotalLength();
      clipRect.setAttribute("width", String(width));
    };

    // The car eases toward the scroll position in its own animation loop,
    // so it glides smoothly no matter how jumpy the scroll events are.
    let shown = 0;
    let lastAngle = 90;
    let frame = 0;

    const targetProgress = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      return max > 0 ? doc.scrollTop / max : 0;
    };

    const render = (progress: number) => {
      if (total <= 0) return;
      const drawn = total * progress;
      const tip = maskPath.getPointAtLength(drawn);
      clipRect.setAttribute("height", String(Math.max(0, tip.y - 6)));
      const ahead = maskPath.getPointAtLength(Math.min(drawn + 3, total));
      let angle =
        drawn + 5 > total
          ? 90
          : (Math.atan2(ahead.y - tip.y, ahead.x - tip.x) * 180) / Math.PI;
      // blend along the shortest rotation so the car never twitches
      let delta = angle - lastAngle;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      angle = lastAngle + delta * 0.18;
      lastAngle = angle;
      car.setAttribute("transform", `translate(${tip.x} ${tip.y}) rotate(${angle}) scale(${carScale})`);
    };

    const tick = () => {
      const target = targetProgress();
      shown += (target - shown) * 0.2;
      if (Math.abs(target - shown) < 0.0004) {
        shown = target;
        render(shown);
        frame = 0;
        return;
      }
      render(shown);
      frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const update = () => {
      shown = targetProgress();
      render(shown);
    };

    let raf = 0;
    const queueRebuild = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        rebuild();
        update();
      });
    };

    rebuild();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", queueRebuild);

    // Content can change height without any DOM mutation (web fonts, images,
    // ad iframes, <details> toggles). Track the body's size directly so the
    // overlay always matches the real page height.
    const resizeObserver = new ResizeObserver(queueRebuild);
    resizeObserver.observe(document.body);

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
      // Animate the inner content divs, not the sections themselves: a
      // transform on a section flattens its stacking order and lets the
      // car paint over the text while the reveal runs.
      document.querySelectorAll("main section > div, main footer > div, main article > div").forEach((el) => {
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
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", queueRebuild);
      resizeObserver.disconnect();
      observer.disconnect();
      mutations.disconnect();
      svg.remove();
    };
  }, []);

  return null;
}
