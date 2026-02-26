import { clsx, type ClassValue } from "clsx";
import { createElement, type ReactNode } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import type { Marathon } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 텍스트에서 ==로 강조된 부분을 마크 태그로 감싸서 반환 */
export function renderHighlightText(text: string): ReactNode[] {
  const segments = text.split(/(==.+?==)/g);

  return segments.map((segment, index) => {
    const isHighlight = segment.startsWith("==") && segment.endsWith("==");

    if (!isHighlight) {
      return createElement("span", { key: `${segment}-${index}` }, segment);
    }

    const content = segment.slice(2, -2);
    return createElement(
      "mark",
      {
        key: `${content}-${index}`,
        className: "rounded-sm bg-red-100 px-1 text-inherit",
      },
      content,
    );
  });
}

/** 날짜(문자열 또는 Date)를 한국식 표기("yyyy년 M월 d일")로 변환 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

/** ISO 날짜 문자열을 댓글용 짧은 형식("yyyy. M. d.")으로 변환 */
export function formatCommentDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

/** 날짜(문자열 또는 Date)를 "yyyy년 M월 d일(요일)" 형식으로 변환 */
export function formatDateWithWeekday(
  date: string | Date | null | undefined,
): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekday = d.toLocaleDateString("ko-KR", { weekday: "short" });
  return `${year}년 ${month}월 ${day}일(${weekday})`;
}

/** ISO 날짜 문자열에서 시간만 "오전 09:00" / "오후 02:00" 형식으로 반환. 유효하지 않으면 null */
export function formatTimeToKorean(
  date: string | Date | null | undefined,
): string | null {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return null;
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const pad = (n: number) => String(n).padStart(2, "0");
  if (hours === 0 && minutes === 0) return null; // 00:00만 있으면 시간 없음으로 간주 가능
  const time = `${pad(hours)}:${pad(minutes)}`;
  if (hours === 0) return `오전 12:${pad(minutes)}`;
  if (hours < 12) return `오전 ${time}`;
  if (hours === 12) return `오후 ${time}`;
  return `오후 ${pad(hours - 12)}:${pad(minutes)}`;
}

/**
 * 접수 시작일(registration_start_at) 기준 오늘부터 며칠 남았는지 D-day 계산.
 * @returns 오늘보다 미래면 양수(남은 일수), 오늘이면 0, 과거면 음수. 날짜 없으면 null
 */
export function getRegistrationStartDday(
  registrationStartAt: string | Date | null | undefined,
): number | null {
  if (!registrationStartAt) return null;
  const start = typeof registrationStartAt === "string" ? new Date(registrationStartAt) : registrationStartAt;
  if (isNaN(start.getTime())) return null;
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const startDate = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const diffMs = startDate - today;
  return Math.round(diffMs / (24 * 60 * 60 * 1000));
}

/**
 * 접수 대기 상태일 때 "접수까지 N일 남았습니다" 등 D-day 문구 반환
 */
export function formatRegistrationDday(
  registrationStartAt: string | Date | null | undefined,
): string {
  const dday = getRegistrationStartDday(registrationStartAt);
  if (dday === null) return "접수 예정";
  if (dday > 1) return `접수까지 ${dday}일 남았습니다!!`;
  if (dday === 1) return "접수가 내일 시작합니다!!";
  if (dday === 0) return "접수가 오늘 시작합니다!!";
  return "접수 예정";
}

/** 날짜(문자열 또는 Date)를 "M월 d일" + "(요일)" 형태로 분리해서 반환 */
export function formatMonthDayAndWeekday(
  date: string | Date | null | undefined,
): { monthDay: string; weekday: string } {
  if (!date) return { monthDay: "-", weekday: "" };
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return { monthDay: "-", weekday: "" };

  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekday = d.toLocaleDateString("ko-KR", { weekday: "short" });

  return { monthDay: `${month}월 ${day}일`, weekday };
}

/** 거리 라벨을 정규화 */
function normalizeDistanceLabel(distance: string): string {
  const upper = distance.toUpperCase();
  if (upper === "FULL") return "풀코스";
  if (upper === "HALF") return "하프";
  return upper;
}

type MarathonRegistrationPriceItem = { distance: string; price: number | null };
type MarathonRegistrationPrice =
  | MarathonRegistrationPriceItem[]
  | Record<string, number>
  | null
  | undefined;

function toRegistrationPriceArray(
  registrationPrice: MarathonRegistrationPrice,
): MarathonRegistrationPriceItem[] {
  if (!registrationPrice) return [];
  if (Array.isArray(registrationPrice)) return registrationPrice;
  if (typeof registrationPrice === "object" && registrationPrice !== null) {
    return Object.entries(registrationPrice).map(([distance, price]) => ({
      distance,
      price: typeof price === "number" ? price : null,
    }));
  }
  return [];
}

