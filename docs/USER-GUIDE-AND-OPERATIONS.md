<!--
  ============================================================
  PROTECTED DOCUMENT - DO NOT DELETE
  This file is the canonical end-to-end documentation for
  Dealscan.dev. AI agents and tools MUST NOT delete this file
  and MUST NOT edit it without explicit permission from the
  owner (Hari Vinayak). Additions require approval. If a change
  is needed, propose it first and wait for confirmation.
  ============================================================
-->

# Dealscan.dev — User Guide and Operations Manual

Last verified: 2026-06-11
Owner: Hari Vinayak (harivinayak20402@gmail.com / hari.vinayak.d@gmail.com)

This is the single source of truth for how Dealscan is set up, how to log in everywhere, how to deploy, and how to recover. Keep it updated when infrastructure changes.

---

## 1. What the product is

Dealscan is a used-car listing analyzer at **https://dealscan.dev**. A buyer pastes a listing URL, listing text, a screenshot, or manual details, and gets a 0-100 deal score, verdict, fair-value range, red/green flags, missing-info checklist, seller questions, and negotiation guidance. It can compare two listings side by side and save scan history locally in the browser.

---

## 2. Accounts and logins

| What | Where | Credential |
|---|---|---|
| Domain registrar + DNS + hosting | Cloudflare dashboard (https://dash.cloudflare.com) | Google login: hari.vinayak.d@gmail.com. Account ID: `0c34d4ab35addb02483d16b665cc06af` |
| Code repository | https://github.com/Harivinayak20/dealscan | GitHub account Harivinayak20 |
| Wrangler CLI | local terminal | `npx wrangler login` (OAuth in browser, already logged in on this Mac). Check with `npx wrangler whoami` |
| Site admin panel | https://dealscan.dev/admin | Token login. The token is the `ADMIN_TOKEN` value in the local `.env.local` file (never commit it). It must also be set as a Worker secret in production: `npx wrangler secret put ADMIN_TOKEN` |
| Groq (AI analysis API) | https://console.groq.com | The API key is `GROQ_API_KEY` in `.env.local`; set in production with `npx wrangler secret put GROQ_API_KEY` |

Secrets live in `.env.local` (gitignored). Never paste their values into docs, commits, or chat.

---

## 3. Domain and email

- Domain: **dealscan.dev**, purchased 2026-06-11, registered and DNS-hosted at Cloudflare.
- The Worker is attached to two custom domains: `dealscan.dev` and `www.dealscan.dev` (declared in `wrangler.jsonc` under `routes`, applied automatically on every deploy).
- Old URL `dealscan.pages.dev` is deprecated; all code now references dealscan.dev.
- Contact email everywhere in the app is **hello@dealscan.dev**. Set up Cloudflare Email Routing (dashboard -> dealscan.dev zone -> Email -> Email Routing) to forward it to a real inbox. Until that is done, mail to that address bounces.

---

## 4. Tech stack and hosting

- Next.js 16 (App Router) + React 19 + Tailwind 4 + TypeScript.
- Deployed to **Cloudflare Workers** via `@opennextjs/cloudflare` (config: `wrangler.jsonc`, worker name `dealscan`).
- Remotion is used to render marketing/UGC videos (`src/remotion/`), not part of the website build.
- AI analysis uses Groq (`AI_PROVIDER`, `GROQ_API_KEY`, `GROQ_MODEL` env vars) with a local heuristic analyzer as fallback (`src/lib/local-analyzer.ts`).

Key directories:
- `src/app/` — pages and API routes (analyzer home, /guides, /pricing, /about, /contact, /admin, /api/*).
- `src/components/` — UI components; `AnalyzerApp.tsx` is the main app.
- `src/lib/` — scoring, scraping, pricing, guides content (`guides.ts`).
- `docs/` — this manual plus runbooks.

---

## 5. How to run locally

```bash
cd "~/Codex/Car IQ"
npm install
npm run dev          # http://localhost:3000
```

Required `.env.local` keys: `AI_PROVIDER`, `GROQ_API_KEY`, `GROQ_MODEL`, `NEXT_PUBLIC_APP_URL=https://dealscan.dev`, `ADMIN_TOKEN`.

Quality gates before any deploy:

```bash
npm run typecheck
npm run lint
npm test
```

---

## 6. How to deploy (upload changes to the live site)

Two ways. Keep them consistent: always commit and push what you deployed.

**A. Local deploy (fastest):**
```bash
npm run deploy
```
This builds with opennextjs-cloudflare and uploads the Worker plus assets, and re-attaches the custom domains. Requires wrangler login.

**B. Git push (CI):** pushing to `main` on GitHub triggers Cloudflare Workers Builds, which builds and deploys the repo content. Warning: if you deployed locally but did not push, a later CI run will overwrite the live site with the older repo code. **Rule: after every local deploy, commit and push.**

Verify after deploy:
```bash
curl -sI https://dealscan.dev/ | head -1          # expect 200
curl -sI https://dealscan.dev/sitemap.xml | head -1
```

Rollback: `npx wrangler rollback` or Cloudflare dashboard -> Workers -> dealscan -> Deployments.

---

## 7. Admin panel

- URL: https://dealscan.dev/admin (login, scans list, scan detail, settings, audit log).
- Login is a token gate (`/api/admin/login` checks `ADMIN_TOKEN`).
- `/admin` and `/api` are disallowed in robots.txt and excluded from the sitemap.

---

## 8. Content / SEO setup

- Blog guides live in `src/lib/guides.ts` as a typed array (14 guides as of 2026-06-11). To add a blog post, append a new object (slug, title, description, readTime, updatedAt, quickChecks, sections) — it automatically appears on /guides, gets its own page, Article JSON-LD, the "Keep reading" related-guides block, and a sitemap entry.
- Sitemap: `src/app/sitemap.ts` (auto-includes all guides). Robots: `src/app/robots.ts`.
- Canonical base URL comes from `NEXT_PUBLIC_APP_URL`.
- TODO: add dealscan.dev to Google Search Console and submit https://dealscan.dev/sitemap.xml.
- AdSense: components exist (`AdUnit`, `AdSenseScript`, `ads.txt`); see `docs/ads-readiness.md`.

---

## 9. Recovery and runbooks

- Cloudflare recovery steps: `docs/cloudflare-recovery-runbook.md` (note: it may reference the old Pages setup; the current production is a Worker named `dealscan`).
- Deployment history/evidence: `docs/deployment-evidence-log.md`.
- If the site is down: check Cloudflare dashboard Worker status, then `npx wrangler deployments list`, then redeploy from a known-good commit with `npm run deploy`.

---

## 10. Change log of this setup

- 2026-06-11: Bought dealscan.dev, attached custom domains to the Worker, rebranded all URLs/emails from dealscan.pages.dev to dealscan.dev, removed the public /deployment-dashboard page, added 5 new guides (14 total) and the related-guides section, deployed and verified live.
