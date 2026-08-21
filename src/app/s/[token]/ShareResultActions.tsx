"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardCheck, Link2, ScanLine, Trash2 } from "lucide-react";
import { track } from "@/lib/track-client";

export function ShareResultActions({ token }: { token: string }) {
  const router = useRouter();
  const tracked = useRef(false);
  const [canDelete, setCanDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      track("share_opened");
    }
    const timer = window.setTimeout(() => {
      try {
        setCanDelete(Boolean(localStorage.getItem(`dealscan:share-delete:${token}`)));
      } catch {
        setCanDelete(false);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [token]);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  async function deleteShare() {
    let deletionSecret: string | null = null;
    try {
      deletionSecret = localStorage.getItem(`dealscan:share-delete:${token}`);
    } catch {
      setError("The deletion key is unavailable in this browser.");
      return;
    }
    if (!deletionSecret || !window.confirm("Delete this public share permanently?")) return;

    setIsDeleting(true);
    setError("");
    try {
      const response = await fetch(`/api/share/${token}/delete`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deletionSecret }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not delete this share.");
      localStorage.removeItem(`dealscan:share-delete:${token}`);
      router.replace("/");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not delete this share.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/" onClick={() => track("share_to_scan")} className="flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--racing-green)] px-5 text-sm font-bold text-white transition hover:bg-[var(--graphite)]">
          <ScanLine className="h-4 w-4" aria-hidden="true" />
          Scan your own listing
        </Link>
        <button type="button" onClick={() => void copyLink()} className="flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--paper)] px-5 text-sm font-semibold text-[var(--graphite)] transition hover:bg-[var(--ivory)]">
          {copied ? <ClipboardCheck className="h-4 w-4" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
          {copied ? "Copied!" : "Copy link"}
        </button>
        {canDelete ? (
          <button type="button" onClick={() => void deleteShare()} disabled={isDeleting} className="flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--paper)] px-5 text-sm font-semibold text-[var(--danger)] transition hover:bg-[var(--ivory)] disabled:opacity-60">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            {isDeleting ? "Deleting..." : "Delete share"}
          </button>
        ) : null}
      </div>
      {error ? <p className="mt-2 text-xs font-bold text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}
