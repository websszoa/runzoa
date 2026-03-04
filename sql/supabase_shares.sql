-- ============================================
-- 마라톤 공유 기록 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.marathon_shares (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  marathon_id UUID NOT NULL REFERENCES public.marathons(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- 공유 기록 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_marathon_shares_user_id ON public.marathon_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_marathon_shares_marathon_id ON public.marathon_shares(marathon_id);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================
ALTER TABLE public.marathon_shares ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insert own share" ON public.marathon_shares;

-- 본인 공유 기록만 추가 (조회는 관리자만, 직접 SELECT 불필요)
CREATE POLICY "insert own share"
ON public.marathon_shares
FOR INSERT
TO authenticated
WITH CHECK (user_id = (select auth.uid()));

-- ============================================
-- 테이블 권한 정리
-- ============================================
GRANT INSERT ON public.marathon_shares TO authenticated;
REVOKE SELECT, UPDATE, DELETE ON public.marathon_shares FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marathon_shares TO service_role;


-- ============================================
-- 트리거: 공유 기록 추가 → share_count +1
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_marathon_shares_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.marathons
  SET share_count = share_count + 1
  WHERE id = NEW.marathon_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_marathon_shares_after_insert ON public.marathon_shares;
CREATE TRIGGER trg_marathon_shares_after_insert
AFTER INSERT ON public.marathon_shares
FOR EACH ROW EXECUTE FUNCTION public.fn_trg_marathon_shares_insert();


-- ============================================
-- RPC: 공유 기록 추가
-- ============================================
CREATE OR REPLACE FUNCTION public.add_marathon_share(p_marathon_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.marathon_shares (user_id, marathon_id)
  VALUES ((select auth.uid()), p_marathon_id);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.add_marathon_share(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.add_marathon_share(UUID) TO authenticated;
