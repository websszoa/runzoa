import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { MarathonLocation } from "@/lib/types";
import { cookies } from "next/headers";

function fmtDate(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function fmtDateTime(dateStr: string): string {
  const base = fmtDate(dateStr);
  const d = new Date(dateStr);
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  if (h === "00" && min === "00") return base;
  return `${base} ${h}:${min}`;
}

function toICalDate(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function toICalDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${y}${mo}${day}T${h}${mi}${s}`;
}

function buildDescription(params: {
  name: string;
  description: string;
  eventStartAt: string;
  registrationStartAt: string | null;
  slug: string;
  alertType: "event" | "entry";
}): string {
  const { name, description, eventStartAt, registrationStartAt, slug, alertType } = params;

  const lines: string[] = [];
  lines.push(name);
  if (description) lines.push(description);
  lines.push("");

  if (alertType === "entry") {
    lines.push(`접수 시작일 : ${fmtDate(registrationStartAt!)}`);
    lines.push(`대회 날짜 : ${fmtDateTime(eventStartAt)}`);
  } else {
    lines.push(`대회 날짜 : ${fmtDateTime(eventStartAt)}`);
    if (registrationStartAt) {
      lines.push(`접수 날짜 : ${fmtDate(registrationStartAt)}`);
    }
  }

  lines.push(
    `자세히 보기 : https://www.runzoa.com/marathon/${slug}`,
    `런조아 : https://runzoa.com`,
  );

  return lines.join("\\n");
}

function minutesUntilPrevDay5pm(dateStr: string): number {
  const eventDate = new Date(dateStr);
  const prev5pm = new Date(eventDate);
  prev5pm.setDate(prev5pm.getDate() - 1);
  prev5pm.setHours(17, 0, 0, 0);
  const diff = Math.round((eventDate.getTime() - prev5pm.getTime()) / 60000);
  return diff > 0 ? diff : 1440;
}

function buildICalEvent(params: {
  title: string;
  date: string;
  description: string;
  location: string;
  alertType: "event" | "entry";
  eventStartAt: string;
}): string {
  const { title, date, description, location, alertType, eventStartAt } = params;

  const d = new Date(date);
  const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0;

  const summary = alertType === "entry" ? `[접수] ${title}` : title;
  const uid = `runzoa-${Date.now()}@runzoa.com`;

  const dtstart = hasTime
    ? `DTSTART;TZID=Asia/Seoul:${toICalDateTime(date)}`
    : `DTSTART;VALUE=DATE:${toICalDate(date)}`;

  const nextDay = new Date(d.getTime() + 86400000);
  const dtend = hasTime
    ? `DTEND;TZID=Asia/Seoul:${toICalDateTime(new Date(d.getTime() + 3600000).toISOString())}`
    : `DTEND;VALUE=DATE:${toICalDate(nextDay.toISOString())}`;

  const prevDay5pmMinutes = minutesUntilPrevDay5pm(date);

  const alarms: string[] = [];

  // 전날 오후 5시 알림
  alarms.push(
    `BEGIN:VALARM`,
    `TRIGGER:-PT${prevDay5pmMinutes}M`,
    `ACTION:DISPLAY`,
    `DESCRIPTION:${summary} 내일입니다!`,
    `END:VALARM`,
  );

  // 시작 1시간 전 알림 (시간이 있을 때만)
  if (hasTime) {
    alarms.push(
      `BEGIN:VALARM`,
      `TRIGGER:-PT60M`,
      `ACTION:DISPLAY`,
      `DESCRIPTION:${summary} 1시간 전입니다!`,
      `END:VALARM`,
    );
  }

  const lines = [
    `BEGIN:VCALENDAR`,
    `VERSION:2.0`,
    `PRODID:-//Runzoa//Runzoa Calendar//KO`,
    `BEGIN:VEVENT`,
    `UID:${uid}`,
    dtstart,
    dtend,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    ...(location ? [`LOCATION:${location}`] : []),
    ...alarms,
    `END:VEVENT`,
    `END:VCALENDAR`,
  ];

  return lines.join("\r\n");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    title,
    date,
    marathonId,
    alertType,
    description,
    location,
    registrationStartAt,
    slug,
    eventStartAt,
  } = body as {
    title: string;
    date: string;
    marathonId: string;
    alertType: "event" | "entry";
    description: string;
    location: MarathonLocation | null;
    registrationStartAt: string | null;
    slug: string;
    eventStartAt: string;
  };

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("naver_calendar_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "네이버 로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const locationStr = [location?.region, location?.place]
    .filter(Boolean)
    .join(" ");

  const descriptionStr = buildDescription({
    name: title,
    description,
    eventStartAt,
    registrationStartAt,
    slug,
    alertType,
  });

  const icalData = buildICalEvent({
    title,
    date,
    description: descriptionStr,
    location: locationStr,
    alertType,
    eventStartAt,
  });

  const calRes = await fetch(
    "https://openapi.naver.com/v1/calendar/createSchedule.json",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      },
      body: new URLSearchParams({ calendarData: icalData }).toString(),
    },
  );

  if (!calRes.ok) {
    const err = await calRes.text();
    if (calRes.status === 401) {
      return NextResponse.json(
        { error: "네이버 토큰이 만료되었습니다." },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: err || "캘린더 추가에 실패했습니다." },
      { status: calRes.status },
    );
  }

  const supabase = await createClient();
  await supabase.rpc("add_alert", {
    p_marathon_id: marathonId,
    p_alert_type: alertType,
  });

  return NextResponse.json({ success: true });
}
