# Dealscan Admin Dashboard

## Overview

The admin dashboard provides monitoring, management, and configuration for the Dealscan platform. It is accessible at `/admin` and is fully client-side with localStorage persistence — no paid services required.

## Architecture

```
/admin ──────────────────────────────────────────────
├── /admin                Dashboard overview (metrics + recent scans)
├── /admin/scans          Full scans table with search/filter
├── /admin/scans/[id]     Individual scan detail + internal review
├── /admin/settings       Scoring thresholds, affiliate links, feature flags
└── /admin/audit          Audit log of admin actions
```

### Data Layer

| Storage | Purpose | Upgrade Path |
|---------|---------|--------------|
| `localStorage` | Scans, audit log, settings, auth token | Supabase / Cloudflare D1 / Upstash |
| In-memory cache | API response deduplication (existing) | Cloudflare KV |
| Mock data | Demo scans + audit entries (shown when empty) | Remove when real data flows |

### Auth

- **Free tier**: `NEXT_PUBLIC_ADMIN_TOKEN` environment variable
- Admin enters token on first visit → stored in `localStorage`
- **Upgrade path**: Replace `AuthGate` with Supabase Auth, Clerk, or NextAuth.js

## Setup

### 1. Set the admin token

```bash
# In .env.local
NEXT_PUBLIC_ADMIN_TOKEN=your-secret-admin-token
```

### 2. Start the app

```bash
npm run dev
```

### 3. Access the dashboard

Open `http://localhost:3000/admin` and enter your admin token.

## Features

### Dashboard
- Total scans, average score, needs-attention count, high-confidence rate
- Preview of recent scans table

### Deal Scans
- Full table with sortable columns (score, date, vehicle name)
- Search by vehicle, verdict, or listing text
- Color-coded scores and confidence indicators
- CSV export
- Delete scans
- Click "View" for full detail

### Scan Detail
- Vehicle info, score, verdict, status badge
- Listing text preview
- Internal review status dropdown
- Internal notes textarea
- Save changes → triggers audit log entry

### Settings
- **Scoring Thresholds**: Customize score ranges for Great Deal / Decent Deal / Caution / Red Flags
- **Affiliate Links**: Configure partner URLs for all buyer tools
- **Feature Flags**: Enable/disable Groq, URL extraction, screenshot OCR, waitlist signup
- Reset to defaults

### Audit Log
- Timestamped log of all admin actions (login, logout, status updates, settings changes)
- Useful for debugging and accountability

## API Reference

Admin pages use the `adminStore` module (`src/lib/admin-store.ts`):

```typescript
adminStore.getScans()                    // StoredScan[]
adminStore.getScan(id)                   // StoredScan | undefined
adminStore.addScan(scan)                 // StoredScan
adminStore.updateScanStatus(id, status)  // void
adminStore.updateScanNotes(id, notes)    // void
adminStore.deleteScan(id)                // void
adminStore.getAuditLog()                 // AuditEntry[]
adminStore.addAuditEntry(entry)          // void
adminStore.getSettings()                 // AdminSettings
adminStore.updateSettings(settings)      // void
adminStore.resetSettings()               // void
adminStore.isAuthenticated()             // boolean
adminStore.authenticate(token)           // boolean
adminStore.logout()                      // void
```

## Free-Tier Data Notes

- Scans are only saved to localStorage when `adminStore.addScan()` is called
- Currently, the analyzer does NOT automatically save scans to the admin store — this is by design to keep zero overhead
- Mock data (4 demo scans + 2 audit entries) is shown when localStorage is empty
- To connect a real database, swap the `adminStore` implementation — the interface stays the same

## Deploying

### Environment Variables (required for admin)

```
NEXT_PUBLIC_ADMIN_TOKEN=<your-admin-token>
```

### Cloudflare Pages

Add `NEXT_PUBLIC_ADMIN_TOKEN` to your Cloudflare Pages environment variables.

### Security Notes

- `NEXT_PUBLIC_ADMIN_TOKEN` is prefixed with `NEXT_PUBLIC_` because the auth check happens client-side
- This is acceptable for the free tier — the token gates the admin UI, not sensitive server data
- For production with real user data, switch to server-side auth (Supabase Auth, Clerk, etc.)
- Admin pages have `robots: { index: false, follow: false }` to prevent search indexing
