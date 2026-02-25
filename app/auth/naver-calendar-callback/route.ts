import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createNaverScheduleIcalString } from "@/lib/naver-calendar";

const NAVER_TOKEN_URL = "https://nid.naver.com/oauth2.0/token";
const NAVER_CALENDAR_API_URL = "https://openapi.naver.com/calendar/createSchedule.json";

/**
 * 네이버 OAuth 콜백: code로 access_token 발급 후 캘린더 API로 일정 추가.
 * state = marathonId
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // marathonId

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isDev = process.env.NODE_ENV === "development";
  const origin = isDev && !forwardedHost
    ? request.nextUrl.origin
    : process.env.NEXT_PUBLIC_SITE_URL || (forwardedHost ? `https://${forwardedHost}` : request.nextUrl.origin);
  const baseUrl = origin;

  if (!code || !state) {
    console.error("[naver-calendar] missing code or state");
    const url = new URL("/", baseUrl);
    url.searchParams.set("naver_calendar", "error");
    url.searchParams.set("reason", "no_code");
    return NextResponse.redirect(url);
  }

  const clientId = process.env.NAVER_CALENDAR_CLIENT_ID;
  const clientSecret = process.env.NAVER_CALENDAR_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error("[naver-calendar] missing NAVER_CALENDAR_CLIENT_ID or CLIENT_SECRET in env");
    const url = new URL("/", baseUrl);
    url.searchParams.set("naver_calendar", "error");
    url.searchParams.set("reason", "env");
    return NextResponse.redirect(url);
  }

  const redirectUri = `${origin}/auth/naver-calendar-callback`;

  // 1. code → access_token
  const tokenParams = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code,
    state,
  });
  let tokenRes: Response;
  try {
    tokenRes = await fetch(`${NAVER_TOKEN_URL}?${tokenParams.toString()}`, { method: "GET" });
  } catch (e) {
    console.error("[naver-calendar] token request failed:", e);
    const url = new URL("/", baseUrl);
    url.searchParams.set("naver_calendar", "error");
    url.searchParams.set("reason", "token_network");
    return NextResponse.redirect(url);
  }

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    console.error("[naver-calendar] token error:", tokenRes.status, text);
    const url = new URL("/", baseUrl);
    url.searchParams.set("naver_calendar", "error");
    url.searchParams.set("reason", "token");
    return NextResponse.redirect(url);
  }

  const tokenData = (await tokenRes.json()) as { access_token?: string };
  const accessToken = tokenData.access_token;
  if (!accessToken) {
    console.error("[naver-calendar] token response has no access_token");
    const url = new URL("/", baseUrl);
    url.searchParams.set("naver_calendar", "error");
    url.searchParams.set("reason", "token");
    return NextResponse.redirect(url);
  }
  console.log("[naver-calendar] token ok, marathonId:", state);

  // 2. marathon 조회
  const supabase = await createClient();
  const { data: marathon, error: fetchError } = await supabase
    .from("marathons")
    .select("*")
    .eq("id", state)
    .single();

  if (fetchError || !marathon) {
    console.error("[naver-calendar] marathon fetch failed:", fetchError?.message ?? "no data");
    const url = new URL("/", baseUrl);
    url.searchParams.set("naver_calendar", "error");
    url.searchParams.set("reason", "marathon");
    return NextResponse.redirect(url);
  }
  console.log("[naver-calendar] marathon ok:", marathon.name ?? marathon.id);

  // 3. Naver 캘린더 API 호출
  const scheduleIcalString = createNaverScheduleIcalString(marathon as import("@/lib/types").Marathon);
  const body = new URLSearchParams({
    calendarId: "defaultCalendarId",
    scheduleIcalString,
  });

  let calendarRes: Response;
  try {
    calendarRes = await fetch(NAVER_CALENDAR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${accessToken}`,
      },
      body: body.toString(),
    });
  } catch (e) {
    console.error("[naver-calendar] calendar API request failed:", e);
    const url = new URL("/", baseUrl);
    url.searchParams.set("naver_calendar", "error");
    url.searchParams.set("reason", "api_network");
    return NextResponse.redirect(url);
  }

  const slug = marathon.slug ?? marathon.id;
  const successUrl = new URL(`/marathon/${slug}`, baseUrl);
  successUrl.searchParams.set("naver_calendar", "success");
  const failUrl = new URL("/", baseUrl);
  failUrl.searchParams.set("naver_calendar", "error");

  if (!calendarRes.ok) {
    const text = await calendarRes.text();
    console.error("[naver-calendar] calendar API error:", calendarRes.status, text);
    failUrl.searchParams.set("reason", "api");
    return NextResponse.redirect(failUrl);
  }

  console.log("[naver-calendar] success, redirect to marathon:", slug);
  return NextResponse.redirect(successUrl);
}
