"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { adminStore } from "@/lib/admin-store";
import { CarFront, ShieldAlert } from "lucide-react";

type AuthGateProps = {
  children: ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const [authenticated, setAuthenticated] = useState(() => adminStore.isAuthenticated());
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token.trim()) {
      setError("Enter the admin token.");
      return;
    }

    const success = adminStore.authenticate(token.trim());
    if (success) {
      document.cookie = `admin_token=${encodeURIComponent(token.trim())}; path=/; max-age=86400; SameSite=Lax`;
      setAuthenticated(true);
    } else {
      setError("Invalid token. Check your ADMIN_TOKEN environment variable.");
    }
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgba(244,240,232,0.94)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-[var(--graphite)]">
            <CarFront className="h-7 w-7 text-[var(--champagne)]" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-[var(--graphite)]">Dealscan Admin</h1>
          <p className="mt-2 text-sm leading-6 text-neutral-600">Enter your admin token to continue.</p>
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
              className="min-h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-base text-[var(--graphite)] outline-none placeholder:text-neutral-500 focus:border-[var(--champagne)] focus:ring-2 focus:ring-[rgba(201,168,106,0.20)]"
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

        <p className="mt-6 text-center text-xs text-neutral-500">
          Set <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-bold">NEXT_PUBLIC_ADMIN_TOKEN</code> in your environment.
        </p>
      </div>
    </div>
  );
}
