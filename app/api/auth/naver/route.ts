import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.NAVER_CALENDAR_CLIENT_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const redirectUri = `${siteUrl}/api/auth/naver/callback`;
  const state = req.nextUrl.searchParams.get("redirect") ?? "/";

  const url = new URL("https://nid.naver.com/oauth2.0/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId!);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", encodeURIComponent(state));

  return NextResponse.redirect(url.toString());
}
