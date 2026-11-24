-- Run as postgres. Existing responses data is preserved.
-- Anonymous clients can submit responses and read aggregates, never raw rows.
BEGIN;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read responses" ON public.responses;

REVOKE ALL PRIVILEGES ON TABLE public.responses FROM PUBLIC, anon, authenticated;
-- Table-level REVOKE does not remove any earlier column-level grants.
DO $$
DECLARE columns_sql text;
BEGIN
  SELECT string_agg(quote_ident(attname), ', ') INTO columns_sql
  FROM pg_attribute WHERE attrelid = 'public.responses'::regclass
    AND attnum > 0 AND NOT attisdropped;
  EXECUTE format('REVOKE SELECT (%1$s), INSERT (%1$s), UPDATE (%1$s), REFERENCES (%1$s) ON public.responses FROM PUBLIC, anon, authenticated', columns_sql);
END $$;
GRANT INSERT (age, gender, region, result) ON public.responses TO anon, authenticated;

DROP POLICY IF EXISTS "Public insert responses" ON public.responses;
CREATE POLICY "Public insert responses" ON public.responses
FOR INSERT TO anon, authenticated
WITH CHECK (
  (age IS NULL OR age IN ('10대', '20대', '30대', '40대', '50대', '60대 이상'))
  AND (gender IS NULL OR gender IN ('남성', '여성', '응답 안 함'))
  AND (region IS NULL OR region IN ('서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'))
  AND result IN ('극좌', '진보', '중도', '보수', '극우')
);

-- Intentionally callable without login: fixed aggregate only, no row identifiers
-- or age/gender fields. Definer rights let it aggregate while raw SELECT is denied.
CREATE OR REPLACE FUNCTION public.map_region_stats()
RETURNS TABLE (region text, result text, cnt bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT r.region, r.result, COUNT(*)::bigint AS cnt
  FROM public.responses AS r
  WHERE r.region IS NOT NULL AND r.result IS NOT NULL
  GROUP BY r.region, r.result;
$$;
REVOKE ALL ON FUNCTION public.map_region_stats() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.map_region_stats() TO anon, authenticated;
COMMIT;
