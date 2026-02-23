import { Button } from "@/components/ui/button";

type RegionFilter = "domestic" | "international" | null;
type DistanceFilter = "all" | "FULL" | "HALF" | "10KM" | "5KM";
type StatusFilter = "all" | "접수대기" | "접수중" | "접수마감" | "추가접수";
type PastFilter = "exclude" | "include";

type AdminMarathonFilterProps = {
  regionFilter: RegionFilter;
  yearFilter: number | null;
  monthFilter: number | null;
  areaFilter: string | null;
  distanceFilter: DistanceFilter;
  eventTypeFilter: string | null;
  statusFilter: StatusFilter;
  pastFilter: PastFilter;
  availableYears: number[];
  availableMonths: number[];
  availableAreas: string[];
  availableEventTypes: string[];
  setRegionFilter: (value: RegionFilter) => void;
  setYearFilter: (value: number | null) => void;
  setMonthFilter: (value: number | null) => void;
  setAreaFilter: (value: string | null) => void;
  setDistanceFilter: (value: DistanceFilter) => void;
  setEventTypeFilter: (value: string | null) => void;
  setStatusFilter: (value: StatusFilter) => void;
  setPastFilter: (value: PastFilter) => void;
};

export default function AdminMarathonFilter({
  regionFilter,
  yearFilter,
  monthFilter,
  areaFilter,
  distanceFilter,
  eventTypeFilter,
  statusFilter,
  pastFilter,
  availableYears,
  availableMonths,
  availableAreas,
  availableEventTypes,
  setRegionFilter,
  setYearFilter,
  setMonthFilter,
  setAreaFilter,
  setDistanceFilter,
  setEventTypeFilter,
  setStatusFilter,
  setPastFilter,
}: AdminMarathonFilterProps) {
  const hasData =
    availableYears.length > 0 ||
    availableMonths.length > 0 ||
    availableAreas.length > 0 ||
    availableEventTypes.length > 0;

  if (!hasData) return null;

  return (
    <div className="border rounded-lg p-4 space-y-2">
      {/* 국내/해외 */}
      <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
        <Button
          size="sm"
          variant={regionFilter === null ? "destructive" : "outline"}
          onClick={() => {
            setRegionFilter(null);
            setAreaFilter(null);
          }}
        >
          전체
        </Button>
        <Button
          size="sm"
          variant={regionFilter === "domestic" ? "destructive" : "outline"}
          onClick={() => {
            setRegionFilter("domestic");
            setAreaFilter(null);
          }}
        >
          국내
        </Button>
        <Button
          size="sm"
          variant={regionFilter === "international" ? "destructive" : "outline"}
          onClick={() => {
            setRegionFilter("international");
            setAreaFilter(null);
          }}
        >
          해외
        </Button>
      </div>

      {/* 년도 */}
      <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
        <Button
          size="sm"
          variant={yearFilter === null ? "destructive" : "outline"}
          onClick={() => {
            setYearFilter(null);
            setMonthFilter(null);
            setAreaFilter(null);
          }}
        >
          전체
        </Button>
        {availableYears.map((year) => (
          <Button
            key={year}
            size="sm"
            variant={yearFilter === year ? "destructive" : "outline"}
            onClick={() => {
              setYearFilter(year);
              setMonthFilter(null);
              setAreaFilter(null);
            }}
          >
            {year}
          </Button>
        ))}
      </div>

      {/* 월 */}
      <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
        <Button
          size="sm"
          variant={monthFilter === null ? "destructive" : "outline"}
          onClick={() => {
            setMonthFilter(null);
            setAreaFilter(null);
          }}
        >
          전체
        </Button>
        {availableMonths.map((month) => (
          <Button
            key={month}
            size="sm"
            variant={monthFilter === month ? "destructive" : "outline"}
            onClick={() => {
              setMonthFilter(month);
              setAreaFilter(null);
            }}
          >
            {month}월
          </Button>
        ))}
      </div>

      {/* 지역 */}
      <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
        <Button
          size="sm"
          variant={areaFilter === null ? "destructive" : "outline"}
          onClick={() => setAreaFilter(null)}
        >
          전체
        </Button>
        {availableAreas.map((area) => (
          <Button
            key={area}
            size="sm"
            variant={areaFilter === area ? "destructive" : "outline"}
            onClick={() => setAreaFilter(area)}
          >
            {area}
          </Button>
        ))}
      </div>

      {/* 거리 */}
      <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
        <Button
          size="sm"
          variant={distanceFilter === "all" ? "destructive" : "outline"}
          onClick={() => setDistanceFilter("all")}
        >
          전체
        </Button>
        {(["FULL", "HALF", "10KM", "5KM"] as const).map((distance) => (
          <Button
            key={distance}
            size="sm"
            variant={distanceFilter === distance ? "destructive" : "outline"}
            onClick={() => setDistanceFilter(distance)}
          >
            {distance}
          </Button>
        ))}
      </div>

      {/* 이벤트 타입 */}
      <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
        <Button
          size="sm"
          variant={eventTypeFilter === null ? "destructive" : "outline"}
          onClick={() => setEventTypeFilter(null)}
        >
          전체
        </Button>
        {availableEventTypes.map((eventType) => (
          <Button
            key={eventType}
            size="sm"
            variant={eventTypeFilter === eventType ? "destructive" : "outline"}
            onClick={() => setEventTypeFilter(eventType)}
          >
            {eventType}
          </Button>
        ))}
      </div>

      {/* 상태 */}
      <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
        {(["all", "접수대기", "접수중", "접수마감", "추가접수"] as const).map(
          (status) => (
            <Button
              key={status}
              size="sm"
              variant={statusFilter === status ? "destructive" : "outline"}
              onClick={() => setStatusFilter(status)}
            >
              {status === "all" ? "전체" : status}
            </Button>
          ),
        )}
      </div>

      {/* 지난 대회 포함 여부 */}
      <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
        <Button
          size="sm"
          variant={pastFilter === "exclude" ? "destructive" : "outline"}
          onClick={() => setPastFilter("exclude")}
        >
          지난 대회 제외
        </Button>
        <Button
          size="sm"
          variant={pastFilter === "include" ? "destructive" : "outline"}
          onClick={() => setPastFilter("include")}
        >
          지난 대회 포함
        </Button>
      </div>
    </div>
  );
}
