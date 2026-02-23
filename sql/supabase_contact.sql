-- ============================================
-- 문의하기 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'progress', 'resolved', 'closed')),
  admin_reply TEXT,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 문의 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- 기존 정책 초기화 (충돌 방지)
DROP POLICY IF EXISTS "insert own contact" ON public.contacts;
DROP POLICY IF EXISTS "read own contacts" ON public.contacts;

-- 로그인 사용자 본인 문의만 등록
CREATE POLICY "insert own contact"
ON public.contacts
FOR INSERT
TO authenticated
WITH CHECK (user_id = (select auth.uid()));

-- 본인 문의만 조회
CREATE POLICY "read own contacts"
ON public.contacts
FOR SELECT
TO authenticated
USING (user_id = (select auth.uid()));

-- ============================================
-- 테이블 권한 정리
-- ============================================
GRANT SELECT, INSERT ON public.contacts TO authenticated;
REVOKE UPDATE, DELETE ON public.contacts FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contacts TO service_role;
