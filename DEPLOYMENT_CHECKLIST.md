# Deployment Readiness Checklist

- [ ] `npm install` works.
- [ ] `npm run dev` works.
- [ ] `npm run build` works.
- [ ] `npm run test` works.
- [ ] API route returns a clear error when `GROQ_API_KEY` is missing.
- [ ] Groq analysis path works when `GROQ_API_KEY` is present.
- [ ] Screenshot OCR path works with `GROQ_API_KEY`.
- [ ] No server secrets are exposed client-side.
- [ ] Vercel environment variables are added.
- [ ] URL extraction blocks localhost and private-network targets.
- [ ] README is complete.
- [ ] Affiliate URLs are placeholders or approved links.
- [ ] Disclaimers are visible in the UI.
- [ ] Screenshot flow extracts text without requiring pasted text.
- [ ] Market estimate copy labels values as rough estimates, not licensed valuations.
