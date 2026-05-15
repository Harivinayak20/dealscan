"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/scans": "Deal Scans",
  "/admin/settings": "Settings",
  "/admin/audit": "Audit Log",
};

export function AdminHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Admin";

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight text-[var(--graphite)]">{title}</h1>
      </div>
    </header>
  );
}
