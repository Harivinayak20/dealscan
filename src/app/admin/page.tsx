"use client";

import { BarChart3, CarFront, FileWarning, TrendingUp } from "lucide-react";
import { MetricsCard } from "@/components/admin/MetricsCard";
import { ScansTable } from "@/components/admin/ScansTable";
import { adminStore } from "@/lib/admin-store";
import { useState } from "react";

export default function AdminDashboard() {
  const [scans] = useState(() => adminStore.getScans());

  const totalScans = scans.length;
  const avgScore = totalScans > 0
    ? Math.round(scans.reduce((sum, s) => sum + s.score, 0) / totalScans)
    : 0;
  const riskyCount = scans.filter((s) => s.status === "risky_deal" || s.status === "needs_review").length;
  const highConfidence = scans.filter((s) => s.confidence === "High").length;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          label="Total Scans"
          value={totalScans}
          icon={CarFront}
          note="All time"
        />
        <MetricsCard
          label="Average Score"
          value={totalScans > 0 ? avgScore : "—"}
          icon={TrendingUp}
          note={totalScans > 0 ? `Across ${totalScans} scans` : "No data yet"}
        />
        <MetricsCard
          label="Needs Attention"
          value={riskyCount}
          icon={FileWarning}
          note={riskyCount === 1 ? "1 scan flagged" : `${riskyCount} scans flagged`}
        />
        <MetricsCard
          label="High Confidence"
          value={highConfidence}
          icon={BarChart3}
          note={totalScans > 0 ? `${Math.round((highConfidence / totalScans) * 100)}% of scans` : "No data yet"}
        />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-black text-[var(--graphite)]">Recent Scans</h2>
        <ScansTable />
      </div>
    </div>
  );
}
