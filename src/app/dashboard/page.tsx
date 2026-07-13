"use client";

import { DashboardView } from "@/components/DashboardView";

export default function DashboardPage() {
  return (
    <div>
      <DashboardView onBack={() => window.location.href = "/"} />
    </div>
  );
}
