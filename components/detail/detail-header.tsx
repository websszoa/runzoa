import { getEventStatus } from "@/lib/utils";
import type { Marathon } from "@/lib/types";

export default function DetailHeader({ marathon }: { marathon: Marathon }) {
  const status = getEventStatus(
    marathon.event_start_at ?? "",
    marathon.event_end_at ?? "",
  );

  return (
    <div className="detail__header">
      {/* 왼쪽 제목 + 설명 */}
      <div className="flex-1">
        <h2 className="text-2xl md:text-3xl font-paperlogy font-semibold mb-1 text-red-600">
          {marathon.name}
        </h2>
        <p className="text-muted-foreground font-anyvid text-sm break-keep">
          {marathon.description}
        </p>
      </div>

      {/* 오른쪽 D-Day / 종료 / 진행중 표시 (서버/클라이언트 시각 차이로 suppressHydrationWarning) */}
      <div
        className="shrink-0 font-anyvid flex flex-col items-center px-4 py-3 rounded-xl border-2"
        suppressHydrationWarning
      >
        {status === "종료" ? (
          <div className="border-gray-900 flex flex-col items-center">
            <span className="text-xs text-gray-600 mb-1">아쉽게도</span>
            <span className="font-paperlogy text-red-600 text-3xl font-semibold">
              종료
            </span>
          </div>
        ) : status === "진행중" ? (
          <div className="border-red-600 flex flex-col items-center">
            <span className="text-xs text-gray-600 mb-1">현재</span>
            <span className="font-paperlogy text-red-600 text-3xl font-semibold">
              진행중
            </span>
          </div>
        ) : (
          <div className="border-red-600 flex flex-col items-center">
            <span className="text-xs text-gray-600 mb-1">대회까지</span>
            <span className="font-paperlogy text-red-600 text-3xl font-semibold">
              {status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
