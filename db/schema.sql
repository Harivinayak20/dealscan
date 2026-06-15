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
