"use client";

import {
  BarChart3,
  CarFront,
  FileText,
  History,
  LogOut,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminStore } from "@/lib/admin-store";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/scans", label: "Deal Scans", icon: CarFront },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/audit", label: "Audit Log", icon: History },
];

type AdminSidebarProps = {
  onClose?: () => void;
  isMobile?: boolean;
};

export function AdminSidebar({ onClose, isMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    adminStore.logout();
    document.cookie = "admin_token=; path=/; max-age=0; SameSite=Lax";
    router.push("/admin");
  }

  return (
    <aside
      className={
        isMobile
          ? "flex h-full w-full flex-col bg-white"
          : "flex h-full w-64 flex-col border-r border-neutral-200 bg-white"
      }
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--graphite)]">
            <CarFront className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
          </div>
          <div>
            <div className="text-base font-black text-[var(--graphite)]">Dealscan</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--champagne)]">Admin</div>
          </div>
        </div>
        {isMobile && onClose && (
          <button onClick={onClose} className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100" aria-label="Close menu">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
        <ul className="grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                    isActive
                      ? "bg-[var(--graphite)] text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-[var(--graphite)]"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-neutral-100 p-3">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-neutral-600 transition hover:bg-neutral-100 hover:text-[var(--graphite)]"
        >
          <FileText className="h-5 w-5" aria-hidden="true" />
          Public Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-neutral-600 transition hover:bg-red-50 hover:text-[var(--danger)]"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  );
}
