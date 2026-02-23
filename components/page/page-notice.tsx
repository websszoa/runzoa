import Image from "next/image";
import { notices } from "@/lib/notice";
import { Badge } from "../ui/badge";
import { ChevronRight, ChevronDown, CalendarDays } from "lucide-react";

// 왼쪽: 2~6번 공지 / 오른쪽: 1번 공지
const leftNotices = notices.filter((n) => n.id >= 2);
const mainNotice = notices.find((n) => n.id === 1);

export default function PageNotice() {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        {/* 왼쪽 - 모바일에서는 아래, 데스크톱에서는 왼쪽 */}
        <div className="order-2 lg:order-1 space-y-3 lg:space-y-4">
          {leftNotices.map((notice) => (
            <div
              key={notice.id}
              id={`notice-${notice.id}`}
              className="font-anyvid cursor-pointer rounded-lg border border-gray-200 px-4 py-4 sm:py-6 sm:px-6 hover:shadow-md transition-all duration-200 hover:border-brand/50"
            >
              <details className="group">
                <summary className="list-none [&::-webkit-details-marker]:hidden [&::marker]:hidden">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        notice.category === "중요" ? "destructive" : "default"
                      }
                      className="text-xs shrink-0"
                    >
                      {notice.category}
                    </Badge>
                    <h3 className="text-sm text-gray-700 transition-colors flex-1">
                      {notice.title}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-all shrink-0 group-open:hidden" />
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-all shrink-0 hidden group-open:block" />
                  </div>
                </summary>

                <div className="pt-4 mt-4 sm:pt-6 sm:mt-6 border-t text-muted-foreground">
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {notice.content}
                  </p>
                  <div className="flex items-center gap-1 text-sm mt-2">
                    <CalendarDays className="size-4" />
                    <span>{notice.date}</span>
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>

        {/* 오른쪽 - 1번 공지 (모바일에서는 위, 데스크톱에서는 오른쪽) */}
        <div
          id="notice-1"
          className="order-1 lg:order-2 space-y-4 border border-gray-200 rounded-lg p-4 lg:p-6 flex items-center justify-center"
        >
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] w-full text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 mb-3 overflow-hidden shrink-0">
              <Image
                src="/face/face01.png"
                alt="프로필"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>

            {mainNotice ? (
              <>
                <Badge
                  variant={
                    mainNotice!.category === "중요" ? "destructive" : "default"
                  }
                  className="text-xs font-anyvid mb-2"
                >
                  {mainNotice!.category}
                </Badge>
                <h3 className="text-gray-800 font-nanumNeo text-lg font-semibold mb-2 line-clamp-2">
                  {mainNotice.title}
                </h3>
                <p className="text-sm text-muted-foreground font-anyvid leading-relaxed text-justify mb-4">
                  {mainNotice.content}
                </p>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
