-- ============================================
-- 알림설정(alerts) 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  marathon_id UUID NOT NULL REFERENCES public.marathons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, marathon_id)                   -- 중복 알림설정 방지
);

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_marathon_id ON public.alerts(marathon_id);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read own alerts" ON public.alerts;

-- 본인 알림설정 목록만 조회 가능
CREATE POLICY "read own alerts"
ON public.alerts
FOR SELECT
TO authenticated
USING (user_id = (select auth.uid()));

-- ============================================
-- 테이블 권한 (INSERT/DELETE는 RPC가 처리)
-- ============================================
GRANT SELECT ON public.alerts TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.alerts FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alerts TO service_role;


-- ============================================
-- 1. 알림설정 토글 (RPC)
-- 반환값: TRUE = 알림설정 추가, FALSE = 알림설정 취소
-- ============================================
CREATE OR REPLACE FUNCTION public.toggle_marathon_alert(p_marathon_id UUID)
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
    SELECT 1 FROM public.alerts
    WHERE user_id = v_user_id AND marathon_id = p_marathon_id
  ) INTO v_exists;

  IF v_exists THEN
    -- 알림설정 취소
    DELETE FROM public.alerts
    WHERE user_id = v_user_id AND marathon_id = p_marathon_id;

    UPDATE public.marathons
    SET alert_count = GREATEST(alert_count - 1, 0)
    WHERE id = p_marathon_id;

    RETURN FALSE;
  ELSE
    -- 알림설정 추가
    INSERT INTO public.alerts (user_id, marathon_id)
    VALUES (v_user_id, p_marathon_id);

    UPDATE public.marathons
    SET alert_count = alert_count + 1
    WHERE id = p_marathon_id;

    RETURN TRUE;
  END IF;
EXCEPTION
  WHEN unique_violation THEN
    RETURN TRUE; -- 동시 요청으로 이미 알림설정 추가됨
END;
$$;

REVOKE EXECUTE ON FUNCTION public.toggle_marathon_alert(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.toggle_marathon_alert(UUID) TO authenticated;


-- ============================================
-- 2. 특정 마라톤 알림설정 여부 확인 (RPC)
-- 반환값: TRUE = 알림설정 상태, FALSE = 미알림설정 상태
-- ============================================
CREATE OR REPLACE FUNCTION public.is_marathon_alerted(p_marathon_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.alerts
    WHERE user_id = (select auth.uid())
      AND marathon_id = p_marathon_id
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_marathon_alerted(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_marathon_alerted(UUID) TO authenticated;


-- ============================================
-- 3. 내 알림설정 마라톤 목록 조회 (RPC)
-- ============================================
CREATE OR REPLACE FUNCTION public.get_my_alerted_marathons()
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  event_start_at TIMESTAMPTZ,
  registration_status TEXT,
  alert_count INT,
  alerted_at TIMESTAMPTZ
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
    m.alert_count,
    a.created_at AS alerted_at
  FROM public.alerts a
  JOIN public.marathons m ON m.id = a.marathon_id
  WHERE a.user_id = (select auth.uid())
  ORDER BY a.created_at DESC;
$$;

REVOKE EXECUTE ON FUNCTION public.get_my_alerted_marathons() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_alerted_marathons() TO authenticated;


-- ============================================
-- 기능 요약
-- ============================================
-- [Table]
-- alerts: 유저별 마라톤 알림설정 기록 (user_id + marathon_id 유니크)

-- [RPC]
-- toggle_marathon_alert(p_marathon_id) → BOOLEAN : 알림설정 토글
-- is_marathon_alerted(p_marathon_id)  → BOOLEAN : 알림설정 여부 확인
-- get_my_alerted_marathons()          → TABLE   : 내 알림설정 목록
