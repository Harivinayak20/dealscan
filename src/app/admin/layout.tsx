"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { AuthGate } from "@/components/admin/AuthGate";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AuthGate>
      <div className="flex min-h-screen bg-[rgba(244,240,232,0.60)]">
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-30 flex lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-40 w-72 animate-slide-down">
              <AdminSidebar isMobile onClose={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader onMenuToggle={() => setMobileMenuOpen(true)} />
          <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
        </div>
      </div>
    </AuthGate>
  );
}
