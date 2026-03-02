-- Table: public.filings

-- DROP TABLE IF EXISTS public.filings;

CREATE TABLE IF NOT EXISTS public.filings
(
    id bigint NOT NULL DEFAULT nextval('filings_id_seq'::regclass),
    company_id integer NOT NULL,
    submitted_by_officer_id bigint,
    type text COLLATE pg_catalog."default" NOT NULL,
    submitted_at timestamp without time zone NOT NULL DEFAULT now(),
    file_name text COLLATE pg_catalog."default" NOT NULL,
    file_mime text COLLATE pg_catalog."default" NOT NULL DEFAULT 'application/pdf'::text,
    file_size_bytes bigint NOT NULL,
    storage_key text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    CONSTRAINT filings_pkey PRIMARY KEY (id),
    CONSTRAINT filings_company_id_fkey FOREIGN KEY (company_id)
        REFERENCES public.companies (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT filings_submitted_by_fk FOREIGN KEY (submitted_by_officer_id, company_id)
        REFERENCES public.officers (id, company_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.filings
    OWNER to postgres;
-- Index: idx_filings_company_id

-- DROP INDEX IF EXISTS public.idx_filings_company_id;

CREATE INDEX IF NOT EXISTS idx_filings_company_id
    ON public.filings USING btree
    (company_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_filings_submitted_at

-- DROP INDEX IF EXISTS public.idx_filings_submitted_at;

CREATE INDEX IF NOT EXISTS idx_filings_submitted_at
    ON public.filings USING btree
    (submitted_at DESC NULLS FIRST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_filings_submitted_by

-- DROP INDEX IF EXISTS public.idx_filings_submitted_by;

CREATE INDEX IF NOT EXISTS idx_filings_submitted_by
    ON public.filings USING btree
    (submitted_by_officer_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;