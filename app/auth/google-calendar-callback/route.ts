import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createGoogleCalendarEvent } from "@/lib/google-calendar";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_CALENDAR_API_URL =
  "https://www.googleapis.com/calendar/v3/calendars/primary/events";

/**
 * 구글 OAuth 콜백: code로 access_token 발급 후 캘린더 API로 일정 추가.
 * state = marathonId
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // marathonId

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
    url.searchParams.set("google_calendar", "error");
    url.searchParams.set("reason", reason);
    return NextResponse.redirect(url);
  };

  if (!code || !state) {
    console.error("[google-calendar] missing code or state");
    return makeError("no_code");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error("[google-calendar] missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
    return makeError("env");
  }

  const redirectUri = `${origin}/auth/google-calendar-callback`;

  // 1. code → access_token
  let tokenRes: Response;
  try {
    tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });
  } catch (e) {
    console.error("[google-calendar] token request failed:", e);
    return makeError("token_network");
  }

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    console.error("[google-calendar] token error:", tokenRes.status, text);
    return makeError("token");
  }

  const tokenData = (await tokenRes.json()) as { access_token?: string };
  const accessToken = tokenData.access_token;
  if (!accessToken) {
    console.error("[google-calendar] token response has no access_token");
    return makeError("token");
  }

  // 2. marathon 조회
  const supabase = await createClient();
  const { data: marathon, error: fetchError } = await supabase
    .from("marathons")
    .select("*")
    .eq("id", state)
    .single();

  if (fetchError || !marathon) {
    console.error(
      "[google-calendar] marathon fetch failed:",
      fetchError?.message ?? "no data",
    );
    return makeError("marathon");
  }

  // 3. Google 캘린더 API 호출
  const event = createGoogleCalendarEvent(
    marathon as import("@/lib/types").Marathon,
  );

  let calendarRes: Response;
  try {
    calendarRes = await fetch(GOOGLE_CALENDAR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(event),
    });
  } catch (e) {
    console.error("[google-calendar] calendar API request failed:", e);
    return makeError("api_network");
  }

  const slug = marathon.slug ?? marathon.id;
  const successUrl = new URL(`/marathon/${slug}`, baseUrl);
  successUrl.searchParams.set("google_calendar", "success");

  if (!calendarRes.ok) {
    const text = await calendarRes.text();
    console.error("[google-calendar] calendar API error:", calendarRes.status, text);
    return makeError("api");
  }

  console.log("[google-calendar] success, redirect to marathon:", slug);
  return NextResponse.redirect(successUrl);
}
