import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Cloud,
  ExternalLink,
  FileText,
  GitBranch,
  KeyRound,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const liveChecks = [
  { label: "Homepage", target: "https://dealscan.pages.dev/", status: "200" },
  { label: "Pricing", target: "https://dealscan.pages.dev/pricing", status: "200" },
  { label: "Privacy", target: "https://dealscan.pages.dev/privacy", status: "200" },
  { label: "VIN API", target: "https://dealscan.pages.dev/api/decode-vin", status: "200" },
];

const recoverySteps = [
  "Check the GitHub Cloudflare Pages check on the latest main commit.",
  "Use Cloudflare account 1958f1c605fb709bca15586dd8263076 when the dashboard looks unauthorized.",
  "Read the Pages project and deployment logs through the Cloudflare API.",
  "Run npx @cloudflare/next-on-pages@1 locally before pushing a recovery commit.",
  "Verify /, /pricing, /privacy, and /api/decode-vin after Cloudflare reports success.",
];

const commands = [
  "gh api repos/Harivinayak20/dealscan/commits/main/check-runs --jq '.check_runs[] | {name,status,conclusion,details_url,summary:.output.summary}'",
  "npx @cloudflare/next-on-pages@1",
  "npm run typecheck",
  "npm run lint",
  "npm test",
];

export const metadata = {
  title: "Deployment Dashboard | Dealscan",
  description: "Dealscan deployment recovery status, evidence, and runbook links.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DeploymentDashboardPage() {
  return (
    <main className="min-h-screen bg-[rgba(244,240,232,0.94)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(32,40,35,0.10)] pb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-black text-neutral-700 transition hover:-translate-y-0.5 hover:border-[var(--champagne)] hover:shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Analyzer
          </Link>
          <div className="text-right">
            <p className="text-sm font-black uppercase text-[var(--racing-green)]">Ops</p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Deployment Dashboard</h1>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatusCard icon={Cloud} label="Production" value="dealscan.pages.dev" note="Cloudflare Pages" />
          <StatusCard icon={GitBranch} label="GitHub Source" value="main" note="Harivinayak20/dealscan" />
          <StatusCard icon={CheckCircle2} label="Latest Deploy" value="f24e13a" note="Cloudflare check passed" />
          <StatusCard icon={KeyRound} label="Account ID" value="1958f1c..." note="Use for recovery" />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card-elevated">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[rgba(18,61,51,0.10)]">
                <Activity className="h-5 w-5 text-[var(--racing-green)]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black">Live Verification</h2>
                <p className="text-sm text-neutral-500">Last recorded after deployment `ec3b2457` succeeded.</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {liveChecks.map((check) => (
                <a
                  key={check.target}
                  href={check.target}
                  className="flex items-center justify-between gap-4 rounded-lg border border-[rgba(32,40,35,0.08)] bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:border-[var(--champagne)] hover:shadow-sm"
                >
                  <span>
                    <span className="block text-sm font-black">{check.label}</span>
                    <span className="block break-all text-xs text-neutral-500">{check.target}</span>
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(124,169,130,0.18)] px-3 py-1 text-xs font-black text-[var(--racing-green)]">
                    {check.status}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="card-elevated">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[rgba(201,168,106,0.14)]">
                <ShieldAlert className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black">Do Not Do</h2>
                <p className="text-sm text-neutral-500">Avoid these unless explicitly approved.</p>
              </div>
            </div>
            <ul className="mt-5 space-y-3 text-sm font-bold text-neutral-700">
              <li>Do not delete the Pages project.</li>
              <li>Do not create or name a new domain.</li>
              <li>Do not uninstall the Cloudflare GitHub app.</li>
              <li>Do not assume an unauthorized dashboard means the site is gone.</li>
            </ul>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="card-elevated">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[var(--racing-green)]" aria-hidden="true" />
              <h2 className="text-xl font-black">Recovery Steps</h2>
            </div>
            <ol className="mt-5 space-y-3">
              {recoverySteps.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm text-neutral-700">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--racing-green)] text-xs font-black text-white">
                    {index + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="card-elevated">
            <div className="flex items-center gap-3">
              <Terminal className="h-5 w-5 text-[var(--racing-green)]" aria-hidden="true" />
              <h2 className="text-xl font-black">Known Commands</h2>
            </div>
            <div className="mt-5 space-y-3">
              {commands.map((command) => (
                <code
                  key={command}
                  className="block overflow-x-auto rounded-lg border border-[rgba(32,40,35,0.08)] bg-[var(--graphite)] px-4 py-3 text-xs font-bold text-[var(--ivory)]"
                >
                  {command}
                </code>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 card-elevated">
          <h2 className="text-xl font-black">Docs</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <DocLink href="/docs/cloudflare-recovery-runbook.md" label="Cloudflare Recovery Runbook" />
            <DocLink href="/docs/deployment-evidence-log.md" label="Deployment Evidence Log" />
          </div>
          <p className="mt-4 text-sm text-neutral-500">
            These markdown files also live in the repo under `docs/` for source control review.
          </p>
        </section>
      </div>
    </main>
  );
}

function StatusCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="card-elevated">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[rgba(201,168,106,0.12)]">
          <Icon className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-black uppercase text-neutral-500">{label}</div>
          <div className="truncate text-lg font-black">{value}</div>
          <div className="text-xs text-neutral-500">{note}</div>
        </div>
      </div>
    </div>
  );
}

function DocLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="flex items-center justify-between gap-3 rounded-lg border border-[rgba(32,40,35,0.08)] bg-white px-4 py-3 text-sm font-black transition hover:-translate-y-0.5 hover:border-[var(--champagne)] hover:shadow-sm"
    >
      {label}
      <ExternalLink className="h-4 w-4 text-neutral-400" aria-hidden="true" />
    </a>
  );
}
