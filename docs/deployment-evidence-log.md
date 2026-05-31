# Deployment Evidence Log

This file records the recovery evidence for `dealscan.pages.dev` so the deployment path is auditable.

## Latest Verified Recovery

| Field | Evidence |
| --- | --- |
| Date checked | 2026-05-31 UTC |
| Production URL | `https://dealscan.pages.dev` |
| Cloudflare account ID | `1958f1c605fb709bca15586dd8263076` |
| Cloudflare project | `dealscan` |
| GitHub repo | `Harivinayak20/dealscan` |
| Production branch | `main` |
| Successful deployment ID | `ec3b2457-d0cd-47c1-86e9-f3e3c78d5d5f` |
| Successful preview URL | `https://ec3b2457.dealscan.pages.dev` |
| Latest commit deployed | `f24e13a` |
| Commit message | `Fix production metadata URL` |
| Deployment trigger | `github:push` |
| GitHub check | `Cloudflare Pages`, `success` |

## Recovery Timeline

| Time UTC | Event |
| --- | --- |
| 2026-05-31 00:59 | Commit `9e24d64` triggered Cloudflare Pages deployment `6721a357-7574-421e-b658-40af8d0614d5`. |
| 2026-05-31 01:02 | Deployment `6721a357` succeeded and restored `dealscan.pages.dev` to the latest app code. |
| 2026-05-31 01:06 | Commit `f24e13a` triggered Cloudflare Pages deployment `ec3b2457-d0cd-47c1-86e9-f3e3c78d5d5f`. |
| 2026-05-31 01:09 | Deployment `ec3b2457` succeeded. |

## Cloudflare Project Evidence

The Cloudflare Pages project reports:

```text
name: dealscan
subdomain: dealscan.pages.dev
domains: dealscan.pages.dev
source: github
owner: Harivinayak20
repo_name: dealscan
production_branch: main
build_command: npx @cloudflare/next-on-pages@1
destination_dir: .vercel/output/static
compatibility_date: 2026-05-11
compatibility_flags: nodejs_compat
```

## Verified Live Routes

```text
GET https://dealscan.pages.dev/ -> 200
GET https://dealscan.pages.dev/pricing -> 200
GET https://dealscan.pages.dev/privacy -> 200
POST https://dealscan.pages.dev/api/decode-vin -> 200
```

The VIN test used `1HGCM82633A004352` and returned a `2003 HONDA Accord EX-V6` result.

## Local Validation Commands

```bash
npm run typecheck
npm run lint
npm test
npx @cloudflare/next-on-pages@1
```

Observed result:

```text
typecheck: passed
lint: passed
tests: 65/65 passed
Cloudflare Pages build: passed
```

## Important Notes

- The old Pages dashboard URL can show unauthorized in the browser if the visible Cloudflare login is not a member of account `1958f1c605fb709bca15586dd8263076`.
- GitHub can still be correctly connected even when the dashboard is not visible through the current Cloudflare web session.
- The Cloudflare connector/API is the reliable source of truth for this recovery path when it is scoped to account `1958f1c605fb709bca15586dd8263076`.
- No new domain was created during this recovery.

