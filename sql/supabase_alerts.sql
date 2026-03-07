-- ============================================
-- 알림설정 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.marathon_alerts (
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  marathon_id UUID NOT NULL REFERENCES public.marathons(id) ON DELETE CASCADE,
  alert_type  TEXT NOT NULL CHECK (alert_type IN ('event', 'entry')),
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, marathon_id, alert_type)
);

-- ============================================
-- 알림설정 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_marathon_alerts_user_id ON public.marathon_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_marathon_alerts_marathon_id ON public.marathon_alerts(marathon_id);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================
ALTER TABLE public.marathon_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read own alerts" ON public.marathon_alerts;
DROP POLICY IF EXISTS "insert own alert" ON public.marathon_alerts;

-- 본인 알림설정만 조회
CREATE POLICY "read own alerts"
ON public.marathon_alerts
FOR SELECT
TO authenticated
USING (user_id = (select auth.uid()));

-- 본인 알림설정만 추가
CREATE POLICY "insert own alert"
ON public.marathon_alerts
FOR INSERT
TO authenticated
WITH CHECK (user_id = (select auth.uid()));

-- ============================================
-- 테이블 권한 정리
-- ============================================
GRANT SELECT, INSERT ON public.marathon_alerts TO authenticated;
REVOKE UPDATE, DELETE ON public.marathon_alerts FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marathon_alerts TO service_role;


-- ============================================
-- 트리거: 알림설정 추가 → 카운터 +1
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_marathon_alerts_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.alert_type = 'event' THEN
    UPDATE public.marathons
    SET alert_event_count = alert_event_count + 1
    WHERE id = NEW.marathon_id;
  ELSIF NEW.alert_type = 'entry' THEN
    UPDATE public.marathons
    SET alert_entry_count = alert_entry_count + 1
    WHERE id = NEW.marathon_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_marathon_alerts_after_insert ON public.marathon_alerts;
CREATE TRIGGER trg_marathon_alerts_after_insert
AFTER INSERT ON public.marathon_alerts
FOR EACH ROW EXECUTE FUNCTION public.fn_trg_marathon_alerts_insert();


-- ============================================
-- RPC: 알림설정 추가 (중복 무시)
-- alert_type: 'event' (대회날) | 'entry' (접수날)
-- ============================================
CREATE OR REPLACE FUNCTION public.add_alert(p_marathon_id UUID, p_alert_type TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_alert_type NOT IN ('event', 'entry') THEN
    RAISE EXCEPTION 'Invalid alert_type: %. Use ''event'' or ''entry''.', p_alert_type;
  END IF;

  INSERT INTO public.marathon_alerts (user_id, marathon_id, alert_type)
  VALUES ((select auth.uid()), p_marathon_id, p_alert_type)
  ON CONFLICT (user_id, marathon_id, alert_type) DO NOTHING;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.add_alert(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.add_alert(UUID, TEXT) TO authenticated;


-- ============================================
-- RPC: 내 알림설정 여부 확인
-- ============================================
CREATE OR REPLACE FUNCTION public.is_alerted(p_marathon_id UUID, p_alert_type TEXT)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.marathon_alerts
    WHERE user_id = (select auth.uid())
      AND marathon_id = p_marathon_id
      AND alert_type = p_alert_type
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_alerted(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_alerted(UUID, TEXT) TO authenticated;
