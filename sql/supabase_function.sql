-- ============================================
-- 1. 회원가입 시 프로필 자동 생성 (트리거)
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_insert_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, signup_provider, role, visit_count, is_deleted)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_app_meta_data->>'provider',
    'user',
    0,
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auth_users_after_insert ON auth.users;
CREATE TRIGGER trg_auth_users_after_insert
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.fn_trg_insert_profile();


-- ============================================
-- 2. 업데이트 시 자동 갱신 (트리거)
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 프로필, 문의, 마라톤 테이블에 각각 적용
DROP TRIGGER IF EXISTS trg_profiles_before_update ON public.profiles;
CREATE TRIGGER trg_profiles_before_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.fn_trg_set_updated_at();

DROP TRIGGER IF EXISTS trg_contacts_before_update ON public.contacts;
CREATE TRIGGER trg_contacts_before_update
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.fn_trg_set_updated_at();

DROP TRIGGER IF EXISTS trg_marathons_before_update ON public.marathons;
CREATE TRIGGER trg_marathons_before_update
  BEFORE UPDATE ON public.marathons
  FOR EACH ROW EXECUTE FUNCTION public.fn_trg_set_updated_at();

DROP TRIGGER IF EXISTS trg_marathon_comments_before_update ON public.marathon_comments;
CREATE TRIGGER trg_marathon_comments_before_update
  BEFORE UPDATE ON public.marathon_comments
  FOR EACH ROW EXECUTE FUNCTION public.fn_trg_set_updated_at();


-- ============================================
-- 3. 회원 탈퇴 (Soft Delete) (RPC)
-- ============================================
CREATE OR REPLACE FUNCTION public.soft_delete_account()
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET
    is_deleted = TRUE,
    deleted_at = NOW()
  WHERE id = (select auth.uid())
    AND is_deleted = FALSE;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.soft_delete_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.soft_delete_account() TO authenticated;


-- ============================================
-- 4. 프로필 이름 중복 확인 (RPC)
-- ============================================
CREATE OR REPLACE FUNCTION public.is_full_name_available(name_text TEXT)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE LOWER(TRIM(full_name)) = LOWER(TRIM(name_text))
      AND is_deleted = FALSE
      AND id != (select auth.uid())
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_full_name_available(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_full_name_available(TEXT) TO authenticated;


-- ============================================
-- 5. 계정 탈퇴 여부 체크 (RPC)
-- ============================================
CREATE OR REPLACE FUNCTION public.is_my_account_deleted()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_deleted
     FROM public.profiles
     WHERE id = (select auth.uid())),
    FALSE
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_my_account_deleted() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_my_account_deleted() TO authenticated;




-- ============================================
-- 6. 로그인 시 방문 횟수 증가 (RPC)
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_visit_count()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET visit_count = visit_count + 1
  WHERE id = (select auth.uid())
    AND is_deleted = FALSE;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.increment_visit_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_visit_count() TO authenticated;


-- ============================================
-- 7. 마라톤 상세 페이지 방문수 증가 (RPC)
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_view_count(p_marathon_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.marathons
  SET view_count = view_count + 1
  WHERE id = p_marathon_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.increment_view_count(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_view_count(UUID) TO anon, authenticated;


-- ============================================
-- 8. 마라톤 댓글 수 자동 동기화 (트리거)
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_marathon_comments_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.marathons
  SET comment_count = comment_count + 1
  WHERE id = NEW.marathon_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_marathon_comments_after_insert ON public.marathon_comments;
CREATE TRIGGER trg_marathon_comments_after_insert
AFTER INSERT ON public.marathon_comments
FOR EACH ROW EXECUTE FUNCTION public.fn_trg_marathon_comments_insert();

CREATE OR REPLACE FUNCTION public.fn_trg_marathon_comments_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.marathons
  SET comment_count = GREATEST(comment_count - 1, 0)
  WHERE id = OLD.marathon_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_marathon_comments_after_delete ON public.marathon_comments;
CREATE TRIGGER trg_marathon_comments_after_delete
AFTER DELETE ON public.marathon_comments
FOR EACH ROW EXECUTE FUNCTION public.fn_trg_marathon_comments_delete();


-- ============================================
-- 최종 기능 요약
-- ============================================
-- [트리거]
-- 1. 회원가입 시 프로필 자동 생성
-- 2. 업데이트 시 자동 갱신 (프로필, 문의, 마라톤, 댓글)
-- 3. 마라톤 댓글 수 자동 동기화 (댓글 추가/삭제)
--
-- [RPC]
-- 4. 회원 탈퇴 (Soft Delete)
-- 5. 프로필 이름 중복 확인
-- 6. 계정 탈퇴 여부 체크
-- 7. 로그인 시 방문 횟수 증가
-- 8. 마라톤 상세 페이지 방문수 증가
--
-- [별도 파일]
-- 9.  즐겨찾기 (supabase_favorites.sql) → marathon_favorites
-- 10. 알림설정 (supabase_alerts.sql)   → marathon_alerts
-- 11. 댓글 (supabase_comments.sql)     → marathon_comments
-- 12. 공유 기록 (supabase_shares.sql)  → marathon_shares
-- 13. 좋아요 (supabase_likes.sql)      → marathon_likes