import { SubscribersTable } from "@/components/admin/SubscribersTable";
import { isAdmin } from "@/lib/admin-auth";
import { listSubscribers } from "@/lib/analytics";

// Newsletter signups from D1. Server component, auth-gated like the dashboard.
export const dynamic = "force-dynamic";

export default async function AdminSubscribers() {
  const authed = await isAdmin();
  const subscribers = authed ? await listSubscribers() : [];

  return (
    <div className="grid gap-6">
      <p className="text-sm leading-6 text-[var(--text-body)]">
        Email signups from the footer and guide capture forms, newest first.
      </p>
      <SubscribersTable subscribers={subscribers} />
    </div>
  );
}
