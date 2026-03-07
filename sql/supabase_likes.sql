-- ============================================
-- marathons 테이블에 like_count 컬럼 추가
-- (이미 있으면 무시됩니다)
-- ============================================
ALTER TABLE public.marathons
  ADD COLUMN IF NOT EXISTS like_count INT DEFAULT 0 NOT NULL;


-- ============================================
-- 좋아요 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.marathon_likes (
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  marathon_id UUID NOT NULL REFERENCES public.marathons(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, marathon_id)
);

-- ============================================
-- 좋아요 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_marathon_likes_user_id ON public.marathon_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_marathon_likes_marathon_id ON public.marathon_likes(marathon_id);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================
ALTER TABLE public.marathon_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read own likes" ON public.marathon_likes;
DROP POLICY IF EXISTS "insert own like" ON public.marathon_likes;
DROP POLICY IF EXISTS "delete own like" ON public.marathon_likes;

-- 본인 좋아요만 조회
CREATE POLICY "read own likes"
ON public.marathon_likes
FOR SELECT
TO authenticated
USING (user_id = (select auth.uid()));

-- 본인 좋아요만 추가
CREATE POLICY "insert own like"
ON public.marathon_likes
FOR INSERT
TO authenticated
WITH CHECK (user_id = (select auth.uid()));

-- 본인 좋아요만 삭제
CREATE POLICY "delete own like"
ON public.marathon_likes
FOR DELETE
TO authenticated
USING (user_id = (select auth.uid()));

-- ============================================
-- 테이블 권한 정리
-- ============================================
GRANT SELECT, INSERT, DELETE ON public.marathon_likes TO authenticated;
REVOKE UPDATE ON public.marathon_likes FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marathon_likes TO service_role;


-- ============================================
-- 트리거: 좋아요 추가 → like_count +1
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_marathon_likes_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.marathons
  SET like_count = like_count + 1
  WHERE id = NEW.marathon_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_marathon_likes_after_insert ON public.marathon_likes;
CREATE TRIGGER trg_marathon_likes_after_insert
AFTER INSERT ON public.marathon_likes
FOR EACH ROW EXECUTE FUNCTION public.fn_trg_marathon_likes_insert();


-- ============================================
-- 트리거: 좋아요 삭제 → like_count -1
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_marathon_likes_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.marathons
  SET like_count = GREATEST(like_count - 1, 0)
  WHERE id = OLD.marathon_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_marathon_likes_after_delete ON public.marathon_likes;
CREATE TRIGGER trg_marathon_likes_after_delete
AFTER DELETE ON public.marathon_likes
FOR EACH ROW EXECUTE FUNCTION public.fn_trg_marathon_likes_delete();
