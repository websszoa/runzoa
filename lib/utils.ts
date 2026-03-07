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

type MarathonRegistrationPrice = {
  distance: string;
  price: number | null;
}[];

/** registration_price에서 거리 목록을 "10KM / 풀코스 / 하프" 형식으로 반환 */
export function formatRegistrationDistances(
  registrationPrice: MarathonRegistrationPrice | null | undefined,
): string {
  if (!registrationPrice || registrationPrice.length === 0) return "-";

  const distances = registrationPrice
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
  registrationPrice: MarathonRegistrationPrice | null | undefined,
): string {
  if (!registrationPrice || registrationPrice.length === 0) return "-";

  const prices = registrationPrice
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

/** 접수 시작일까지 남은 일수를 반환. 당일이면 0, 날짜 없으면 null */
export function getDaysUntilRegistration(
  registrationStartAt: string | null | undefined,
): number | null {
  if (!registrationStartAt) return null;
  const start = new Date(registrationStartAt);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
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
