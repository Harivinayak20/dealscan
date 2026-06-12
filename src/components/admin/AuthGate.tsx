"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { adminStore } from "@/lib/admin-store";
import { CarFront, ShieldAlert } from "lucide-react";

type AuthGateProps = {
  children: ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetch("/api/admin/session")
      .then((res) => res.json() as Promise<{ authenticated?: boolean }>)
      .then((data) => {
        if (isMounted) setAuthenticated(Boolean(data.authenticated));
      })
      .catch(() => {
        if (isMounted) setAuthenticated(false);
      })
      .finally(() => {
        if (isMounted) setCheckingSession(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token.trim()) {
      setError("Enter the admin token.");
      return;
    }

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Invalid token.");
        return;
      }

      adminStore.addAuditEntry({ action: "Login", adminEmail: "admin@dealscan.dev", details: "Admin user logged in." });
      setAuthenticated(true);
    } catch {
      setError("Admin login failed. Try again.");
    }
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[rgba(244,240,232,0.94)] px-4">
        <div className="text-sm font-bold text-[var(--text-body)]">Checking admin session...</div>
      </div>
    );
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgba(244,240,232,0.94)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-[var(--graphite)]">
            <CarFront className="h-7 w-7 text-[var(--champagne)]" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-[var(--graphite)]">Dealscan Admin</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">Enter your admin token to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          <div>
            <label htmlFor="admin-token" className="sr-only">Admin token</label>
            <input
              id="admin-token"
              type="password"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setError("");
              }}
              placeholder="Admin token"
              className="min-h-12 w-full rounded-xl border border-[var(--border-subtle)] bg-neutral-50 px-4 text-base text-[var(--graphite)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--champagne)] focus:ring-2 focus:ring-[rgba(201,168,106,0.20)]"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-[rgba(196,90,74,0.28)] bg-[rgba(196,90,74,0.08)] px-3 py-2 text-sm text-[var(--danger)]" role="alert">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="min-h-12 w-full rounded-full bg-[var(--graphite)] text-base font-black text-white transition hover:bg-[var(--charcoal)]"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
          Set <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-bold">ADMIN_TOKEN</code> in your server environment.
        </p>
      </div>
    </div>
  );
}
