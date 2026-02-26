import type { Marathon } from "@/lib/types";
import { buildCalendarDescription } from "@/lib/utils";

/** Naver 캘린더 API용 iCalendar 문자열 생성 (종일 이벤트) */
export function createNaverScheduleIcalString(marathon: Marathon): string {
  const origin =
    typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SITE_URL
      ? process.env.NEXT_PUBLIC_SITE_URL
      : "https://runzoa.com";
  const marathonUrl = `${origin}/marathon/${marathon.slug}`;

  const icsEscape = (s: string) =>
    s
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r\n|\r|\n/g, "\\n");

  const summary = icsEscape(marathon.name || "마라톤 대회");
  const location = icsEscape(
    [marathon.location?.region, marathon.location?.place].filter(Boolean).join(" ") || "",
  );
  const description = icsEscape(buildCalendarDescription(marathon, marathonUrl));

  const toIcsDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}${m}${day}`;
  };
  const toIcsUtc = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d{3}/g, "").slice(0, 15) + "Z";

  const start = marathon.event_start_at ? new Date(marathon.event_start_at) : null;
  // 종일 이벤트: 캘린더 그리드에서 시간 표시 없이 제목만 노출
  const dtStart = start ? `DTSTART;VALUE=DATE:${toIcsDate(start)}` : "";
  const dtEnd = start ? `DTEND;VALUE=DATE:${toIcsDate(start)}` : "";

  const uid = `${marathon.id.replace(/-/g, "")}@runzoa.com`;
  const now = new Date();
  const dtstamp = toIcsUtc(now);
  const created = toIcsUtc(now);
  const lastModified = toIcsUtc(now);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:Naver Calendar",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "SEQUENCE:0",
    "CLASS:PUBLIC",
    "TRANSP:OPAQUE",
    `UID:${uid}`,
    dtStart,
    dtEnd,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `CREATED:${created}`,
    `LAST-MODIFIED:${lastModified}`,
    `DTSTAMP:${dtstamp}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}

/** 네이버 캘린더 OAuth 인증 URL (state에 marathonId 전달). 서버 전용. */
export function getNaverCalendarAuthorizeUrl(redirectUri: string, state: string): string {
  const clientId = process.env.NAVER_CALENDAR_CLIENT_ID;
  if (!clientId) return "";
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: "calendar",
  });
  return `https://nid.naver.com/oauth2.0/authorize?${params.toString()}`;
}
