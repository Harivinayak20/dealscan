"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { partnerLinks } from "@/lib/integration-links";

// Site-wide marketing footer shared by every public page. Hidden on the
// embeddable widget (keeps embeds clean on other people's pages) and on the
// admin app, which has its own chrome.
export function SiteFooter() {
  const pathname = usePathname();
  const hidden =
    (pathname?.startsWith("/embed") ?? false) ||
    (pathname?.startsWith("/admin") ?? false);

  if (hidden) return null;

  // The homepage has a fixed mobile CTA bar pinned to the bottom, so the footer
  // needs extra bottom padding there to clear it. Other pages have no such bar,
  // so the standard padding keeps the footer flush with the bottom of the page.
  const isHome = pathname === "/";

  return (
    <footer
      className={`bg-[var(--charcoal)] px-5 pt-0 text-[#c9bda8] sm:px-7 ${
        isHome ? "pb-28 lg:pb-12" : "pb-12"
      }`}
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(169,130,83,0.6)] to-transparent" aria-hidden="true" />
      <div className="mx-auto max-w-[1200px] pt-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="text-lg text-[#f3eee3]"><Logo /></div>
            <div className="mt-1 text-[11px] font-bold uppercase text-[var(--champagne)]">Listing review</div>
            <p className="mt-4 max-w-xs text-sm leading-7 text-[var(--silver)]">
              Data-backed used car deal checker. Know the car, not the hype.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#f3eee3]">Product</h3>
            <ul className="mt-4 grid gap-3 text-sm font-bold">
              <li><Link href="/#analyzer" className="transition hover:text-[var(--champagne)]">Analyze a listing</Link></li>
              <li><Link href="/#how-it-works" className="transition hover:text-[var(--champagne)]">How it works</Link></li>
              <li><Link href="/how-scoring-works" className="transition hover:text-[var(--champagne)]">How scoring works</Link></li>
              <li><Link href="/#faq" className="transition hover:text-[var(--champagne)]">FAQ</Link></li>
              <li><a href="/affiliate-links" className="transition hover:text-[var(--champagne)]">Buyer tools</a></li>
              <li><Link href="/guides" className="transition hover:text-[var(--champagne)]">Buyer guides</Link></li>
              <li><Link href="/cars" className="transition hover:text-[var(--champagne)]">Buyer checks by model</Link></li>
              <li><Link href="/fees" className="transition hover:text-[var(--champagne)]">Dealer fees explained</Link></li>
              <li><Link href="/price-checker" className="transition hover:text-[var(--champagne)]">Used car price checker</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#f3eee3]">Resources</h3>
            <ul className="mt-4 grid gap-3 text-sm font-bold">
              <li><a href={partnerLinks.carfax} target="_blank" rel="sponsored noopener noreferrer" className="transition hover:text-[var(--champagne)]">Carfax report</a></li>
              <li><a href={partnerLinks.inspection} target="_blank" rel="sponsored noopener noreferrer" className="transition hover:text-[var(--champagne)]">PPI booking</a></li>
              <li><a href={partnerLinks.insurance} target="_blank" rel="sponsored noopener noreferrer" className="transition hover:text-[var(--champagne)]">Insurance quote</a></li>
              <li><a href={partnerLinks.payments} target="_blank" rel="sponsored noopener noreferrer" className="transition hover:text-[var(--champagne)]">Loan calculator</a></li>
              <li><Link href="/guides" className="transition hover:text-[var(--champagne)]">Used car guides</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#f3eee3]">Company</h3>
            <ul className="mt-4 grid gap-3 text-sm font-bold">
              <li><a href="/about" className="transition hover:text-[var(--champagne)]">About</a></li>
              <li><a href="/contact" className="transition hover:text-[var(--champagne)]">Contact</a></li>
              <li><a href="/terms" className="transition hover:text-[var(--champagne)]">Terms</a></li>
              <li><a href="/disclaimer" className="transition hover:text-[var(--champagne)]">Disclaimer</a></li>
              <li><a href="/cookies" className="transition hover:text-[var(--champagne)]">Cookies</a></li>
              <li><a href="/privacy" className="transition hover:text-[var(--champagne)]">Privacy</a></li>
              <li><a href="mailto:hello@dealscan.dev" className="transition hover:text-[var(--champagne)]">hello@dealscan.dev</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-center text-xs leading-6 text-white/25">
            DealScan provides estimates based on listing information, not guarantees. Always verify title, history, and condition before purchasing.
          </p>
          <div className="mt-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p className="text-sm text-white/35">
              © {new Date().getFullYear()} DealScan. All Rights Reserved.
            </p>
            <div className="flex gap-4 text-xs text-white/25">
              <a href="/privacy" className="transition hover:text-[var(--champagne)]">Privacy</a>
              <a href="/terms" className="transition hover:text-[var(--champagne)]">Terms</a>
              <a href="/cookies" className="transition hover:text-[var(--champagne)]">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
