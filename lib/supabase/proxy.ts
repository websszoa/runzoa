import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // 기본 응답 객체 생성 (요청을 그대로 다음 단계로 통과)
  let supabaseResponse = NextResponse.next({ request });

  // Fluid compute 환경에서는 전역 변수에 클라이언트를 두면 안 됨
  // 요청(request)마다 새로 Supabase 서버 클라이언트를 생성해야 안전함
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 요청에 포함된 모든 쿠키를 가져옴
        getAll() {
          return request.cookies.getAll();
        },
        // Supabase가 세션 갱신 등으로 쿠키를 변경해야 할 때 호출됨
        setAll(cookiesToSet) {
          // 요청 객체의 쿠키도 함께 업데이트 (서버/브라우저 쿠키 동기화)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          // 쿠키가 변경되었으니 새 응답 객체를 다시 생성
          supabaseResponse = NextResponse.next({ request });

          // 응답에 쿠키를 설정해서 브라우저에 반영되도록 함
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // createServerClient()와 getClaims() 사이에 다른 코드를 넣지 말 것
  // 중간에 무언가 실행되면 “가끔 로그아웃 되는 현상” 같은 디버깅 어려운 문제가 생길 수 있음

  // getClaims()를 제거하고 SSR에서 Supabase를 쓰면
  // 사용자가 랜덤하게 로그아웃 되는 문제가 생길 수 있음 (중요)
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // ============================================
  // 요청한 조건:
  // admin 페이지로 갈 때만 로그인 여부 확인
  // 로그인 안 되어 있으면 /admin/login 로 보냄
  // ============================================
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

  if (isAdminPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  // 매우 중요:
  // 반드시 supabaseResponse를 그대로 반환해야 함
  // (새 NextResponse.next()를 만들면 쿠키 복사/동기화가 꼬여서 세션이 깨질 수 있음)
  //
  // 만약 새 응답 객체를 만들어야 한다면:
  // 1) const myNewResponse = NextResponse.next({ request })
  // 2) myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3) myNewResponse를 필요에 맞게 수정하되 쿠키는 건드리지 말 것
  // 4) return myNewResponse

  return supabaseResponse;
}