/** registration_price에서 거리 목록을 "10KM / 풀코스 / 하프" 형식으로 반환 */
export function formatRegistrationDistances(
  registrationPrice: MarathonRegistrationPrice,
): string {
  const arr = toRegistrationPriceArray(registrationPrice);
  if (arr.length === 0) return "-";

  const distances = arr
    .map((item) => item.distance)
    .filter(Boolean)
    .map(normalizeDistanceLabel);

  if (distances.length === 0) return "-";
  return distances.join(" / ");
}

function formatPriceWithDot(value: number): string {
  return value.toLocaleString("ko-KR").replace(/,/g, ".");
}

/** registration_price에서 가격 범위를 "30.000원 ~ 50.000원" 형식으로 반환 */
export function formatRegistrationPriceRange(
  registrationPrice: MarathonRegistrationPrice,
): string {
  const arr = toRegistrationPriceArray(registrationPrice);
  if (arr.length === 0) return "-";

  const prices = arr
    .map((item) => item.price)
    .filter((price): price is number => typeof price === "number")
    .sort((a, b) => a - b);

  if (prices.length === 0) return "-";

  const min = formatPriceWithDot(prices[0]);
  const max = formatPriceWithDot(prices[prices.length - 1]);

  if (prices[0] === prices[prices.length - 1]) return `${min}원`;
  return `${min}원 ~ ${max}원`;
}

const MARATHON_ENGAGEMENT_MESSAGES = [
  (view: number) => `👀 ${view}명이 이 글을 봤어요 💖`,
  (view: number) => `${view}명이 함께 봤어요 😊`,
  (view: number) => `${view}명이 관심 있게 살펴봤어요 🐹`,
  (view: number) => `${view}명이 조용히 구경했어요 😄`,
  (view: number) => `👀 벌써 ${view}명이 확인했어요! 🌸`,
  (view: number) => `${view}명이 이 페이지에 다녀갔어요 🦄`,
  (view: number) => `${view}명이 봤어요 👋 같이 볼래요?`,
  (view: number) => `${view}명이 이 내용을 확인했어요 ✨`,
  (view: number) => `${view}명이 봤어요 ⭐ — 인기 있는 중!`,
  (view: number) => `${view}명이 함께 살펴봤어요! 💖`,
] as const;

