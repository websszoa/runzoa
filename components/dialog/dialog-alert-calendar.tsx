"use client";

import Image from "next/image";
import { APP_ENG_NAME } from "@/lib/constants";
import { formatDateWithWeekday } from "@/lib/utils";
import { Bell, TentTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type AlertCalendarType = "entry" | "event";

type DialogAlertCalendarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  eventStartAt: string;
  registrationStartAt: string | null;
  selected: AlertCalendarType;
  onSelectedChange: (value: AlertCalendarType) => void;
  isAlertedEvent: boolean;
  isAlertedEntry: boolean;
  isLoading: boolean;
  onCalendarAdd: (type: "google" | "naver") => void | Promise<void>;
};

export default function DialogAlertCalendar({
  open,
  onOpenChange,
  name,
  eventStartAt,
  registrationStartAt,
  selected,
  onSelectedChange,
  isAlertedEvent,
  isAlertedEntry,
  isLoading,
  onCalendarAdd,
}: DialogAlertCalendarProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 font-paperlogy font-extrabold uppercase text-brand text-xl">
                <TentTree className="size-9" />
                {APP_ENG_NAME}
              </div>
            </div>
            <DialogTitle className="text-xl mt-2 font-nanumNeo text-center">
              {name}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-center font-anyvid break-keep">
            원하는 캘린더를 선택해 일정을 추가할 수 있으며, 서비스 계정 로그인이
            필요할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        {/* 날짜 선택 */}
        <div className="space-y-2">
          <p className="text-sm font-nanumNeo text-slate-600">날짜 선택</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => onSelectedChange("event")}
              className={`h-auto flex flex-col gap-1 border p-3 text-left transition-colors hover:bg-brand/5 hover:text-brand
                 ${
                   selected === "event"
                     ? "border-brand bg-brand/5 text-brand"
                     : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                 }`}
            >
              <span className="text-xs font-nanumNeo font-semibold flex items-center gap-1">
                대회날짜
                {isAlertedEvent && (
                  <Bell className="h-3 w-3 text-red-500 fill-red-500" />
                )}
              </span>
              <span className="text-xs font-anyvid text-muted-foreground">
                {formatDateWithWeekday(eventStartAt)}
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={() => registrationStartAt && onSelectedChange("entry")}
              disabled={!registrationStartAt}
              className={`h-auto flex flex-col gap-1 border p-3 text-left transition-colors hover:bg-brand/5 hover:text-brand ${
                !registrationStartAt
                  ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                  : selected === "entry"
                    ? "border-brand bg-brand/5 text-brand"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span className="text-xs font-nanumNeo font-semibold flex items-center gap-1">
                접수날짜
                {isAlertedEntry && (
                  <Bell className="h-3 w-3 text-red-500 fill-red-500" />
                )}
              </span>
              <span className="text-xs font-anyvid text-muted-foreground">
                {registrationStartAt
                  ? formatDateWithWeekday(registrationStartAt)
                  : "날짜 미정"}
              </span>
            </Button>
          </div>
        </div>

        {/* 캘린더 추가 버튼 */}
        <div className="space-y-2">
          <p className="text-sm font-nanumNeo text-slate-600">캘린더 선택</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              disabled={isLoading}
              className="flex flex-col items-center justify-center gap-2 min-h-[72px] border-slate-200 font-nanumNeo text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 py-4 px-3"
              onClick={() => onCalendarAdd("google")}
            >
              <Image
                src="/svg/google.svg"
                alt="구글 캘린더"
                width={24}
                height={24}
                className="shrink-0"
              />
              <span className="text-xs">구글 캘린더</span>
            </Button>
            <Button
              variant="outline"
              disabled={isLoading}
              className="flex flex-col items-center justify-center gap-2 min-h-[72px] border-slate-200 font-nanumNeo text-slate-700 hover:bg-green-50 hover:text-green-600 hover:border-green-200 py-4 px-3"
              onClick={() => onCalendarAdd("naver")}
            >
              <Image
                src="/svg/naver.svg"
                alt="네이버 캘린더"
                width={24}
                height={24}
                className="shrink-0"
              />
              <span className="text-xs">네이버 캘린더</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
