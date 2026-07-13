"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

// Global navigation for every inner page. The landing page keeps its own hero
// header, and embeds/admin stay chrome-free, so this hides itself there.
const NAV_ITEMS = [
  { href: "/", label: "Analyzer" },
  { href: "/price-checker", label: "Price Checker" },
  { href: "/vin", label: "VIN Check" },
  { href: "/compare", label: "Compare" },
  { href: "/cars", label: "Cars" },
  { href: "/guides", label: "Guides" },
  { href: "/fees", label: "Dealer Fees" },
  { href: "/best", label: "Best Lists" },
  { href: "/research", label: "Research" },
  { href: "/dashboard", label: "My Scans" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const hidden =
    pathname === "/" ||
    (pathname?.startsWith("/embed") ?? false) ||
    (pathname?.startsWith("/admin") ?? false);
  if (hidden) return null;

  function isActive(href: string) {
    if (href === "/") return false;
    return pathname === href || (pathname?.startsWith(`${href}/`) ?? false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[rgba(244,240,232,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 text-xl font-black tracking-tight text-[var(--graphite)] transition hover:-translate-y-0.5">
          <img src="/dealscan-logo.png" alt="" width="36" height="36" className="h-9 w-9 rounded-full" />
          DealScan.dev
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Site navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                isActive(item.href)
                  ? "bg-[var(--graphite)] text-white"
                  : "text-[var(--text-body)] hover:bg-[rgba(11,13,16,0.06)] hover:text-[var(--graphite)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--border-subtle)] bg-[var(--paper)] text-[var(--graphite)] shadow-sm transition hover:border-[var(--champagne)] lg:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-[var(--border-subtle)] bg-[var(--paper)] px-4 py-3 shadow-lg lg:hidden" aria-label="Site navigation">
          <ul className="grid gap-1 sm:grid-cols-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-base font-bold transition ${
                    isActive(item.href)
                      ? "bg-[var(--graphite)] text-white"
                      : "text-[var(--text-body)] hover:bg-[rgba(11,13,16,0.06)] hover:text-[var(--graphite)]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
