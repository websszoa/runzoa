-- ============================================
-- 좋아요(hearts) 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.hearts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  marathon_id UUID NOT NULL REFERENCES public.marathons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, marathon_id)   -- 중복 좋아요 방지
);

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_hearts_user_id ON public.hearts(user_id);
CREATE INDEX IF NOT EXISTS idx_hearts_marathon_id ON public.hearts(marathon_id);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================
ALTER TABLE public.hearts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read own hearts" ON public.hearts;

-- 본인 좋아요 목록만 조회 가능
CREATE POLICY "read own hearts"
ON public.hearts
FOR SELECT
TO authenticated
USING (user_id = (select auth.uid()));

-- ============================================
-- 테이블 권한 (INSERT/DELETE는 RPC가 처리)
-- ============================================
GRANT SELECT ON public.hearts TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.hearts FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hearts TO service_role;


-- ============================================
-- 1. 좋아요 토글 (RPC)
-- 반환값: TRUE = 좋아요 추가, FALSE = 좋아요 취소
-- ============================================
CREATE OR REPLACE FUNCTION public.toggle_marathon_heart(p_marathon_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_exists  BOOLEAN;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '로그인이 필요합니다.';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.hearts
    WHERE user_id = v_user_id AND marathon_id = p_marathon_id
  ) INTO v_exists;

  IF v_exists THEN
    -- 좋아요 취소
    DELETE FROM public.hearts
    WHERE user_id = v_user_id AND marathon_id = p_marathon_id;

    UPDATE public.marathons
    SET heart_count = GREATEST(heart_count - 1, 0)
    WHERE id = p_marathon_id;

    RETURN FALSE;
  ELSE
    -- 좋아요 추가
    INSERT INTO public.hearts (user_id, marathon_id)
    VALUES (v_user_id, p_marathon_id);

    UPDATE public.marathons
    SET heart_count = heart_count + 1
    WHERE id = p_marathon_id;

    RETURN TRUE;
  END IF;
EXCEPTION
  WHEN unique_violation THEN
    RETURN TRUE; -- 동시 요청으로 이미 좋아요 추가됨
END;
$$;

REVOKE EXECUTE ON FUNCTION public.toggle_marathon_heart(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.toggle_marathon_heart(UUID) TO authenticated;


-- ============================================
-- 2. 특정 마라톤 좋아요 여부 확인 (RPC)
-- 반환값: TRUE = 좋아요 상태, FALSE = 미좋아요 상태
-- ============================================
CREATE OR REPLACE FUNCTION public.is_marathon_hearted(p_marathon_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.hearts
    WHERE user_id = (select auth.uid())
      AND marathon_id = p_marathon_id
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_marathon_hearted(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_marathon_hearted(UUID) TO authenticated;


-- ============================================
-- 3. 내가 좋아요한 마라톤 목록 조회 (RPC)
-- ============================================
CREATE OR REPLACE FUNCTION public.get_my_hearted_marathons()
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  event_start_at TIMESTAMPTZ,
  registration_status TEXT,
  heart_count INT,
  hearted_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    m.id,
    m.name,
    m.slug,
    m.event_start_at,
    m.registration_status,
    m.heart_count,
    h.created_at AS hearted_at
  FROM public.hearts h
  JOIN public.marathons m ON m.id = h.marathon_id
  WHERE h.user_id = (select auth.uid())
  ORDER BY h.created_at DESC;
$$;

REVOKE EXECUTE ON FUNCTION public.get_my_hearted_marathons() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_hearted_marathons() TO authenticated;


-- ============================================
-- 기능 요약
-- ============================================
-- [Table]
-- hearts: 유저별 마라톤 좋아요 기록 (user_id + marathon_id 유니크)

-- [RPC]
-- toggle_marathon_heart(p_marathon_id)  → BOOLEAN  : 좋아요 토글
-- is_marathon_hearted(p_marathon_id)   → BOOLEAN  : 좋아요 여부 확인
-- get_my_hearted_marathons()           → TABLE    : 내 좋아요 목록
