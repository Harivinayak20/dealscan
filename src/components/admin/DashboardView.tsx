import { Bell, CarFront, Eye, MousePointerClick, TriangleAlert, Users } from "lucide-react";
import { MetricsCard } from "@/components/admin/MetricsCard";
import type { DashboardStats } from "@/lib/analytics";

function n(value: number | undefined): number {
  return value ?? 0;
}

function timeAgo(ts: number): string {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

const VERDICT_META: Record<string, { label: string; color: string }> = {
  good_deal: { label: "Good deal", color: "var(--success)" },
  fair_deal: { label: "Fair deal", color: "var(--champagne)" },
  risky_deal: { label: "Caution", color: "#c97a1c" },
  avoid: { label: "Avoid", color: "var(--danger)" },
  needs_review: { label: "Needs review", color: "var(--text-muted)" },
};

function Panel({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-black uppercase tracking-wide text-[var(--graphite)]">{title}</h2>
        {hint ? <span className="text-xs text-[var(--text-muted)]">{hint}</span> : null}
      </div>
      {children}
    </section>
  );
}

function Rows({ rows, empty }: { rows: Array<{ key: string; left: React.ReactNode; right: React.ReactNode }>; empty: string }) {
  if (rows.length === 0) return <p className="text-sm text-[var(--text-muted)]">{empty}</p>;
  return (
    <ul className="grid gap-2.5">
      {rows.map((r) => (
        <li key={r.key} className="flex items-center justify-between gap-3 text-sm">
          <span className="min-w-0 truncate text-[var(--text-body)]">{r.left}</span>
          <span className="shrink-0 font-bold text-[var(--graphite)]">{r.right}</span>
        </li>
      ))}
    </ul>
  );
}

export function DashboardView({ stats }: { stats: DashboardStats }) {
  const { totals } = stats;
  const maxPv = Math.max(1, ...stats.pageviewsByDay.map((d) => d.count));

  return (
    <div className="grid gap-6">
      {!stats.available ? (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 text-sm text-[var(--text-muted)] shadow-sm">
          Analytics store is not reachable yet. Numbers will appear here once the database binding is live and traffic comes in.
        </div>
      ) : null}

      {/* Today at a glance */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricsCard label="Visitors today" value={n(stats.sessionsToday)} icon={Users} note={`${n(totals.last7.pageview)} views / 7d`} />
        <MetricsCard label="Pageviews today" value={n(totals.today.pageview)} icon={Eye} note={`${n(totals.last30.pageview)} / 30d`} />
        <MetricsCard label="Scans today" value={n(totals.today.scan_completed)} icon={CarFront} note={`${n(totals.last7.scan_completed)} / 7d`} />
        <MetricsCard label="Affiliate clicks" value={n(totals.today.affiliate_click)} icon={MousePointerClick} note={`${n(totals.last30.affiliate_click)} / 30d`} />
        <MetricsCard label="Errors today" value={n(totals.today.error)} icon={TriangleAlert} note={`${n(totals.last7.error)} / 7d`} />
      </div>

      {/* Growth engine: listing memory + watch alerts */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricsCard label="Listings tracked" value={n(stats.growth?.listingsTracked)} icon={CarFront} note="unique cars in listing memory" />
        <MetricsCard label="Active watches" value={n(stats.growth?.watchesActive)} icon={Bell} note="email alerts armed" />
        <MetricsCard label="Alerts sent" value={n(stats.growth?.alertsSent30d)} icon={MousePointerClick} note="last 30 days" />
      </div>

      {/* Traffic trend */}
      <Panel title="Pageviews" hint="last 14 days">
        {stats.pageviewsByDay.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No pageviews recorded yet.</p>
        ) : (
          <div className="flex h-28 items-end gap-1.5">
            {stats.pageviewsByDay.map((d) => (
              <div key={d.day} className="group flex flex-1 flex-col items-center justify-end gap-1" title={`${d.day}: ${d.count}`}>
                <span className="text-[10px] text-[var(--text-muted)]">{d.count}</span>
                <div
                  className="w-full rounded-t bg-[var(--champagne)] transition group-hover:opacity-80"
                  style={{ height: `${Math.max(4, (d.count / maxPv) * 96)}px` }}
                />
                <span className="text-[10px] text-[var(--text-muted)]">{d.day.slice(5)}</span>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {/* Traffic + Product */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Top pages" hint="7 days">
          <Rows
            empty="No pageviews yet."
            rows={stats.topPages.map((p) => ({ key: p.path, left: p.path, right: p.count }))}
          />
        </Panel>
        <Panel title="Traffic sources" hint="7 days">
          <Rows
            empty="No external referrers yet (direct/SEO shows as none)."
            rows={stats.topReferrers.map((r) => ({ key: r.host, left: r.host, right: r.count }))}
          />
        </Panel>
        <Panel title="Verdict mix" hint="30 days">
          <Rows
            empty="No scans yet."
            rows={stats.verdictMix.map((v) => {
              const meta = VERDICT_META[v.verdict] ?? { label: v.verdict, color: "var(--text-muted)" };
              return {
                key: v.verdict,
                left: (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                    {meta.label}
                  </span>
                ),
                right: v.count,
              };
            })}
          />
        </Panel>
        <Panel title="Top models scanned" hint="30 days">
          <Rows
            empty="No scans yet."
            rows={stats.topModels.map((m) => ({ key: m.title, left: m.title, right: m.count }))}
          />
        </Panel>
      </div>

      {/* Money */}
      <Panel title="Affiliate clicks by partner" hint="30 days">
        <Rows
          empty="No affiliate clicks yet."
          rows={stats.affiliateByPartner.map((a) => ({ key: a.partner, left: a.partner, right: a.count }))}
        />
      </Panel>

      {/* Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Recent scans">
          <Rows
            empty="No scans yet."
            rows={stats.recentScans.map((s) => ({
              key: `${s.ts}`,
              left: (
                <span className="inline-flex items-center gap-2">
                  <span
                    className="inline-grid h-6 w-9 place-items-center rounded text-xs font-black text-white"
                    style={{ backgroundColor: VERDICT_META[s.verdict ?? ""]?.color ?? "var(--text-muted)" }}
                  >
                    {s.score ?? "?"}
                  </span>
                  <span className="truncate">{s.title ?? "Untitled scan"}</span>
                </span>
              ),
              right: <span className="font-normal text-[var(--text-muted)]">{timeAgo(s.ts)}</span>,
            }))}
          />
        </Panel>
        <Panel title="Recent errors">
          <Rows
            empty="No errors logged. 🎉"
            rows={stats.recentErrors.map((e) => ({
              key: `${e.ts}`,
              left: <span className="truncate text-[var(--danger)]">{e.message ?? "Unknown error"}{e.path ? ` · ${e.path}` : ""}</span>,
              right: <span className="font-normal text-[var(--text-muted)]">{timeAgo(e.ts)}</span>,
            }))}
          />
        </Panel>
      </div>
    </div>
  );
}
