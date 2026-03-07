import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { MarathonLocation } from "@/lib/types";

function fmtDate(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function fmtDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  const base = fmtDate(dateStr);
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  if (h === "00" && min === "00") return base;
  return `${base} ${h}:${min}`;
}

function buildDescription(params: {
  name: string;
  description: string;
  eventStartAt: string;
  registrationStartAt: string | null;
  slug: string;
  alertType: "event" | "entry";
}): string {
  const {
    name,
    description,
    eventStartAt,
    registrationStartAt,
    slug,
    alertType,
  } = params;

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

  return lines.join("\n");
}


// 이벤트 시작 기준 "전날 오후 5시"까지 남은 분 계산
function minutesUntilPrevDay5pm(dateStr: string): number {
  const eventDate = new Date(dateStr);
  const prev5pm = new Date(eventDate);
  prev5pm.setDate(prev5pm.getDate() - 1);
  prev5pm.setHours(17, 0, 0, 0);
  const diff = Math.round((eventDate.getTime() - prev5pm.getTime()) / 60000);
  return diff > 0 ? diff : 1440;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    title,
    date,
    marathonId,
    alertType,
    providerToken,
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
    providerToken: string;
    description: string;
    location: MarathonLocation | null;
    registrationStartAt: string | null;
    slug: string;
    eventStartAt: string;
  };

  if (!providerToken) {
    return NextResponse.json(
      { error: "Google 로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateOnly = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

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

  const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0;
  const nextD = new Date(d.getTime() + 86400000);
  const nextDateOnly = `${nextD.getFullYear()}-${pad(nextD.getMonth() + 1)}-${pad(nextD.getDate())}`;

  const prevDay5pm = minutesUntilPrevDay5pm(date);
  const reminderOverrides: { method: string; minutes: number }[] = [
    { method: "popup", minutes: prevDay5pm }, // 전날 오후 5시
  ];
  if (hasTime) {
    reminderOverrides.push({ method: "popup", minutes: 60 }); // 시작 1시간 전
  }

  const event: Record<string, unknown> = {
    summary: alertType === "entry" ? `[접수] ${title}` : title,
    location: locationStr || undefined,
    description: descriptionStr,
    reminders: { useDefault: false, overrides: reminderOverrides },
  };

  if (hasTime) {
    const endDate = new Date(d.getTime() + 3600000);
    event.start = { dateTime: d.toISOString(), timeZone: "Asia/Seoul" };
    event.end = { dateTime: endDate.toISOString(), timeZone: "Asia/Seoul" };
  } else {
    event.start = { date: dateOnly };
    event.end = { date: nextDateOnly };
  }

  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;
  const calRes = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${providerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    },
  );

  if (!calRes.ok) {
    const err = await calRes.json();
    return NextResponse.json(
      { error: err.error?.message ?? "캘린더 추가에 실패했습니다." },
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
