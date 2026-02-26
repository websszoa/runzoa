import type { Marathon } from "@/lib/types";
import { buildCalendarDescription } from "@/lib/utils";

/** RFC 5545 ICS 라인 폴딩: 75옥텟 초과 시 CRLF + 공백으로 분리 */
function icsFold(line: string): string {
  const maxBytes = 75;
  const encoder = new TextEncoder();
  const bytes = encoder.encode(line);
  if (bytes.length <= maxBytes) return line;

  const result: string[] = [];
  let start = 0;
  let first = true;
  while (start < bytes.length) {
    const limit = first ? maxBytes : maxBytes - 1;
    let end = start + limit;
    if (end >= bytes.length) {
      result.push((first ? "" : " ") + new TextDecoder().decode(bytes.slice(start)));
      break;
    }
    while (end > start && (bytes[end] & 0xc0) === 0x80) end--;
    result.push((first ? "" : " ") + new TextDecoder().decode(bytes.slice(start, end)));
    start = end;
    first = false;
  }
  return result.join("\r\n");
}

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
  // 종일 이벤트: DTEND는 RFC 5545 규격상 시작일 +1일 (exclusive end)
  const nextDay = start ? new Date(start.getTime() + 24 * 60 * 60 * 1000) : null;
  const dtStart = start ? `DTSTART;VALUE=DATE:${toIcsDate(start)}` : "";
  const dtEnd = nextDay ? `DTEND;VALUE=DATE:${toIcsDate(nextDay)}` : "";

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

  // RFC 5545 라인 폴딩 적용 후 CRLF로 결합
  return lines.map(icsFold).join("\r\n");
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
