# Cloudflare Pages Recovery Runbook

Use this when `dealscan.pages.dev` is live but Cloudflare dashboard access, GitHub auth, or deployment visibility looks broken.

## Current Known Setup

| Item | Value |
| --- | --- |
| Production URL | `https://dealscan.pages.dev` |
| Deployment dashboard | `https://dealscan.pages.dev/deployment-dashboard` |
| Cloudflare account ID | `1958f1c605fb709bca15586dd8263076` |
| Cloudflare Pages project | `dealscan` |
| GitHub repo | `Harivinayak20/dealscan` |
| Production branch | `main` |
| Build command | `npx @cloudflare/next-on-pages@1` |
| Output directory | `.vercel/output/static` |
| Compatibility flag | `nodejs_compat` |
| Required env var | `NEXT_PUBLIC_APP_URL=https://dealscan.pages.dev` |
| Optional env vars | `AI_PROVIDER`, `GROQ_API_KEY`, `ADMIN_TOKEN` |

## Dashboard Access

The deployment dashboard is protected by the same server-side `ADMIN_TOKEN` cookie used for `/admin`.

- Anonymous users should be redirected to `/admin`.
- If `ADMIN_TOKEN` is missing in Cloudflare Pages, nobody can access the protected dashboard.
- To grant access, set `ADMIN_TOKEN` in Cloudflare Pages production and preview environment variables, then sign in through `/admin`.
- Do not paste the admin token into source files, docs, screenshots, tickets, or commit messages.
- Recovery markdown files live in the repo under `docs/` and are not served as public `/docs/*` files.

## What Failed Before

The site stayed online, but it served old code because the old Cloudflare Pages project was not visible in the Cloudflare dashboard for the account that Wrangler was logged into. GitHub still had the Cloudflare Workers and Pages app installed, and pushes still triggered Cloudflare Pages checks.

The real project lived under Cloudflare account `1958f1c605fb709bca15586dd8263076`, while Wrangler was logged into a different account. The fix was to use the Cloudflare connector/API scoped to the old account, restore the Pages runtime config, push to `main`, then verify the Cloudflare Pages check and live routes.

## First Response Checklist

1. Confirm GitHub has the newest commit:

```bash
git status --short
git log --oneline -3
git push origin main
```

2. Confirm the GitHub check for Cloudflare Pages:

```bash
gh api repos/Harivinayak20/dealscan/commits/main/check-runs --jq '.check_runs[] | {name,status,conclusion,details_url,summary:.output.summary}'
```

3. Confirm the Cloudflare Pages project through the Cloudflare API:

```js
async () => {
  return cloudflare.request({
    method: "GET",
    path: `/accounts/${accountId}/pages/projects/dealscan`
  });
}
```

4. Confirm the latest deployment:

```js
async () => {
  return cloudflare.request({
    method: "GET",
    path: `/accounts/${accountId}/pages/projects/dealscan/deployments`,
    query: { per_page: 3 }
  });
}
```

5. Confirm live routes:

```bash
curl -sS -o /tmp/dealscan-home.html -w '%{http_code}\n' https://dealscan.pages.dev
curl -sS -o /tmp/dealscan-pricing.html -w '%{http_code}\n' https://dealscan.pages.dev/pricing
curl -sS -o /tmp/dealscan-privacy.html -w '%{http_code}\n' https://dealscan.pages.dev/privacy
curl -sS -o /tmp/dealscan-api.json -w '%{http_code}\n' -X POST -H 'Content-Type: application/json' --data '{"vin":"1HGCM82633A004352"}' https://dealscan.pages.dev/api/decode-vin
```

## If GitHub Pushes Do Not Trigger Cloudflare

1. Check GitHub app installation:
   - GitHub settings path: `https://github.com/settings/installations`
   - App name: `Cloudflare Workers and Pages`
   - Repo access should include `Harivinayak20/dealscan`.

2. Reconnect source only if needed:
   - Cloudflare Pages project: `dealscan`
   - Source: GitHub
   - Owner: `Harivinayak20`
   - Repo: `dealscan`
   - Branch: `main`

3. Do not create or rename a new domain unless the owner explicitly approves it.

## If Cloudflare Dashboard Says Unauthorized

1. Do not assume the project is gone.
2. Check the GitHub Cloudflare Pages check details URL. If it contains `/1958f1c605fb709bca15586dd8263076/pages/view/dealscan/...`, the project is still in the old account.
3. Use the Cloudflare connector/API scoped to account `1958f1c605fb709bca15586dd8263076`.
4. If no API access is available, request access to that exact Cloudflare account or ask the owner to invite the current login to the account.

## If The Build Fails

1. Run the Cloudflare Pages build locally:

```bash
npx @cloudflare/next-on-pages@1
```

2. The legacy Pages build requires Edge runtime exports on API routes and dynamic server pages. If those are removed, Pages can fail even if the OpenNext Worker build works.

3. Pull Cloudflare deployment logs:

```js
async () => {
  return cloudflare.request({
    method: "GET",
    path: `/accounts/${accountId}/pages/projects/dealscan/deployments/DEPLOYMENT_ID/history/logs`
  });
}
```

4. Fix the smallest build issue, then run:

```bash
npm run typecheck
npm run lint
npm test
npx @cloudflare/next-on-pages@1
git push origin main
```

## Do Not Do Without Explicit Approval

- Do not delete the Cloudflare Pages project.
- Do not create a new Cloudflare Pages project.
- Do not create, rename, or assign a new domain.
- Do not uninstall or suspend the GitHub Cloudflare app.
- Do not remove `dealscan.pages.dev` unless the owner explicitly asks for takedown.
