import { NextResponse, type NextRequest } from "next/server";
import { getNaverCalendarAuthorizeUrl } from "@/lib/naver-calendar";

/**
 * GET /api/naver-calendar/authorize?state=marathonId
 * 네이버 OAuth 인증 페이지로 리다이렉트. state에 marathonId 전달.
 */
export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state");
  if (!state) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isDev = process.env.NODE_ENV === "development";
  const origin = isDev && !forwardedHost
    ? request.nextUrl.origin
    : process.env.NEXT_PUBLIC_SITE_URL || (forwardedHost ? `https://${forwardedHost}` : request.nextUrl.origin);

  const redirectUri = `${origin}/auth/naver-calendar-callback`;
  const url = getNaverCalendarAuthorizeUrl(redirectUri, state);
  if (!url) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.redirect(url);
}
