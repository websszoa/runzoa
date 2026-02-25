import type { Marathon } from "@/lib/types";
import { formatDate } from "@/lib/utils";

/** DB 날짜 문자열에서 YYYY-MM-DD 추출 (서버에서 UTC 기준으로 안전하게) */
function toDateString(dateStr: string): string {
  // "2026-03-01" or "2026-03-01T00:00:00+00:00" 등 다양한 형식 처리
  return dateStr.slice(0, 10);
}

/** 구글 캘린더 API용 이벤트 객체 생성 */
export function createGoogleCalendarEvent(marathon: Marathon): object {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://runzoa.com";
  const marathonUrl = `${origin}/marathon/${marathon.slug}`;

  const regText = marathon.registration_start_at
    ? `접수 시작: ${formatDate(marathon.registration_start_at)}. `
    : "";
  const description = `${regText}${marathon.description?.slice(0, 300) ?? ""} ${marathonUrl}`.trim();

  const location = [marathon.location?.region, marathon.location?.place]
    .filter(Boolean)
    .join(" ");

  const startDate = marathon.event_start_at
    ? toDateString(marathon.event_start_at)
    : null;
  const endDate = marathon.event_end_at
    ? toDateString(marathon.event_end_at)
    : startDate
      ? toDateString(
          new Date(new Date(marathon.event_start_at!).getTime() + 24 * 60 * 60 * 1000).toISOString(),
        )
      : null;

  return {
    summary: marathon.name || "마라톤 대회",
    description,
    location,
    start: startDate ? { date: startDate } : undefined,
    end: endDate ? { date: endDate } : undefined,
  };
}

/** 구글 캘린더 OAuth 인증 URL. 서버 전용. */
export function getGoogleCalendarAuthorizeUrl(redirectUri: string, state: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return "";
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/calendar.events",
    access_type: "online",
    state,
    prompt: "consent",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
