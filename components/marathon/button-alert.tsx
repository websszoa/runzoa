"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useLogin } from "@/contexts/login-context";
import { cn } from "@/lib/utils";
import type { Marathon } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DialogCalendarAdd from "@/components/dialog/dialog-calendar-add";

type ButtonAlertProps = {
  marathon: Marathon;
  className?: string;
};

export default function ButtonAlert({ marathon, className }: ButtonAlertProps) {
  const { openLogin } = useLogin();
  const supabase = createClient();
  const [isAlerted, setIsAlerted] = useState<boolean | null>(null);
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [calendarDialogMarathon, setCalendarDialogMarathon] = useState<Marathon | null>(null);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      const { data } = await supabase.rpc("is_marathon_alerted", {
        p_marathon_id: marathon.id,
      });
      if (!cancelled) setIsAlerted(!!data);
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [marathon.id]);

  const handleClick = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      openLogin();
      toast.info("로그인 후 알림을 설정할 수 있어요.");
      return;
    }

    const { data, error } = await supabase.rpc("toggle_marathon_alert", {
      p_marathon_id: marathon.id,
    });

    if (error) {
      toast.error(error.message || "처리 중 오류가 발생했습니다.");
      return;
    }

    setIsAlerted(data === true);
    if (data === true) {
      toast.success("캘린더를 선택하여 추가해주세요!");
      setCalendarDialogMarathon(marathon);
      setCalendarDialogOpen(true);
    } else {
      toast.success("알림 설정을 해제했습니다.");
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              "button-alert",
              className,
              isAlerted && "bg-amber-50 border-amber-200 text-amber-700",
            )}
            aria-label={isAlerted ? "알림 해제" : "알림 설정"}
            onClick={handleClick}
          >
            <Bell className={cn("h-4 w-4", isAlerted && "text-amber-600")} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-nanumNeo">
            {isAlerted ? "알림 해제" : "알림 설정"}
          </p>
        </TooltipContent>
      </Tooltip>
      <DialogCalendarAdd
        open={calendarDialogOpen}
        onOpenChange={setCalendarDialogOpen}
        marathon={calendarDialogMarathon}
      />
    </>
  );
}
