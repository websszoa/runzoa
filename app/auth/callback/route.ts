import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // 이동할 경로 (없으면 홈)
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) next = "/";

  // Base URL 확정 (성공/실패 리다이렉트 공통 사용)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const baseUrl =
    !isLocalEnv && forwardedHost ? `https://${forwardedHost}` : origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 1. 탈퇴한 계정인지 확인
      const { data: isDeleted } = await supabase.rpc("is_my_account_deleted");
      if (isDeleted === true) {
        await supabase.auth.signOut();
        const url = new URL("/", baseUrl);
        url.searchParams.set("error", "deleted_account");
        return NextResponse.redirect(url);
      }

      // 2. 방문 횟수 증가
      try {
        await supabase.rpc("increment_visit_count");
      } catch (rpcError) {
        console.error("방문 횟수 증가 실패:", rpcError);
      }

      // 3. 로그인 성공 리다이렉트
      const url = new URL(next, baseUrl);
      url.searchParams.set("welcome", "true");
      return NextResponse.redirect(url);
    }
  }

  // code 없음 또는 세션 교환 실패
  const failUrl = new URL("/", baseUrl);
  failUrl.searchParams.set("error", "error_code");
  return NextResponse.redirect(failUrl);
}
