-- Empty development Supabase project only. Do not run on production.
-- Fails if responses already exists; does not replace or truncate data.
BEGIN;
CREATE TABLE public.responses (
  age text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  gender text,
  region text,
  result text,
  id bigserial PRIMARY KEY
);
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.responses FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SEQUENCE public.responses_id_seq TO anon, authenticated;
COMMIT;
-- Next, run map_stats.sql to allow validated submissions and aggregate reads.
