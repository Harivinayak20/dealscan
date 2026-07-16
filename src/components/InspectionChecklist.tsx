"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Printer, RotateCcw } from "lucide-react";
import { inspectionChecklist, totalChecklistItems } from "@/lib/inspection-checklist";

const STORAGE_KEY = "dealscan_inspection_checklist";

function loadChecked(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function saveChecked(checked: Record<string, boolean>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  } catch {
    /* storage full or unavailable */
  }
}

export function InspectionChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => loadChecked());

  useEffect(() => {
    saveChecked(checked);
  }, [checked]);

  const checkedCount = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked],
  );
  const pct = totalChecklistItems > 0 ? Math.round((checkedCount / totalChecklistItems) * 100) : 0;
  const isComplete = checkedCount === totalChecklistItems;

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function reset() {
    setChecked({});
  }

  return (
    <div className="grid gap-6">
      {/* Progress bar + actions — hidden on print, sticky so it stays visible while scrolling the list */}
      <div className="print:hidden sticky top-0 z-10 -mx-1 rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)]/95 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-[var(--graphite)]">
              {checkedCount} of {totalChecklistItems} checked
            </div>
            <div className="mt-1 h-2 w-48 max-w-[60vw] overflow-hidden rounded-full bg-[var(--ivory)]">
              <div
                className="h-full rounded-full bg-[var(--racing-green)] transition-[width] duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-bold text-[var(--graphite)] transition hover:bg-[var(--ivory)]"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              Print
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-bold text-[var(--graphite)] transition hover:bg-[var(--ivory)]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset
            </button>
          </div>
        </div>

        {isComplete ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[var(--accent-2-soft,_rgba(180,80,31,0.08))] p-3">
            <p className="text-sm font-bold text-[var(--graphite)]">
              Checklist complete. Now find out if the price is fair.
            </p>
            <Link
              href="/#analyzer"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--racing-green)] px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Get your deal score
            </Link>
          </div>
        ) : null}
      </div>

      {/* Print header — only shown when printing */}
      <div className="hidden print:block">
        <h2 className="text-xl font-black">DealScan Used Car Inspection Checklist</h2>
        <p className="text-sm text-[var(--text-muted)]">dealscan.dev/inspection-checklist</p>
      </div>

      <div className="grid gap-6">
        {inspectionChecklist.map((group) => {
          const groupChecked = group.items.filter((i) => checked[i.id]).length;
          return (
            <section
              key={group.id}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm print:break-inside-avoid print:border print:shadow-none"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-black tracking-tight">{group.title}</h2>
                <span className="text-xs font-semibold text-[var(--text-muted)]">
                  {groupChecked}/{group.items.length}
                </span>
              </div>
              <ul className="mt-3 grid gap-2.5">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg px-1 py-1 text-sm transition hover:bg-[var(--ivory)] print:hover:bg-transparent">
                      <input
                        type="checkbox"
                        checked={Boolean(checked[item.id])}
                        onChange={() => toggle(item.id)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--racing-green)] print:appearance-auto"
                      />
                      <span>
                        <span
                          className={
                            checked[item.id]
                              ? "text-[var(--text-muted)] line-through"
                              : "text-[var(--graphite)]"
                          }
                        >
                          {item.label}
                        </span>
                        {item.hint ? (
                          <span className="mt-0.5 block text-xs text-[var(--text-muted)]">{item.hint}</span>
                        ) : null}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
