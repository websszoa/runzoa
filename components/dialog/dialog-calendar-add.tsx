"use client";

import { Calendar } from "lucide-react";
import { APP_ENG_NAME } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getAddToCalendarUrl, createMarathonIcs } from "@/lib/utils";
import type { Marathon } from "@/lib/types";

interface DialogCalendarAddProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  marathon: Marathon | null;
}

export default function DialogCalendarAdd({
  open,
  onOpenChange,
  marathon,
}: DialogCalendarAddProps) {
  const handleAddToGoogleCalendar = () => {
    if (!marathon) return;
    window.open(getAddToCalendarUrl(marathon), "_blank");
    onOpenChange(false);
  };

  /** 네이버 로그인 OAuth 후 캘린더 API로 일정 추가 */
  const handleAddToNaverCalendar = () => {
    if (!marathon) return;
    onOpenChange(false);
    window.location.href = `/api/naver-calendar/authorize?state=${encodeURIComponent(marathon.id)}`;
  };

  /** .ics 파일 다운로드 (다른 캘린더 앱 가져오기용) */
  const handleDownloadIcs = () => {
    if (!marathon) return;
    const ics = createMarathonIcs(marathon);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${marathon.slug || marathon.id}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 font-paperlogy uppercase font-extrabold text-brand text-xl">
                <Calendar className="size-9" />
                {APP_ENG_NAME}
              </div>
            </div>
            <DialogTitle className="text-xl mt-2">
              캘린더에 추가
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-center font-anyvid break-keep">
            캘린더를 선택하여 추가해주세요!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 pt-2">
          <Button
            onClick={handleAddToGoogleCalendar}
            className="w-full h-11 flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50 transition-colors"
            variant="outline"
            size="lg"
          >
            구글 캘린더에 추가하기
          </Button>
          <Button
            onClick={handleAddToNaverCalendar}
            className="w-full h-11 flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50 transition-colors"
            variant="outline"
            size="lg"
          >
            네이버 캘린더에 추가하기
          </Button>
          <Button
            onClick={handleDownloadIcs}
            className="w-full h-11 flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50 transition-colors text-muted-foreground"
            variant="outline"
            size="lg"
          >
            .ics 파일로 다운로드
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
