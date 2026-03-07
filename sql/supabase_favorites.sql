-- ============================================
-- 즐겨찾기 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.marathon_favorites (
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  marathon_id UUID NOT NULL REFERENCES public.marathons(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, marathon_id)
);

-- ============================================
-- 즐겨찾기 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_marathon_favorites_user_id ON public.marathon_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_marathon_favorites_marathon_id ON public.marathon_favorites(marathon_id);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================
ALTER TABLE public.marathon_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read own favorites" ON public.marathon_favorites;
DROP POLICY IF EXISTS "insert own favorite" ON public.marathon_favorites;
DROP POLICY IF EXISTS "delete own favorite" ON public.marathon_favorites;

-- 본인 즐겨찾기만 조회
CREATE POLICY "read own favorites"
ON public.marathon_favorites
FOR SELECT
TO authenticated
USING (user_id = (select auth.uid()));

-- 본인 즐겨찾기만 추가
CREATE POLICY "insert own favorite"
ON public.marathon_favorites
FOR INSERT
TO authenticated
WITH CHECK (user_id = (select auth.uid()));

-- 본인 즐겨찾기만 삭제
CREATE POLICY "delete own favorite"
ON public.marathon_favorites
FOR DELETE
TO authenticated
USING (user_id = (select auth.uid()));

-- ============================================
-- 테이블 권한 정리
-- ============================================
GRANT SELECT, INSERT, DELETE ON public.marathon_favorites TO authenticated;
REVOKE UPDATE ON public.marathon_favorites FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marathon_favorites TO service_role;


-- ============================================
-- 트리거: 즐겨찾기 추가 → favorite_count +1
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_marathon_favorites_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.marathons
  SET favorite_count = favorite_count + 1
  WHERE id = NEW.marathon_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_marathon_favorites_after_insert ON public.marathon_favorites;
CREATE TRIGGER trg_marathon_favorites_after_insert
AFTER INSERT ON public.marathon_favorites
FOR EACH ROW EXECUTE FUNCTION public.fn_trg_marathon_favorites_insert();


-- ============================================
-- 트리거: 즐겨찾기 삭제 → favorite_count -1
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_marathon_favorites_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.marathons
  SET favorite_count = GREATEST(favorite_count - 1, 0)
  WHERE id = OLD.marathon_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_marathon_favorites_after_delete ON public.marathon_favorites;
CREATE TRIGGER trg_marathon_favorites_after_delete
AFTER DELETE ON public.marathon_favorites
FOR EACH ROW EXECUTE FUNCTION public.fn_trg_marathon_favorites_delete();


-- ============================================
-- RPC: 즐겨찾기 토글 (추가 → true / 취소 → false)
-- ============================================
CREATE OR REPLACE FUNCTION public.toggle_favorite(p_marathon_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.marathon_favorites
    WHERE user_id = (select auth.uid())
      AND marathon_id = p_marathon_id
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM public.marathon_favorites
    WHERE user_id = (select auth.uid())
      AND marathon_id = p_marathon_id;
    RETURN FALSE;
  ELSE
    INSERT INTO public.marathon_favorites (user_id, marathon_id)
    VALUES ((select auth.uid()), p_marathon_id);
    RETURN TRUE;
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.toggle_favorite(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.toggle_favorite(UUID) TO authenticated;


-- ============================================
-- RPC: 내가 즐겨찾기 했는지 확인
-- ============================================
CREATE OR REPLACE FUNCTION public.is_favorited(p_marathon_id UUID)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.marathon_favorites
    WHERE user_id = (select auth.uid())
      AND marathon_id = p_marathon_id
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_favorited(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_favorited(UUID) TO authenticated;
