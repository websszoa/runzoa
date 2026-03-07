"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useLogin } from "@/contexts/login-context";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DialogAlertCalendar from "@/components/dialog/dialog-alert-calendar";
import type { MarathonLocation, MarathonRegistrationPrice } from "@/lib/types";

type AlertType = "entry" | "event";

type MarathonBtnAlertProps = {
  marathonId: string;
  slug: string;
  name: string;
  description: string;
  eventStartAt: string;
  registrationStartAt: string | null;
  registrationPrice: MarathonRegistrationPrice | null;
  location: MarathonLocation | null;
};

function toCalendarDate(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function buildGoogleCalendarUrl(title: string, dateStr: string): string {
  const date = toCalendarDate(dateStr);
  const nextDate = toCalendarDate(
    new Date(new Date(dateStr).getTime() + 86400000).toISOString(),
  );
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${date}/${nextDate}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}


export default function MarathonBtnAlert({
  marathonId,
  slug,
  name,
  description,
  eventStartAt,
  registrationStartAt,
  registrationPrice,
  location,
}: MarathonBtnAlertProps) {
  const { openLogin } = useLogin();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<AlertType>("event");
  const [isAlertedEvent, setIsAlertedEvent] = useState(false);
  const [isAlertedEntry, setIsAlertedEntry] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const [{ data: ev }, { data: en }] = await Promise.all([
        supabase.rpc("is_alerted", {
          p_marathon_id: marathonId,
          p_alert_type: "event",
        }),
        supabase.rpc("is_alerted", {
          p_marathon_id: marathonId,
          p_alert_type: "entry",
        }),
      ]);
      setIsAlertedEvent(!!ev);
      setIsAlertedEntry(!!en);
    });
  }, [marathonId]);

  const isAlerted = isAlertedEvent || isAlertedEntry;
  const selectedDate =
    selected === "event" ? eventStartAt : registrationStartAt!;
  const isCurrentAlerted =
    selected === "event" ? isAlertedEvent : isAlertedEntry;

  const handleOpenDialog = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      openLogin();
      toast.info("알림 설정은 로그인 후 이용할 수 있습니다.");
      return;
    }
    setOpen(true);
  };

  const handleCalendarAdd = async (type: "google" | "naver") => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      openLogin();
      toast.info("캘린더 추가는 로그인 후 이용할 수 있습니다.");
      return;
    }

    setIsLoading(true);

    if (type === "google") {
      const providerToken = session.provider_token;

      if (providerToken) {
        const res = await fetch("/api/calendar/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: name,
            date: selectedDate,
            marathonId,
            alertType: selected,
            providerToken,
            description,
            location,
            registrationPrice,
            registrationStartAt,
            slug,
            eventStartAt,
          }),
        });

        if (res.ok) {
          if (selected === "event") setIsAlertedEvent(true);
          else setIsAlertedEntry(true);
          toast.success("구글 캘린더에 추가했습니다.");
          setOpen(false);
          setIsLoading(false);
          return;
        }

        const err = await res.json();
        if (res.status !== 401) {
          toast.error(err.error ?? "캘린더 추가에 실패했습니다.");
          setIsLoading(false);
          return;
        }
      }

      // provider_token 없거나 만료 → URL 방식 fallback
      window.open(
        buildGoogleCalendarUrl(name, selectedDate),
        "_blank",
        "noopener,noreferrer",
      );

      if (!isCurrentAlerted) {
        await supabase.rpc("add_alert", {
          p_marathon_id: marathonId,
          p_alert_type: selected,
        });
        if (selected === "event") setIsAlertedEvent(true);
        else setIsAlertedEntry(true);
      }

      toast.success("구글 캘린더 페이지를 열었습니다.");
      setOpen(false);
    } else {
      // 네이버 캘린더 → API 방식 시도
      const res = await fetch("/api/calendar/naver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: name,
          date: selectedDate,
          marathonId,
          alertType: selected,
          description,
          location,
          registrationStartAt,
          slug,
          eventStartAt,
        }),
      });

      if (res.ok) {
        if (selected === "event") setIsAlertedEvent(true);
        else setIsAlertedEntry(true);
        toast.success("네이버 캘린더에 추가했습니다.");
        setOpen(false);
        setIsLoading(false);
        return;
      }

      if (res.status === 401) {
        // 토큰 없거나 만료 → Naver OAuth로 이동
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/api/auth/naver?redirect=${encodeURIComponent(currentPath)}`;
        setIsLoading(false);
        return;
      }

      const err = await res.json();
      toast.error(err.error ?? "캘린더 추가에 실패했습니다.");
      setOpen(false);
    }

    setIsLoading(false);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="알림 설정"
            onClick={handleOpenDialog}
            className={`h-9 w-9 shrink-0 border-slate-200 transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-200 ${
              isAlerted
                ? "text-red-500 bg-red-50 border-red-200"
                : "text-slate-600"
            }`}
          >
            <Bell className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-nanumNeo">
            {isAlerted ? "캘린더 추가됨" : "캘린더에 추가하기"}
          </p>
        </TooltipContent>
      </Tooltip>

      <DialogAlertCalendar
        open={open}
        onOpenChange={setOpen}
        name={name}
        eventStartAt={eventStartAt}
        registrationStartAt={registrationStartAt}
        selected={selected}
        onSelectedChange={setSelected}
        isAlertedEvent={isAlertedEvent}
        isAlertedEntry={isAlertedEntry}
        isLoading={isLoading}
        onCalendarAdd={handleCalendarAdd}
      />
    </>
  );
}
