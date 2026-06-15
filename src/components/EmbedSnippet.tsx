"use client";

import { useState } from "react";
import { Check, Code2, Copy } from "lucide-react";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

const SNIPPET = `<iframe src="${appUrl}/embed/price-checker" width="100%" height="680" style="border:1px solid #e5e0d6;border-radius:16px;max-width:760px" title="Used Car Price Checker by DealScan" loading="lazy"></iframe>
<p style="font:13px sans-serif"><a href="${appUrl}/price-checker" target="_blank" rel="noopener">Used Car Price Checker</a> by DealScan</p>`;

export function EmbedSnippet() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked; the textarea is selectable as a fallback
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-black">
          <Code2 className="h-5 w-5 text-[var(--racing-green)]" aria-hidden="true" />
          Add this free tool to your site
        </h2>
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[var(--graphite)] px-3.5 text-xs font-black text-[var(--ivory)] transition hover:bg-[var(--racing-green)]"
        >
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        Free for any site, blog, or forum. Paste this where you want the price checker to appear.
      </p>
      <textarea
        readOnly
        value={SNIPPET}
        rows={4}
        onFocus={(e) => e.currentTarget.select()}
        className="mt-3 w-full rounded-xl border border-[var(--line)] bg-[var(--canvas)] p-3 font-mono text-xs leading-5 text-[var(--text-body)]"
      />
    </div>
  );
}
