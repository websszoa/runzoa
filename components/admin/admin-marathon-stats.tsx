import { useMemo } from "react";
import { Marathon } from "@/lib/types";

type AdminMarathonStatsProps = {
  marathons: Marathon[];
};

export default function AdminMarathonStats({
  marathons,
}: AdminMarathonStatsProps) {
  const { receiving, additional, closed, waiting } = useMemo(() => {
    const receiving = marathons.filter(
      (m) => m.registration_status === "접수중",
    ).length;
    const additional = marathons.filter(
      (m) => m.registration_status === "추가접수",
    ).length;
    const closed = marathons.filter(
      (m) => m.registration_status === "접수마감",
    ).length;
    const waiting = marathons.filter(
      (m) => m.registration_status === "접수대기",
    ).length;

    return { receiving, additional, closed, waiting };
  }, [marathons]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      <div className="bg-white border rounded-lg p-4">
        <p className="text-sm text-muted-foreground font-paperlogy">전체 대회</p>
        <p className="text-2xl font-semibold font-paperlogy">
          {marathons.length}
        </p>
      </div>
      <div className="bg-white border rounded-lg p-4">
        <p className="text-sm text-muted-foreground font-paperlogy">접수중</p>
        <p className="text-2xl font-semibold font-paperlogy text-green-600">
          {receiving}
        </p>
      </div>
      <div className="bg-white border rounded-lg p-4">
        <p className="text-sm text-muted-foreground font-paperlogy">접수마감</p>
        <p className="text-2xl font-semibold font-paperlogy text-red-600">
          {closed}
        </p>
      </div>
      <div className="bg-white border rounded-lg p-4">
        <p className="text-sm text-muted-foreground font-paperlogy">접수 대기</p>
        <p className="text-2xl font-semibold font-paperlogy text-yellow-600">
          {waiting}
        </p>
      </div>
      <div className="bg-white border rounded-lg p-4">
        <p className="text-sm text-muted-foreground font-paperlogy">추가접수</p>
        <p className="text-2xl font-semibold font-paperlogy text-blue-600">
          {additional}
        </p>
      </div>
    </div>
  );
}
