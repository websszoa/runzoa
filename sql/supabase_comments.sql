-- ============================================
-- 마라톤 댓글 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.marathon_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marathon_id UUID NOT NULL REFERENCES public.marathons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- 인덱스 (목록 조회용)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_marathon_comments_marathon_id ON public.marathon_comments(marathon_id);
CREATE INDEX IF NOT EXISTS idx_marathon_comments_created_at ON public.marathon_comments(marathon_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marathon_comments_user_id ON public.marathon_comments(user_id);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================
ALTER TABLE public.marathon_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read comments" ON public.marathon_comments;
DROP POLICY IF EXISTS "authenticated insert comment" ON public.marathon_comments;
DROP POLICY IF EXISTS "owner update comment" ON public.marathon_comments;
DROP POLICY IF EXISTS "owner delete comment" ON public.marathon_comments;

-- 누구나 해당 마라톤 댓글 목록 조회 가능
CREATE POLICY "public read comments"
ON public.marathon_comments
FOR SELECT
TO anon, authenticated
USING (true);

-- 로그인 사용자만 댓글 작성 (user_id는 본인만)
CREATE POLICY "authenticated insert comment"
ON public.marathon_comments
FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) = user_id);

-- 본인 댓글만 수정 가능
CREATE POLICY "owner update comment"
ON public.marathon_comments
FOR UPDATE
TO authenticated
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

-- 본인 댓글만 삭제 가능
CREATE POLICY "owner delete comment"
ON public.marathon_comments
FOR DELETE
TO authenticated
USING ((select auth.uid()) = user_id);

-- ============================================
-- 테이블 권한 정리
-- ============================================
GRANT SELECT ON public.marathon_comments TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.marathon_comments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marathon_comments TO service_role;
