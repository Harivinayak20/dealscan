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
