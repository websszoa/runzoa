import { useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type RegionFilter = "domestic" | "international" | null;
type DistanceFilter = "all" | "FULL" | "HALF" | "10KM" | "5KM";
type StatusFilter = "all" | "접수대기" | "접수중" | "접수마감" | "추가접수";
type PastFilter = "exclude" | "include";

type AdminMarathonSearchProps = {
  keywordFilter: string;
  setKeywordFilter: (value: string) => void;
  totalCount: number;
  regionFilter: RegionFilter;
  yearFilter: number | null;
  monthFilter: number | null;
  areaFilter: string | null;
  distanceFilter: DistanceFilter;
  statusFilter: StatusFilter;
  eventTypeFilter: string | null;
  pastFilter: PastFilter;
};

export default function AdminMarathonSearch({
  keywordFilter,
  setKeywordFilter,
  totalCount,
  regionFilter,
  yearFilter,
  monthFilter,
  areaFilter,
  distanceFilter,
  statusFilter,
  eventTypeFilter,
  pastFilter,
}: AdminMarathonSearchProps) {
  const activeFilterLabels = useMemo(() => {
    const labels: string[] = [];

    if (regionFilter === "domestic") labels.push("국내");
    if (regionFilter === "international") labels.push("해외");
    if (yearFilter !== null) labels.push(`${yearFilter}년`);
    if (monthFilter !== null) labels.push(`${monthFilter}월`);
    if (areaFilter !== null) labels.push(areaFilter);
    if (distanceFilter !== "all") labels.push(distanceFilter);
    if (statusFilter !== "all") labels.push(statusFilter);
    if (eventTypeFilter) labels.push(eventTypeFilter);
    if (pastFilter === "exclude") labels.push("지난 대회 제외");
    if (keywordFilter.trim()) labels.push(`검색: ${keywordFilter.trim()}`);

    return labels;
  }, [
    regionFilter,
    yearFilter,
    monthFilter,
    areaFilter,
    distanceFilter,
    statusFilter,
    eventTypeFilter,
    pastFilter,
    keywordFilter,
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-2 items-stretch">
      <div className="md:col-span-2">
        <div className="relative h-full">
          <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="마라톤 검색"
            className="h-full rounded-lg pl-10"
            value={keywordFilter}
            onChange={(e) => {
              setKeywordFilter(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="md:col-span-8 border rounded-lg p-3 text-sm bg-muted/50 text-muted-foreground font-anyvid text-center flex items-center justify-center">
        <p>
          현재 <span className="strong">{totalCount}</span>
          개의 마라톤 대회가 있습니다.
          {activeFilterLabels.length > 0 && (
            <>
              {" "}
              [{activeFilterLabels.join(", ")}]
            </>
          )}
        </p>
      </div>
    </div>
  );
}
