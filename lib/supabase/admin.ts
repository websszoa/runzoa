import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * service_role 키를 사용하는 관리자 전용 클라이언트
 * RLS를 무시하고 모든 데이터에 접근 가능
 * 주의: 서버에서만 사용할 것! (SUPABASE_SERVICE_ROLE_KEY는 NEXT_PUBLIC_ 없이 사용)
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});
