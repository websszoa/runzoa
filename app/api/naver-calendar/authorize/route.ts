import { NextResponse, type NextRequest } from "next/server";
import { getNaverCalendarAuthorizeUrl, createNaverScheduleIcalString } from "@/lib/naver-calendar";
import { createClient } from "@/lib/supabase/server";
import type { Marathon } from "@/lib/types";

const NAVER_CALENDAR_API_URL = "https://openapi.naver.com/calendar/createSchedule.json";
const TOKEN_COOKIE = "naver_cal_token";

/**
 * GET /api/naver-calendar/authorize?state=marathonId
 * 1) 쿠키에 저장된 토큰이 있으면 OAuth 없이 바로 캘린더 API 호출
 * 2) 없거나 만료되었으면 네이버 OAuth 인증 페이지로 리다이렉트
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
  const baseUrl = origin;

  const makeError = (reason: string) => {
    const url = new URL("/", baseUrl);
    url.searchParams.set("naver_calendar", "error");
    url.searchParams.set("reason", reason);
    return NextResponse.redirect(url);
  };

  // 쿠키에 저장된 토큰으로 OAuth 없이 바로 API 호출 시도
  const cachedToken = request.cookies.get(TOKEN_COOKIE)?.value;
  if (cachedToken) {
    const supabase = await createClient();
    const { data: marathon, error: fetchError } = await supabase
      .from("marathons")
      .select("*")
      .eq("id", state)
      .single();

    if (!fetchError && marathon) {
      const scheduleIcalString = createNaverScheduleIcalString(marathon as Marathon);
      const body = new URLSearchParams({ calendarId: "defaultCalendarId", scheduleIcalString });

      try {
        const calendarRes = await fetch(NAVER_CALENDAR_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${cachedToken}`,
          },
          body: body.toString(),
        });

        if (calendarRes.ok) {
          const slug = (marathon as Marathon).slug ?? state;
          const successUrl = new URL(`/marathon/${slug}`, baseUrl);
          successUrl.searchParams.set("naver_calendar", "success");
          return NextResponse.redirect(successUrl);
        }
        // 401/403: 토큰 만료 → 쿠키 지우고 OAuth로 진행
        console.log("[naver-calendar] cached token expired or invalid, retrying OAuth");
      } catch (e) {
        console.error("[naver-calendar] cached token API error:", e);
      }
    }
  }

  // OAuth 인증 페이지로 리다이렉트 (만료된 쿠키는 삭제)
  const redirectUri = `${origin}/auth/naver-calendar-callback`;
  const url = getNaverCalendarAuthorizeUrl(redirectUri, state);
  if (!url) {
    return makeError("env");
  }

  const response = NextResponse.redirect(url);
  if (cachedToken) {
    response.cookies.delete(TOKEN_COOKIE);
  }
  return response;
}