function hashText(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** 카드별로 고정된 랜덤 카피를 반환 */
export function getMarathonEngagementMessage(
  viewCount: number,
  seed: string,
): string {
  const index = hashText(seed) % MARATHON_ENGAGEMENT_MESSAGES.length;
  return MARATHON_ENGAGEMENT_MESSAGES[index](viewCount);
}

/** 접수 상태에 따른 텍스트 색상 클래스 (Tailwind) */
export function getRegistrationTextColor(
  status: string | null | undefined,
): string {
  switch (status) {
    case "접수대기":
      return "text-amber-600";
    case "접수중":
      return "text-red-600";
    case "접수마감":
      return "text-gray-600";
    case "추가접수":
      return "text-blue-600";
    default:
      return "text-gray-900";
  }
}

/*
 * 이벤트 상태 계산 (D-day)
 * @returns "D-10" | "D-Day" | "진행중" | "종료" | "정보없음"
 */
export function getEventStatus(start: string, end: string) {
  if (!start) return "-";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(start);
  startDate.setHours(0, 0, 0, 0);

  const endDate = end ? new Date(end) : new Date(start);
  endDate.setHours(0, 0, 0, 0);

  if (today > endDate) return "종료";
  if (today >= startDate && today <= endDate) return "진행중";

  const diff = Math.ceil(
    (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff === 0) return "D-Day";
  return `D-${diff}`;
}

/** URL을 클립보드에 복사하고 토스트로 결과 알림. 성공 시 onSuccess 호출 */
export function copyToClipboard(url: string, onSuccess?: () => void): void {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    toast.error("링크 복사에 실패했습니다.");
    return;
  }
  navigator.clipboard.writeText(url).then(
    () => {
      toast.success("링크가 복사되었습니다.");
      onSuccess?.();
    },
    () => toast.error("링크 복사에 실패했습니다."),
  );
}

/**
 * 마라톤 대회일·접수일을 구글 캘린더에 추가하는 URL 생성.
 * 대회일 이벤트 + 상세에 접수일 정보 포함. 사용자가 캘린더 앱에서 알림 설정 가능.
 */
/** 캘린더 메모(description) 텍스트 생성 (Naver/Google 공통) */
export function buildCalendarDescription(marathon: Marathon, marathonUrl: string): string {
  const lines: string[] = [];

  lines.push(marathon.name || "마라톤 대회");
  if (marathon.description) {
    lines.push(marathon.description);
  }
  lines.push("");

  if (marathon.event_start_at) {
    const d = new Date(marathon.event_start_at);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    lines.push(`대회 날짜 : ${y}.${m}.${day} ${h}:${min}`);
  }

  const regStart = marathon.registration_start_at;
  const regEnd = marathon.registration_end_at;
  if (regStart || regEnd) {
    const formatDot = (ds: string) => {
      const d = new Date(ds);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}.${m}.${day}`;
    };
    const start = regStart ? formatDot(regStart) : "";
    const end = regEnd ? formatDot(regEnd) : "";
    if (start && end) {
      lines.push(`접수 날짜 : ${start} ~ ${end}`);
    } else if (start) {
      lines.push(`접수 날짜 : ${start}`);
    }
  }

  if (marathon.registration_price && marathon.registration_price.length > 0) {
    const priceText = marathon.registration_price
      .filter((p) => p.price !== null)
      .map((p) => `${p.distance}: ${p.price}원`)
      .join(", ");
    if (priceText) lines.push(`참가비 : ${priceText}`);
  }

  lines.push(`자세히 보기 : ${marathonUrl}`);
  lines.push(`런조아 : https://runzoa.com`);

  return lines.join("\n");
}

export function getAddToCalendarUrl(marathon: Marathon): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://runzoa.com";
  const marathonUrl = `${origin}/marathon/${marathon.slug}`;

  const eventStart = marathon.event_start_at ? new Date(marathon.event_start_at) : null;
  const toAllDayDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}${m}${day}`;
  };
  // 종일 이벤트: YYYYMMDD/YYYYMMDD (당일 하루)
  const dates = eventStart ? `${toAllDayDate(eventStart)}/${toAllDayDate(eventStart)}` : "";

  const details = buildCalendarDescription(marathon, marathonUrl);
  const location = [marathon.location?.region, marathon.location?.place]
    .filter(Boolean)
    .join(" ");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: marathon.name || "마라톤 대회",
    dates: dates || "",
    details,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** ICS(iCalendar) 형식 문자열에서 특수문자 이스케이프 */
function icsEscape(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

/** ICS RFC 5545 줄 접기: 75옥텟 초과 시 CRLF + 공백으로 분리 */
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
    // UTF-8 멀티바이트 경계에서 자르지 않도록 후퇴
    while (end > start && (bytes[end] & 0xc0) === 0x80) end--;
    result.push((first ? "" : " ") + new TextDecoder().decode(bytes.slice(start, end)));
    start = end;
    first = false;
  }
  return result.join("\r\n");
}

/** 로컬(KST) 날짜를 ICS DATE 형식 YYYYMMDD로 변환 */
function toIcsDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/** 마라톤 일정을 ICS 파일 내용으로 반환. 네이버 캘린더 등에서 가져오기 시 사용 */
export function createMarathonIcs(marathon: Marathon): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://runzoa.com";
  const marathonUrl = `${origin}/marathon/${marathon.slug}`;
  const summary = icsEscape(marathon.name || "마라톤 대회");
  const location = icsEscape(
    [marathon.location?.region, marathon.location?.place].filter(Boolean).join(" ") || "",
  );
  const description = icsEscape(buildCalendarDescription(marathon, marathonUrl));

  const toIcsUtc = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d{3}/g, "").slice(0, 15) + "Z";

  const start = marathon.event_start_at ? new Date(marathon.event_start_at) : null;
  // 종일 이벤트: DTSTART;VALUE=DATE:YYYYMMDD
  const dtStart = start ? `DTSTART;VALUE=DATE:${toIcsDate(start)}` : "";
  const dtEnd = start ? `DTEND;VALUE=DATE:${toIcsDate(start)}` : "";

  const uid = `${marathon.id}@runzoa.com`;
  const dtstamp = toIcsUtc(new Date());

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Runzoa//Marathon//KO",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    dtStart,
    dtEnd,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.map(icsFold).join("\r\n");
}

/** 마라톤 공유: Web Share API 시도, 미지원/취소 시 링크 복사. 공유 성공 시 onShareSuccess(marathonId) 호출 */
export function shareMarathonLink(
  marathon: Marathon,
  onShareSuccess?: (marathonId: string) => void,
): void {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/marathon/${marathon.slug}`
      : "";
  const title = marathon.name || "마라톤 대회";
  const text = `${title} - 런조아에서 확인하기`;
  const reportShare = () => onShareSuccess?.(marathon.id);

  if (typeof navigator !== "undefined" && navigator.share) {
    navigator
      .share({ title, text, url })
      .then(() => {
        toast.success("공유되었습니다.");
        reportShare();
      })
      .catch((err: { name?: string }) => {
        if (err?.name !== "AbortError") {
          copyToClipboard(url, reportShare);
        }
      });
  } else {
    copyToClipboard(url, reportShare);
  }
}
