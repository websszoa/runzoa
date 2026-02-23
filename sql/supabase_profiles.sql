-- ============================================
-- 프로필 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin')),
  visit_count INTEGER DEFAULT 0 NOT NULL, 
  is_deleted BOOLEAN DEFAULT false NOT NULL, 
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 프로필 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_deleted ON public.profiles(is_deleted);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 기존 정책 초기화 (충돌 방지)
DROP POLICY IF EXISTS "read own profile" ON public.profiles;
DROP POLICY IF EXISTS "update own profile" ON public.profiles;

-- 본인 프로필만 조회 가능
CREATE POLICY "read own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = (select auth.uid()) AND is_deleted = FALSE);

-- 본인 프로필만 수정 가능
CREATE POLICY "update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = (select auth.uid()) AND is_deleted = FALSE)
WITH CHECK (id = (select auth.uid()) AND is_deleted = FALSE);

-- ============================================
-- 테이블 권한 정리
-- ============================================
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
REVOKE INSERT, DELETE ON public.profiles FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO service_role;