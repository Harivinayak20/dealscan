"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function WidgetEmbedBlock({ snippet, previewSrc }: { snippet: string; previewSrc: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked; the textarea is selectable as a fallback
    }
  };

  return (
    <div className="mt-5 grid gap-6 lg:grid-cols-2">
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black">Embed code</p>
          <button
            type="button"
            onClick={copy}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[var(--graphite)] px-3.5 text-xs font-black text-[var(--ivory)] transition hover:bg-[var(--racing-green)]"
          >
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            {copied ? "Copied" : "Copy code"}
          </button>
        </div>
        <textarea
          readOnly
          value={snippet}
          rows={8}
          onFocus={(e) => e.currentTarget.select()}
          className="mt-3 w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--charcoal)] p-4 font-mono text-xs leading-5 text-[#e8e2d4]"
        />
      </div>
      <div>
        <p className="text-sm font-black">Live preview</p>
        <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-3 shadow-sm">
          <iframe
            src={previewSrc}
            title="DealScan used car price checker preview"
            width="100%"
            height="620"
            style={{ border: 0, borderRadius: 12 }}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
