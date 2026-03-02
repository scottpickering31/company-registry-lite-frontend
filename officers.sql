-- Table: public.officers

-- DROP TABLE IF EXISTS public.officers;

CREATE TABLE IF NOT EXISTS public.officers
(
    id bigint NOT NULL DEFAULT nextval('officers_id_seq'::regclass),
    company_id integer NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    role character varying(100) COLLATE pg_catalog."default" NOT NULL,
    appointed_on date NOT NULL,
    resigned_on date,
    CONSTRAINT officers_pkey PRIMARY KEY (id),
    CONSTRAINT officers_company_id_fkey FOREIGN KEY (company_id)
        REFERENCES public.companies (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT officers_dates_chk CHECK (resigned_on IS NULL OR resigned_on >= appointed_on),
    CONSTRAINT officers_role_chk CHECK (role::text = ANY (ARRAY['Director'::character varying, 'Company Secretary'::character varying, 'Chief Executive Officer'::character varying, 'Chief Financial Officer'::character varying, 'Chief Operating Officer'::character varying, 'Non-Executive Director'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.officers
    OWNER to postgres;
-- Index: idx_officers_company_id

-- DROP INDEX IF EXISTS public.idx_officers_company_id;

CREATE INDEX IF NOT EXISTS idx_officers_company_id
    ON public.officers USING btree
    (company_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_officers_role

-- DROP INDEX IF EXISTS public.idx_officers_role;

CREATE INDEX IF NOT EXISTS idx_officers_role
    ON public.officers USING btree
    (role COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: officers_id_company_id_uidx

-- DROP INDEX IF EXISTS public.officers_id_company_id_uidx;

CREATE UNIQUE INDEX IF NOT EXISTS officers_id_company_id_uidx
    ON public.officers USING btree
    (id ASC NULLS LAST, company_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;