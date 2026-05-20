"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DashboardView } from "@/components/DashboardView";

export default function DashboardPage() {
  return (
    <div>
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[rgba(11,13,16,0.90)] text-[var(--ivory)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-sm font-bold text-[var(--silver)] transition hover:text-[var(--champagne)]">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Analyzer
            </Link>
          </div>
          <Link href="/" className="text-2xl font-black tracking-tight text-[var(--ivory)]">
            Dealscan
          </Link>
        </div>
      </header>
      <DashboardView onBack={() => window.location.href = "/"} />
    </div>
  );
}
