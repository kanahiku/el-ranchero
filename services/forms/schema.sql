CREATE TABLE IF NOT EXISTS sites (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  notify_email TEXT NOT NULL,
  from_email TEXT NOT NULL,
  from_name TEXT NOT NULL,
  allowed_origins TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  site_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL,
  email_sent_at TEXT,
  FOREIGN KEY (site_slug) REFERENCES sites(slug)
);

CREATE INDEX IF NOT EXISTS leads_site_created ON leads (site_slug, created_at DESC);
CREATE INDEX IF NOT EXISTS leads_site_email_sent ON leads (site_slug, email_sent_at);

-- Rate-limit check-up PDF emails. Does not store the PDF or quiz answers.
CREATE TABLE IF NOT EXISTS outbound_sends (
  id TEXT PRIMARY KEY,
  site_slug TEXT NOT NULL,
  kind TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (site_slug) REFERENCES sites(slug)
);

CREATE INDEX IF NOT EXISTS outbound_sends_site_kind_created ON outbound_sends (site_slug, kind, created_at);
