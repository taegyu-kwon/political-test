-- Run this once in Supabase SQL Editor (postgres role)
-- 1) Allow the website (anon key) to read/write responses
-- 2) Expose a lightweight aggregate RPC for the map page

ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read responses" ON public.responses;
CREATE POLICY "Public read responses"
ON public.responses
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Public insert responses" ON public.responses;
CREATE POLICY "Public insert responses"
ON public.responses
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.map_region_stats()
RETURNS TABLE (region text, result text, cnt bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT region, result, COUNT(*)::bigint AS cnt
  FROM public.responses
  WHERE region IS NOT NULL AND result IS NOT NULL
  GROUP BY region, result;
$$;

GRANT EXECUTE ON FUNCTION public.map_region_stats() TO anon, authenticated;
