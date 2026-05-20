"use client";

import { Play, Gauge, OctagonAlert, ShieldCheck } from "lucide-react";

export type DemoScenario = {
  id: string;
  label: string;
  tone: string;
  text: string;
  color: string;
  icon: typeof Play;
};

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "great",
    label: "Great Deal",
    tone: "Clean title · One owner · Service records",
    text: "2018 Toyota Camry LE, 72,000 miles, Austin, TX, clean title, one owner, service records available, new tires, recent maintenance, no accidents reported, cold AC, asking $15,900. VIN: 4T1G11AK1MU123456.",
    color: "#7ca982",
    icon: ShieldCheck,
  },
  {
    id: "risky",
    label: "Risky Deal",
    tone: "Title unclear · No service history",
    text: "2016 BMW 328i, 74,000 miles, Dallas, TX, title status unclear, limited photos, no service history, sold as-is, price is firm, asking $14,200. Check engine light intermittently on.",
    color: "#d6a84f",
    icon: Gauge,
  },
  {
    id: "scam",
    label: "Scam Alert",
    tone: "No title · Cash only · Red flags everywhere",
    text: "2009 Nissan Altima, 181,000 miles, Houston, TX, no title, runs rough, needs transmission work, cash only, as-is, no VIN provided, seller wants wire transfer deposit, asking $2,400 but will take $500 to hold it.",
    color: "#c45a4a",
    icon: OctagonAlert,
  },
];

export function DemoBanner({
  onSelect,
}: {
  onSelect: (text: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-[rgba(201,168,106,0.25)] bg-[rgba(201,168,106,0.06)] p-5 sm:p-6">
      <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[var(--champagne)]">
        <Play className="h-4 w-4" aria-hidden="true" />
        Try it yourself
      </div>
      <p className="mt-2 text-base leading-7 text-neutral-600">
        Click any scenario to run a full analysis instantly. No typing required.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {DEMO_SCENARIOS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.text)}
              className="group rounded-xl border-2 border-[rgba(11,13,16,0.10)] bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                  style={{ backgroundColor: `${s.color}18` }}
                >
                  <Icon className="h-5 w-5" style={{ color: s.color }} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-base font-black text-[var(--graphite)] group-hover:text-[var(--racing-green)]">{s.label}</div>
                  <div className="text-xs text-neutral-500">{s.tone}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { DEMO_SCENARIOS };
