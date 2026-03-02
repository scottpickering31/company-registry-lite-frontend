-- Table: public.audit_logs

-- DROP TABLE IF EXISTS public.audit_logs;

CREATE TABLE IF NOT EXISTS public.audit_logs
(
    id bigint NOT NULL DEFAULT nextval('audit_logs_id_seq'::regclass),
    company_id integer NOT NULL,
    officer_id bigint,
    event audit_event_type NOT NULL,
    occurred_at timestamp without time zone NOT NULL DEFAULT now(),
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
    CONSTRAINT audit_logs_company_id_fkey FOREIGN KEY (company_id)
        REFERENCES public.companies (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT audit_logs_officer_id_fkey FOREIGN KEY (officer_id)
        REFERENCES public.officers (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.audit_logs
    OWNER to postgres;
-- Index: audit_logs_company_id_idx

-- DROP INDEX IF EXISTS public.audit_logs_company_id_idx;

CREATE INDEX IF NOT EXISTS audit_logs_company_id_idx
    ON public.audit_logs USING btree
    (company_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: audit_logs_occurred_at_idx

-- DROP INDEX IF EXISTS public.audit_logs_occurred_at_idx;

CREATE INDEX IF NOT EXISTS audit_logs_occurred_at_idx
    ON public.audit_logs USING btree
    (occurred_at DESC NULLS FIRST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: audit_logs_officer_id_idx

-- DROP INDEX IF EXISTS public.audit_logs_officer_id_idx;

CREATE INDEX IF NOT EXISTS audit_logs_officer_id_idx
    ON public.audit_logs USING btree
    (officer_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_audit_logs_company_id

-- DROP INDEX IF EXISTS public.idx_audit_logs_company_id;

CREATE INDEX IF NOT EXISTS idx_audit_logs_company_id
    ON public.audit_logs USING btree
    (company_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_audit_logs_event

-- DROP INDEX IF EXISTS public.idx_audit_logs_event;

CREATE INDEX IF NOT EXISTS idx_audit_logs_event
    ON public.audit_logs USING btree
    (event ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_audit_logs_metadata_gin

-- DROP INDEX IF EXISTS public.idx_audit_logs_metadata_gin;

CREATE INDEX IF NOT EXISTS idx_audit_logs_metadata_gin
    ON public.audit_logs USING gin
    (metadata)
    WITH (fastupdate=True, gin_pending_list_limit=4194304)
    TABLESPACE pg_default;
-- Index: idx_audit_logs_occurred_at

-- DROP INDEX IF EXISTS public.idx_audit_logs_occurred_at;

CREATE INDEX IF NOT EXISTS idx_audit_logs_occurred_at
    ON public.audit_logs USING btree
    (occurred_at DESC NULLS FIRST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_audit_logs_officer_id

-- DROP INDEX IF EXISTS public.idx_audit_logs_officer_id;

CREATE INDEX IF NOT EXISTS idx_audit_logs_officer_id
    ON public.audit_logs USING btree
    (officer_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;