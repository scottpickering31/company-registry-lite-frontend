-- Table: public.companies

-- DROP TABLE IF EXISTS public.companies;

CREATE TABLE IF NOT EXISTS public.companies
(
    id integer NOT NULL DEFAULT nextval('companies_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    status company_status NOT NULL,
    company_number integer,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT companies_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.companies
    OWNER to postgres;