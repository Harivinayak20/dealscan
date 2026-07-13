"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

// Global navigation for every inner page. Desktop: a fixed left side menu
// (content is shifted right via body:has(.site-side-nav) in globals.css).
// Mobile: a slim top bar with a smooth dropdown. The landing page keeps its
// own hero header; embeds/admin stay chrome-free.
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

  const linkClass = (active: boolean) =>
    `block rounded-md px-3 py-2 text-sm transition-colors ${
      active
        ? "bg-[rgba(11,13,16,0.05)] font-semibold text-[var(--graphite)]"
        : "font-medium text-[var(--text-muted)] hover:bg-[rgba(11,13,16,0.04)] hover:text-[var(--graphite)]"
    }`;

  return (
    <>
      <aside className="site-side-nav fixed inset-y-0 left-0 z-40 hidden w-56 flex-col border-r border-[var(--border-subtle)] bg-[var(--paper)] px-3 py-5 lg:flex">
        <Link href="/" className="flex items-center gap-2 px-3 text-[15px] font-semibold tracking-tight text-[var(--graphite)]">
          <img src="/dealscan-logo.png" alt="" width="26" height="26" className="h-[26px] w-[26px] rounded-full" />
          DealScan
        </Link>
        <Link
          href="/"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-[var(--racing-green)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Check a listing
        </Link>
        <nav className="mt-6 flex-1 overflow-y-auto" aria-label="Site navigation">
          <ul className="grid gap-0.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass(isActive(item.href))}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="px-3 text-xs text-[var(--text-muted)]">Free, no signup.</p>
      </aside>

      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[rgba(244,240,232,0.88)] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="-ml-1.5 grid h-9 w-9 place-items-center rounded-md text-[var(--graphite)] transition-colors hover:bg-[rgba(11,13,16,0.05)]"
            >
              {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
            <Link href="/" className="flex shrink-0 items-center gap-2 text-[15px] font-semibold tracking-tight text-[var(--graphite)]">
              <img src="/dealscan-logo.png" alt="" width="26" height="26" className="h-[26px] w-[26px] rounded-full" />
              DealScan
            </Link>
          </div>
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-[var(--racing-green)] px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Check a listing
          </Link>
        </div>

        {open ? (
          <nav className="menu-drop border-t border-[var(--border-subtle)] bg-[var(--paper)] px-4 py-4" aria-label="Site navigation">
            <ul className="grid gap-0.5">
              {[{ href: "/", label: "Analyzer" }, ...NAV_ITEMS].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={linkClass(item.href !== "/" && isActive(item.href))}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>
    </>
  );
}
