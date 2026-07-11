-- DealScan first-party analytics (cookieless). Safe to re-run.

-- Every tracked interaction.
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,            -- unix epoch ms
  day TEXT NOT NULL,              -- YYYY-MM-DD (UTC) for fast grouping
  type TEXT NOT NULL,            -- pageview | scan_started | scan_completed | affiliate_click | error
  path TEXT,                     -- page path (no query string)
  referrer_host TEXT,            -- source host only, never the full URL
  session TEXT,                  -- random per-session id (sessionStorage), not persistent, no PII
  meta TEXT                      -- JSON: { partner, message, ... }
);
CREATE INDEX IF NOT EXISTS idx_events_day ON events(day);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_ts ON events(ts);

-- Listing memory: one row per unique listing (keyed by VIN, else source-URL hash).
-- Powers days-since-first-scanned, price-drop detection, and market-context stats.
-- No PII: only vehicle facts observed in the public listing itself.
CREATE TABLE IF NOT EXISTS listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_key TEXT NOT NULL UNIQUE,  -- "vin:<VIN>" or "url:<sha256 of normalized URL>"
  vin TEXT,
  vehicle_title TEXT,
  year INTEGER,
  make TEXT,
  model TEXT,
  mileage INTEGER,
  price INTEGER,                     -- latest observed asking price (whole dollars)
  first_price INTEGER,               -- asking price at first scan
  first_seen INTEGER NOT NULL,       -- unix epoch ms
  last_seen INTEGER NOT NULL,
  scan_count INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_listings_vin ON listings(vin);
CREATE INDEX IF NOT EXISTS idx_listings_vehicle ON listings(make, model, year);
CREATE INDEX IF NOT EXISTS idx_listings_last_seen ON listings(last_seen);

-- Every observation of a listing over time (price history).
CREATE TABLE IF NOT EXISTS listing_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_key TEXT NOT NULL,
  ts INTEGER NOT NULL,
  price INTEGER,
  mileage INTEGER
);
CREATE INDEX IF NOT EXISTS idx_snapshots_key_ts ON listing_snapshots(listing_key, ts);

-- Watch subscriptions: opt-in email alerts for a specific listing.
-- Email is stored ONLY for sending the alerts the user asked for.
CREATE TABLE IF NOT EXISTS watches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL UNIQUE,        -- unsubscribe/manage token
  email TEXT NOT NULL,
  listing_url TEXT,                  -- re-checkable source URL (validated public http/https)
  listing_key TEXT,                  -- join key into listings when known
  vehicle_title TEXT,
  last_price INTEGER,                -- last observed asking price
  status TEXT NOT NULL DEFAULT 'active', -- active | ended
  ended_reason TEXT,                 -- unsubscribed | listing_gone | error
  created_at INTEGER NOT NULL,
  last_checked INTEGER,
  last_alert INTEGER
);
CREATE INDEX IF NOT EXISTS idx_watches_status ON watches(status);
CREATE INDEX IF NOT EXISTS idx_watches_email ON watches(email);

-- DealScan Pro membership (Stripe-backed). Row per paying email.
CREATE TABLE IF NOT EXISTS pro_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  plan TEXT,                          -- weekly | monthly
  current_period_end INTEGER,         -- unix epoch ms; entitled while in the future
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_pro_members_email ON pro_members(email);

-- Pro waitlist while Stripe isn't configured yet.
CREATE TABLE IF NOT EXISTS pro_waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);

-- Newsletter/email-alert signups (footer + guide-page capture form).
-- Sending stays off until the list is large enough and the owner approves.
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  source TEXT,                   -- footer | guide
  unsubscribed_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_subscribers_created ON subscribers(created_at);

-- Denormalized completed scans for product analytics.
CREATE TABLE IF NOT EXISTS scans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  day TEXT NOT NULL,
  vehicle_title TEXT,
  score INTEGER,
  verdict TEXT,                  -- good_deal | risky_deal | avoid
  confidence TEXT,               -- High | Medium | Low
  input_type TEXT,               -- url | text | screenshot | manual
  source TEXT                    -- groq | local
);
CREATE INDEX IF NOT EXISTS idx_scans_day ON scans(day);
CREATE INDEX IF NOT EXISTS idx_scans_verdict ON scans(verdict);
