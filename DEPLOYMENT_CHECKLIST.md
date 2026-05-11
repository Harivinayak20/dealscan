# Deployment Readiness Checklist

- [ ] `npm install` works.
- [ ] `npm run dev` works.
- [ ] `npm run build` works.
- [ ] API route works with `AI_PROVIDER=none`.
- [ ] API route falls back to local analysis when an optional provider key is missing.
- [ ] Optional AI provider path works when a supported key is present.
- [ ] No server secrets are exposed client-side.
- [ ] Vercel environment variables are added.
- [ ] No scraping functionality exists.
- [ ] README is complete.
- [ ] Affiliate URLs are placeholders or approved links.
- [ ] Disclaimers are visible in the UI.
- [ ] Screenshot flow clearly says OCR is not active yet.
- [ ] Market estimate copy labels values as rough estimates, not licensed valuations.
