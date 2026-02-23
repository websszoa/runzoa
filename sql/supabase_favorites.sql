-- ============================================
-- 즐겨찾기(favorites) 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  marathon_id UUID NOT NULL REFERENCES public.marathons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, marathon_id)                   -- 중복 즐겨찾기 방지
);

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_marathon_id ON public.favorites(marathon_id);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read own favorites" ON public.favorites;

-- 본인 즐겨찾기 목록만 조회 가능
CREATE POLICY "read own favorites"
ON public.favorites
FOR SELECT
TO authenticated
USING (user_id = (select auth.uid()));

-- ============================================
-- 테이블 권한 (INSERT/DELETE는 RPC가 처리)
-- ============================================
GRANT SELECT ON public.favorites TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.favorites FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorites TO service_role;


-- ============================================
-- 1. 즐겨찾기 토글 (RPC)
-- 반환값: TRUE = 즐겨찾기 추가, FALSE = 즐겨찾기 취소
-- ============================================
CREATE OR REPLACE FUNCTION public.toggle_marathon_favorite(p_marathon_id UUID)
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
    SELECT 1 FROM public.favorites
    WHERE user_id = v_user_id AND marathon_id = p_marathon_id
  ) INTO v_exists;

  IF v_exists THEN
    -- 즐겨찾기 취소
    DELETE FROM public.favorites
    WHERE user_id = v_user_id AND marathon_id = p_marathon_id;

    UPDATE public.marathons
    SET favorite_count = GREATEST(favorite_count - 1, 0)
    WHERE id = p_marathon_id;

    RETURN FALSE;
  ELSE
    -- 즐겨찾기 추가
    INSERT INTO public.favorites (user_id, marathon_id)
    VALUES (v_user_id, p_marathon_id);

    UPDATE public.marathons
    SET favorite_count = favorite_count + 1
    WHERE id = p_marathon_id;

    RETURN TRUE;
  END IF;
EXCEPTION
  WHEN unique_violation THEN
    RETURN TRUE; -- 동시 요청으로 이미 즐겨찾기 추가됨
END;
$$;

REVOKE EXECUTE ON FUNCTION public.toggle_marathon_favorite(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.toggle_marathon_favorite(UUID) TO authenticated;


-- ============================================
-- 2. 특정 마라톤 즐겨찾기 여부 확인 (RPC)
-- 반환값: TRUE = 즐겨찾기 상태, FALSE = 미즐겨찾기 상태
-- ============================================
CREATE OR REPLACE FUNCTION public.is_marathon_favorited(p_marathon_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.favorites
    WHERE user_id = (select auth.uid())
      AND marathon_id = p_marathon_id
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_marathon_favorited(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_marathon_favorited(UUID) TO authenticated;


-- ============================================
-- 3. 내 즐겨찾기 마라톤 목록 조회 (RPC)
-- ============================================
CREATE OR REPLACE FUNCTION public.get_my_favorite_marathons()
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  event_start_at TIMESTAMPTZ,
  registration_status TEXT,
  favorite_count INT,
  favorited_at TIMESTAMPTZ
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
    m.favorite_count,
    f.created_at AS favorited_at
  FROM public.favorites f
  JOIN public.marathons m ON m.id = f.marathon_id
  WHERE f.user_id = (select auth.uid())
  ORDER BY f.created_at DESC;
$$;

REVOKE EXECUTE ON FUNCTION public.get_my_favorite_marathons() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_favorite_marathons() TO authenticated;


-- ============================================
-- 기능 요약
-- ============================================
-- [Table]
-- favorites: 유저별 마라톤 즐겨찾기 기록 (user_id + marathon_id 유니크)

-- [RPC]
-- toggle_marathon_favorite(p_marathon_id) → BOOLEAN : 즐겨찾기 토글
-- is_marathon_favorited(p_marathon_id)   → BOOLEAN : 즐겨찾기 여부 확인
-- get_my_favorite_marathons()            → TABLE   : 내 즐겨찾기 목록
