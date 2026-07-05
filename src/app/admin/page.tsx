import { DashboardView } from "@/components/admin/DashboardView";
import { getDashboardStats, type DashboardStats } from "@/lib/analytics";
import { isAdmin } from "@/lib/admin-auth";

// Real-data monitoring dashboard. Server component so it can read D1 directly,
// gated server-side so stats never render for unauthenticated requests (the
// client AuthGate in the layout handles the login UI).
export const dynamic = "force-dynamic";

const EMPTY: DashboardStats = {
  available: false,
  totals: { today: {}, last7: {}, last30: {} },
  sessionsToday: 0,
  pageviewsByDay: [],
  topPages: [],
  topReferrers: [],
  verdictMix: [],
  topModels: [],
  affiliateByPartner: [],
  recentScans: [],
  recentErrors: [],
  growth: null,
};

export default async function AdminDashboard() {
  const authed = await isAdmin();
  const stats = authed ? await getDashboardStats() : EMPTY;

  return <DashboardView stats={stats} />;
}
