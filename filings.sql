-- Filings table schema
-- Matches frontend/backend implementation for /filings pages

BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS officers_id_company_id_uidx
  ON officers (id, company_id);

CREATE TABLE IF NOT EXISTS filings (
  id BIGSERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL,
  officer_id INTEGER NULL,
  type TEXT NOT NULL,
  description TEXT NULL,
  document_name TEXT NOT NULL,
  document_path TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf',
  file_size_bytes INTEGER NOT NULL CHECK (file_size_bytes > 0),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT filings_type_not_blank CHECK (btrim(type) <> ''),
  CONSTRAINT filings_company_fk
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE RESTRICT,
  CONSTRAINT filings_officer_company_fk
    FOREIGN KEY (officer_id, company_id)
    REFERENCES officers(id, company_id)
    ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS filings_submitted_at_idx
  ON filings (submitted_at DESC);

CREATE INDEX IF NOT EXISTS filings_company_idx
  ON filings (company_id);

CREATE INDEX IF NOT EXISTS filings_type_idx
  ON filings (type);

COMMIT;
