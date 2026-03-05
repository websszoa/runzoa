import { useMemo } from "react";

type CountryFilter = "all" | "domestic" | "international";
type YearFilter = "all" | number;
type MonthFilter = "all" | number;
type AreaFilter = string | null;
type DistanceFilter = "all" | "FULL" | "HALF" | "10KM" | "5KM";
type EventFilter = "all" | string;
type StatusFilter = "all" | "접수대기" | "접수중" | "접수마감" | "추가접수";
type PastFilter = "exclude" | "include";

type MarathonNoticeProps = {
  totalCount: number;
  countryFilter: CountryFilter;
  yearFilter: YearFilter;
  monthFilter: MonthFilter;
  areaFilter: AreaFilter;
  distanceFilter: DistanceFilter;
  eventFilter: EventFilter;
  statusFilter: StatusFilter;
  pastFilter: PastFilter;
  keywordFilter: string;
};

export default function MarathonNotice({
  totalCount,
  countryFilter,
  yearFilter,
  monthFilter,
  areaFilter,
  distanceFilter,
  eventFilter,
  statusFilter,
  pastFilter,
  keywordFilter,
}: MarathonNoticeProps) {
  const activeFilterLabels = useMemo(() => {
    const labels: string[] = [];

    if (countryFilter === "domestic") labels.push("국내");
    if (countryFilter === "international") labels.push("해외");
    if (yearFilter !== "all") labels.push(`${yearFilter}년`);
    if (monthFilter !== "all") labels.push(`${monthFilter}월`);
    if (areaFilter !== null) labels.push(areaFilter);
    if (distanceFilter !== "all") labels.push(distanceFilter);
    if (eventFilter !== "all") labels.push(eventFilter);
    if (statusFilter !== "all") labels.push(statusFilter);
    if (pastFilter === "include") labels.push("지난대회 포함");
    if (keywordFilter) labels.push(`검색:${keywordFilter}`);

    return labels;
  }, [
    countryFilter,
    yearFilter,
    monthFilter,
    areaFilter,
    distanceFilter,
    eventFilter,
    statusFilter,
    pastFilter,
    keywordFilter,
  ]);

  return (
    <div className="marathon__notice">
      <div className="my-4 border text-muted-foreground text-sm border-gray-200/80 rounded font-anyvid text-center bg-slate-50/80 px-4 py-3">
        <p>
          현재 <span className="text-brand font-semibold">{totalCount}</span>개의
          마라톤 대회가 있습니다.
          {activeFilterLabels.length > 0 && (
            <> [{activeFilterLabels.join(", ")}]</>
          )}
        </p>
      </div>
    </div>
  );
}
