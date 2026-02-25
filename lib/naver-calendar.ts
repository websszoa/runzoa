import type { Marathon } from "@/lib/types";

/** Naver 캘린더 API용 iCalendar 문자열 생성 (TZID=Asia/Seoul 형식) */
export function createNaverScheduleIcalString(marathon: Marathon): string {
  const origin =
    typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SITE_URL
      ? process.env.NEXT_PUBLIC_SITE_URL
      : "https://runzoa.com";
  const marathonUrl = `${origin}/marathon/${marathon.slug}`;
  const summary = (marathon.name || "마라톤 대회")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
  const location = (
    [marathon.location?.region, marathon.location?.place].filter(Boolean).join(" ") || ""
  ).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");
  const regText = marathon.registration_start_at
    ? `접수 시작: ${formatDateNaver(marathon.registration_start_at)}. `
    : "";
  const description = `${regText}${marathon.description?.slice(0, 300) ?? ""} ${marathonUrl}`.trim()
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

  const toNaverLocal = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    const s = String(d.getSeconds()).padStart(2, "0");
    return `${y}${m}${day}T${h}${min}${s}`;
  };
  const toIcsUtc = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d{3}/g, "").slice(0, 15) + "Z";

  const start = marathon.event_start_at ? new Date(marathon.event_start_at) : null;
  const end = marathon.event_end_at
    ? new Date(marathon.event_end_at)
    : start
      ? new Date(start.getTime() + 24 * 60 * 60 * 1000)
      : null;
  const dtStart = start ? `DTSTART;TZID=Asia/Seoul:${toNaverLocal(start)}` : "";
  const dtEnd = end
    ? `DTEND;TZID=Asia/Seoul:${toNaverLocal(end)}`
    : start
      ? `DTEND;TZID=Asia/Seoul:${toNaverLocal(new Date(start.getTime() + 24 * 60 * 60 * 1000))}`
      : "";

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
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Seoul",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZNAME:GMT+09:00",
    "TZOFFSETFROM:+0900",
    "TZOFFSETTO:+0900",
    "END:STANDARD",
    "END:VTIMEZONE",
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
  ];
  return lines.join("\n");
}

function formatDateNaver(date: string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}년 ${month}월 ${day}일`;
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
  });
  return `https://nid.naver.com/oauth2.0/authorize?${params.toString()}`;
}
