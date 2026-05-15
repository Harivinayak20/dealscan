import type { AdminSettings, AuditEntry, StoredScan } from "@/lib/admin-types";
import { DEFAULT_SETTINGS, verdictToStatus } from "@/lib/admin-types";

const STORAGE_KEYS = {
  scans: "dealscan_admin_scans",
  audit: "dealscan_admin_audit",
  settings: "dealscan_admin_settings",
  auth: "dealscan_admin_auth",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable */
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const MOCK_SCANS: StoredScan[] = [
  {
    id: "mock-1",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    vehicleTitle: "2018 Toyota Camry LE",
    score: 88,
    verdict: "Great Deal",
    status: "good_deal",
    confidence: "High",
    listingTextSnippet: "2018 Toyota Camry LE, 72,000 miles, clean title, one owner...",
  },
  {
    id: "mock-2",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    vehicleTitle: "2016 BMW M3 Sedan",
    score: 62,
    verdict: "Proceed with Caution",
    status: "risky_deal",
    confidence: "Medium",
    listingTextSnippet: "2016 BMW M3 Sedan, 74,000 miles, title status unclear...",
  },
  {
    id: "mock-3",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    vehicleTitle: "2009 Nissan Altima",
    score: 38,
    verdict: "Avoid",
    status: "needs_review",
    confidence: "Low",
    listingTextSnippet: "2009 Nissan Altima, 181,000 miles, no title, runs rough...",
  },
  {
    id: "mock-4",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    vehicleTitle: "2020 Honda Civic LX",
    score: 76,
    verdict: "Decent Deal",
    status: "fair_deal",
    confidence: "Medium",
    listingTextSnippet: "2020 Honda Civic LX, 45,000 miles, clean title...",
  },
];

const MOCK_AUDIT: AuditEntry[] = [
  {
    id: "audit-1",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    action: "Login",
    adminEmail: "admin@dealscan.dev",
    details: "Admin user logged in successfully.",
  },
  {
    id: "audit-2",
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    action: "Status Update",
    adminEmail: "admin@dealscan.dev",
    details: "Changed scan mock-1 status from needs_review to good_deal.",
  },
];

export const adminStore = {
  getScans(): StoredScan[] {
    const stored = read<StoredScan[]>(STORAGE_KEYS.scans, []);
    if (stored.length === 0) {
      write(STORAGE_KEYS.scans, MOCK_SCANS);
      return MOCK_SCANS;
    }
    return stored;
  },

  getScan(id: string): StoredScan | undefined {
    return this.getScans().find((s) => s.id === id);
  },

  addScan(scan: Omit<StoredScan, "id" | "createdAt" | "status">): StoredScan {
    const scans = this.getScans();
    const newScan: StoredScan = {
      ...scan,
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: verdictToStatus(scan.verdict),
    };
    scans.unshift(newScan);
    write(STORAGE_KEYS.scans, scans);
    return newScan;
  },

  updateScanStatus(id: string, status: StoredScan["status"], notes?: string): void {
    const scans = this.getScans();
    const index = scans.findIndex((s) => s.id === id);
    if (index === -1) return;
    scans[index] = { ...scans[index], status, internalNotes: notes ?? scans[index].internalNotes };
    write(STORAGE_KEYS.scans, scans);
  },

  updateScanNotes(id: string, notes: string): void {
    const scans = this.getScans();
    const index = scans.findIndex((s) => s.id === id);
    if (index === -1) return;
    scans[index] = { ...scans[index], internalNotes: notes };
    write(STORAGE_KEYS.scans, scans);
  },

  deleteScan(id: string): void {
    const scans = this.getScans().filter((s) => s.id !== id);
    write(STORAGE_KEYS.scans, scans);
  },

  getAuditLog(): AuditEntry[] {
    const stored = read<AuditEntry[]>(STORAGE_KEYS.audit, []);
    return stored.length === 0 ? MOCK_AUDIT : stored;
  },

  addAuditEntry(entry: Omit<AuditEntry, "id" | "timestamp">): void {
    const log = this.getAuditLog();
    log.unshift({ ...entry, id: generateId(), timestamp: new Date().toISOString() });
    write(STORAGE_KEYS.audit, log);
  },

  getSettings(): AdminSettings {
    return read<AdminSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  },

  updateSettings(settings: AdminSettings): void {
    write(STORAGE_KEYS.settings, settings);
  },

  resetSettings(): void {
    write(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  },

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    });
  },

  isAuthenticated(): boolean {
    return !!read<string>(STORAGE_KEYS.auth, "");
  },

  authenticate(token: string): boolean {
    const expected = process.env.NEXT_PUBLIC_ADMIN_TOKEN;
    if (!expected || token !== expected) return false;
    write(STORAGE_KEYS.auth, token);
    this.addAuditEntry({ action: "Login", adminEmail: "admin@dealscan.dev", details: "Admin user logged in." });
    return true;
  },

  logout(): void {
    this.addAuditEntry({ action: "Logout", adminEmail: "admin@dealscan.dev", details: "Admin user logged out." });
    try {
      localStorage.removeItem(STORAGE_KEYS.auth);
    } catch {
      /* ignore */
    }
  },
};
