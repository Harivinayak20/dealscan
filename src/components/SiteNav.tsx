"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

// Global navigation for every inner page. Quiet, minimal chrome: hairline
// border, muted links that darken on hover, a single accent CTA. The landing
// page keeps its own hero header; embeds/admin stay chrome-free.
const NAV_ITEMS = [
  { href: "/price-checker", label: "Price checker" },
  { href: "/vin", label: "VIN check" },
  { href: "/compare", label: "Compare" },
  { href: "/cars", label: "Cars" },
  { href: "/guides", label: "Guides" },
  { href: "/fees", label: "Fees" },
  { href: "/best", label: "Best lists" },
  { href: "/research", label: "Research" },
  { href: "/dashboard", label: "My scans" },
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
    return pathname === href || (pathname?.startsWith(`${href}/`) ?? false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[rgba(244,240,232,0.88)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-[15px] font-semibold tracking-tight text-[var(--graphite)]">
          <img src="/dealscan-logo.png" alt="" width="26" height="26" className="h-[26px] w-[26px] rounded-full" />
          DealScan
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Site navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                isActive(item.href)
                  ? "bg-[rgba(11,13,16,0.05)] font-semibold text-[var(--graphite)]"
                  : "font-medium text-[var(--text-muted)] hover:text-[var(--graphite)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden items-center rounded-full bg-[var(--racing-green)] px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Check a listing
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-md text-[var(--graphite)] transition-colors hover:bg-[rgba(11,13,16,0.05)] lg:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-[var(--border-subtle)] bg-[var(--paper)] px-4 py-4 lg:hidden" aria-label="Site navigation">
          <ul className="grid gap-0.5">
            {[{ href: "/", label: "Analyzer" }, ...NAV_ITEMS].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-3 py-2.5 text-[15px] transition-colors ${
                    isActive(item.href) && item.href !== "/"
                      ? "bg-[rgba(11,13,16,0.05)] font-semibold text-[var(--graphite)]"
                      : "font-medium text-[var(--text-body)] hover:bg-[rgba(11,13,16,0.04)]"
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
