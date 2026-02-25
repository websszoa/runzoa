import { NextResponse, type NextRequest } from "next/server";
import { getGoogleCalendarAuthorizeUrl } from "@/lib/google-calendar";

/**
 * GET /api/google-calendar/authorize?state=marathonId
 * 구글 OAuth 인증 페이지로 리다이렉트. state에 marathonId 전달.
 */
export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state");
  if (!state) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isDev = process.env.NODE_ENV === "development";
  const origin =
    isDev && !forwardedHost
      ? request.nextUrl.origin
      : process.env.NEXT_PUBLIC_SITE_URL ||
        (forwardedHost ? `https://${forwardedHost}` : request.nextUrl.origin);

  const redirectUri = `${origin}/auth/google-calendar-callback`;
  const url = getGoogleCalendarAuthorizeUrl(redirectUri, state);
  if (!url) {
    const errUrl = new URL("/", request.url);
    errUrl.searchParams.set("google_calendar", "error");
    errUrl.searchParams.set("reason", "env");
    return NextResponse.redirect(errUrl);
  }
  return NextResponse.redirect(url);
}
