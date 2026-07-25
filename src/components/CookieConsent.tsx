"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { AdSenseScript } from "@/components/AdSenseScript";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const STORAGE_KEY = "ds_cookie_consent";

type Consent = "all" | "necessary";
// "unknown" is the server's answer: it cannot read localStorage, so it renders
// nothing and avoids flashing the banner at people who already chose.
type ConsentState = Consent | "unknown" | null;

let listeners: (() => void)[] = [];

function subscribe(onChange: () => void) {
  listeners.push(onChange);
  return () => {
    listeners = listeners.filter((listener) => listener !== onChange);
  };
}

function getSnapshot(): ConsentState {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "all" || value === "necessary" ? value : null;
  } catch {
    return null;
  }
}

function getServerSnapshot(): ConsentState {
  return "unknown";
}

/**
 * Owns the cookie decision for the whole site. Anything that sets a cookie is
 * rendered from here and only once consent is "all", so the default really is
 * no third-party cookies rather than cookies-until-you-object.
 *
 * The first-party visit counter is deliberately not gated: it uses a random
 * per-tab sessionStorage id, sets no cookie, and collects no personal data.
 */
export function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function choose(value: Consent) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Private browsing can reject writes; the notify below still hides the banner.
    }
    listeners.forEach((listener) => listener());
  }

  return (
    <>
      {consent === "all" ? (
        <>
          <GoogleAnalytics />
          <AdSenseScript />
        </>
      ) : null}

      {consent === null ? (
        <div
          role="dialog"
          aria-label="Cookie choices"
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-[var(--line)] bg-[var(--paper)] p-4 shadow-[0_-14px_40px_-24px_rgba(28,26,23,0.5)] sm:p-5"
        >
          <div className="mx-auto flex max-w-[1180px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[70ch] text-sm leading-6 text-[var(--text-body)]">
              We&apos;d like to use Google Analytics cookies to see which pages actually help people,
              and ad cookies if ads are running. Neither is needed for the analyzer to work. Our own
              visit counter sets no cookies and runs either way.{" "}
              <Link href="/cookies" className="font-bold text-[var(--racing-green)] underline underline-offset-4">
                What we store
              </Link>
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => choose("necessary")}
                className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-5 py-2.5 text-sm font-bold text-[var(--text-muted)] transition hover:border-[var(--racing-green)] hover:text-[var(--graphite)]"
              >
                Necessary only
              </button>
              <button
                type="button"
                onClick={() => choose("all")}
                className="rounded-full bg-[#B4501F] px-5 py-2.5 text-sm font-bold text-[#FFFDFA] transition hover:bg-[#9A421A]"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
