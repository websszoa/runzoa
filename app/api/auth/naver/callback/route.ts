import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state") ?? "%2F";

  const clientId = process.env.NAVER_CALENDAR_CLIENT_ID!;
  const clientSecret = process.env.NAVER_CALENDAR_CLIENT_SECRET!;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const redirectUri = `${siteUrl}/api/auth/naver/callback`;

  if (!code) {
    return NextResponse.redirect(`${siteUrl}/?error=naver_auth_failed`);
  }

  const tokenRes = await fetch(
    `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}&state=${state}`,
    { method: "GET" },
  );

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${siteUrl}/?error=naver_token_failed`);
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return NextResponse.redirect(`${siteUrl}/?error=naver_token_missing`);
  }

  const redirectTo = decodeURIComponent(state);
  const response = NextResponse.redirect(`${siteUrl}${redirectTo}`);

  response.cookies.set("naver_calendar_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1시간
    path: "/",
  });

  return response;
}
