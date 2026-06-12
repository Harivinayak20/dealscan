import type { ComponentType } from "react";

type MetricsCardProps = {
  label: string;
  value: string | number;
  note?: string;
  icon: ComponentType<{ className?: string }>;
  trend?: "up" | "down" | "neutral";
};

export function MetricsCard({ label, value, note, icon: Icon, trend }: MetricsCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[var(--text-body)]">{label}</p>
          <p className="mt-1 text-3xl font-black text-[var(--graphite)]">{value}</p>
          {note && <p className="mt-1 text-xs text-[var(--text-muted)]">{note}</p>}
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[rgba(201,168,106,0.12)]">
          <Icon className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
        </span>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs font-bold">
          <span
            className={
              trend === "up" ? "text-[var(--success)]" : trend === "down" ? "text-[var(--danger)]" : "text-[var(--text-muted)]"
            }
          >
            {trend === "up" ? "▲" : trend === "down" ? "▼" : "◆"}
          </span>
        </div>
      )}
    </div>
  );
}
