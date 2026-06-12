"use client";

import { useState } from "react";
import { adminStore } from "@/lib/admin-store";
import type { AdminSettings } from "@/lib/admin-types";
import { DEFAULT_SETTINGS } from "@/lib/admin-types";
import { RotateCcw, Save, Settings as SettingsIcon } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>(() => adminStore.getSettings());
  const [saved, setSaved] = useState(false);

  function updateThreshold(field: keyof AdminSettings["scoringThresholds"], value: number) {
    setSettings((s) => ({
      ...s,
      scoringThresholds: { ...s.scoringThresholds, [field]: value },
    }));
  }

  function updateAffiliate(field: keyof AdminSettings["affiliateLinks"], value: string) {
    setSettings((s) => ({
      ...s,
      affiliateLinks: { ...s.affiliateLinks, [field]: value },
    }));
  }

  function toggleFlag(field: keyof AdminSettings["featureFlags"]) {
    setSettings((s) => ({
      ...s,
      featureFlags: { ...s.featureFlags, [field]: !s.featureFlags[field] },
    }));
  }

  function handleSave() {
    adminStore.updateSettings(settings);
    adminStore.addAuditEntry({
      action: "Settings Update",
      adminEmail: "admin@dealscan.dev",
      details: "Admin settings were updated.",
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    setSettings(DEFAULT_SETTINGS);
    adminStore.resetSettings();
    adminStore.addAuditEntry({
      action: "Settings Reset",
      adminEmail: "admin@dealscan.dev",
      details: "Settings reset to defaults.",
    });
  }

  return (
    <div className="grid max-w-3xl gap-8">
      <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-[var(--champagne)]" aria-hidden="true" />
          <h2 className="text-xl font-black text-[var(--graphite)]">Scoring Thresholds</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
          Customize the score ranges that determine each verdict level.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {([
            { key: "greatDealMin", label: "Great Deal (min)", defaultValue: 85 },
            { key: "decentDealMin", label: "Decent Deal (min)", defaultValue: 70 },
            { key: "cautionMin", label: "Caution (min)", defaultValue: 55 },
            { key: "redFlagsMin", label: "Red Flags (min)", defaultValue: 40 },
          ] as const).map(({ key, label }) => (
            <label key={key} className="grid gap-1 text-sm font-bold text-[var(--text-body)]">
              {label}
              <input
                type="number"
                min={0}
                max={100}
                value={settings.scoringThresholds[key]}
                onChange={(e) => updateThreshold(key, Number(e.target.value))}
                className="min-h-11 rounded-xl border border-[var(--border-subtle)] bg-[var(--paper)] px-3 text-base text-[var(--graphite)] outline-none focus:border-[var(--champagne)] focus:ring-2 focus:ring-[rgba(201,168,106,0.20)]"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-[var(--champagne)]" aria-hidden="true" />
          <h2 className="text-xl font-black text-[var(--graphite)]">Affiliate Links</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
          Configure outbound partner URLs for buyer tools.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {([
            { key: "carfax", label: "CARFAX / History Report" },
            { key: "inspection", label: "Pre-Purchase Inspection" },
            { key: "insurance", label: "Insurance Quote" },
            { key: "payments", label: "Loan / Payment Calculator" },
            { key: "obd", label: "OBD2 Scanner" },
            { key: "detailing", label: "Detailing Kit" },
          ] as const).map(({ key, label }) => (
            <label key={key} className="grid gap-1 text-sm font-bold text-[var(--text-body)]">
              {label}
              <input
                type="url"
                value={settings.affiliateLinks[key]}
                onChange={(e) => updateAffiliate(key, e.target.value)}
                className="min-h-11 rounded-xl border border-[var(--border-subtle)] bg-[var(--paper)] px-3 text-sm text-[var(--graphite)] outline-none focus:border-[var(--champagne)] focus:ring-2 focus:ring-[rgba(201,168,106,0.20)]"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-[var(--champagne)]" aria-hidden="true" />
          <h2 className="text-xl font-black text-[var(--graphite)]">Feature Flags</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
          Enable or disable platform features.
        </p>
        <div className="mt-5 grid gap-3">
          {([
            { key: "groqEnabled", label: "Groq AI Analysis" },
            { key: "urlExtractionEnabled", label: "URL Extraction" },
            { key: "screenshotOcrEnabled", label: "Screenshot OCR" },
          ] as const).map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3">
              <input
                type="checkbox"
                checked={settings.featureFlags[key]}
                onChange={() => toggleFlag(key)}
                className="h-5 w-5 rounded border-[var(--border-subtle)] text-[var(--champagne)] focus:ring-[var(--champagne)]"
              />
              <span className="text-sm font-bold text-[var(--graphite)]">{label}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleSave}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--graphite)] px-6 text-sm font-black text-white transition hover:bg-[var(--charcoal)]"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {saved ? "Saved!" : "Save Settings"}
        </button>
        <button
          onClick={handleReset}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--paper)] px-6 text-sm font-black text-[var(--text-body)] transition hover:border-[var(--danger)] hover:text-[var(--danger)]"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
