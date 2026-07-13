import { ScansTable } from "@/components/admin/ScansTable";
import { isAdmin } from "@/lib/admin-auth";
import { listScans } from "@/lib/analytics";

// Real scan history from D1. Server component so nothing renders for
// unauthenticated requests (AuthGate in the layout handles login UI).
export const dynamic = "force-dynamic";

export default async function AdminScans() {
  const authed = await isAdmin();
  const scans = authed ? await listScans() : [];

  return (
    <div className="grid gap-6">
      <p className="text-sm leading-6 text-[var(--text-body)]">
        Every scan run through the analyzer, newest first (last 500).
      </p>
      <ScansTable scans={scans} />
    </div>
  );
}
