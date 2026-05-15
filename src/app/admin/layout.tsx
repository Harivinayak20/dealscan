import type { ReactNode } from "react";
import { AuthGate } from "@/components/admin/AuthGate";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const metadata = {
  title: "Dealscan Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <div className="flex min-h-screen bg-[rgba(244,240,232,0.60)]">
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 px-6 py-6">{children}</main>
        </div>
      </div>
    </AuthGate>
  );
}
