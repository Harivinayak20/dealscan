"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/scans": "Deal Scans",
  "/admin/settings": "Settings",
  "/admin/audit": "Audit Log",
};

type AdminHeaderProps = {
  onMenuToggle: () => void;
};

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Admin";

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 px-4 py-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <h1 className="text-2xl font-black tracking-tight text-[var(--graphite)]">{title}</h1>
      </div>
    </header>
  );
}
