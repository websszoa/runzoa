import { APP_INSTAGRAM_URL, APP_THREADS_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AtSign, Instagram, Settings } from "lucide-react";

type CountryFilter = "all" | "domestic" | "international";
type YearFilter = "all" | number;
type MonthFilter = "all" | number;
type AreaFilter = string | null;
type DistanceFilter = "all" | "FULL" | "HALF" | "10KM" | "5KM";
type EventFilter = "all" | string;
type StatusFilter = "all" | "접수대기" | "접수중" | "접수마감" | "추가접수";
type PastFilter = "exclude" | "include";

type MarathonFilterProps = {
  isFilterOpen: boolean;
  onToggleFilter: () => void;
  countryFilter: CountryFilter;
  setCountryFilter: (value: CountryFilter) => void;
  yearFilter: YearFilter;
  setYearFilter: (value: YearFilter) => void;
  monthFilter: MonthFilter;
  setMonthFilter: (value: MonthFilter) => void;
  areaFilter: AreaFilter;
  setAreaFilter: (value: AreaFilter) => void;
  distanceFilter: DistanceFilter;
  setDistanceFilter: (value: DistanceFilter) => void;
  eventFilter: EventFilter;
  setEventFilter: (value: EventFilter) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
  pastFilter: PastFilter;
  setPastFilter: (value: PastFilter) => void;
  availableYears: number[];
  availableMonths: number[];
  availableAreas: string[];
  availableEventTypes: string[];
};

export default function MarathonFilter({
  isFilterOpen,
  onToggleFilter,
  countryFilter,
  setCountryFilter,
  yearFilter,
  setYearFilter,
  monthFilter,
  setMonthFilter,
  areaFilter,
  setAreaFilter,
  distanceFilter,
  setDistanceFilter,
  eventFilter,
  setEventFilter,
  statusFilter,
  setStatusFilter,
  pastFilter,
  setPastFilter,
  availableYears,
  availableMonths,
  availableAreas,
  availableEventTypes,
}: MarathonFilterProps) {
  return (
    <div className="marathon__filter">
      <div className="flex gap-1 justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isFilterOpen ? "destructive" : "pink"}
              className="w-10 h-10 rounded-full"
              onClick={onToggleFilter}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isFilterOpen ? "검색 필터 접기" : "검색 필터 펼치기"}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="pink" className="w-10 h-10 rounded-full" asChild>
              <a
                href={APP_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>인스타그램</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="pink" className="w-10 h-10 rounded-full" asChild>
              <a href={APP_THREADS_URL} target="_blank" rel="noopener noreferrer">
                <AtSign className="h-4 w-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>스레드</p>
          </TooltipContent>
        </Tooltip>
      </div>
      {isFilterOpen && (
        <div className="border p-4 rounded mt-2">
          {/* 국내/해외 */}
          <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
            <Button
              size="sm"
              variant={countryFilter === "all" ? "destructive" : "outline"}
              onClick={() => {
                setCountryFilter("all");
                setAreaFilter(null);
              }}
            >
              전체
            </Button>
            <Button
              size="sm"
              variant={countryFilter === "domestic" ? "destructive" : "outline"}
              onClick={() => {
                setCountryFilter("domestic");
                setAreaFilter(null);
              }}
            >
              국내
            </Button>
            <Button
              size="sm"
              variant={
                countryFilter === "international" ? "destructive" : "outline"
              }
              onClick={() => {
                setCountryFilter("international");
                setAreaFilter(null);
              }}
            >
              해외
            </Button>
          </div>

          {/* 년도 */}
          <div className="flex flex-wrap items-center gap-1 text-muted-foreground mt-2">
            <Button
              size="sm"
              variant={yearFilter === "all" ? "destructive" : "outline"}
              onClick={() => {
                setYearFilter("all");
                setMonthFilter("all");
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
                  setMonthFilter("all");
                  setAreaFilter(null);
                }}
              >
                {year}
              </Button>
            ))}
          </div>

          {/* 월 */}
          <div className="flex flex-wrap items-center gap-1 text-muted-foreground mt-2">
            <Button
              size="sm"
              variant={monthFilter === "all" ? "destructive" : "outline"}
              onClick={() => {
                setMonthFilter("all");
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
          <div className="flex flex-wrap items-center gap-1 text-muted-foreground mt-2">
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

          {/* 코스 */}
          <div className="flex flex-wrap items-center gap-1 text-muted-foreground mt-2">
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

          {/* event type */}
          <div className="flex flex-wrap items-center gap-1 text-muted-foreground mt-2">
            <Button
              size="sm"
              variant={eventFilter === "all" ? "destructive" : "outline"}
              onClick={() => setEventFilter("all")}
            >
              전체
            </Button>
            {availableEventTypes.map((eventType) => (
              <Button
                key={eventType}
                size="sm"
                variant={eventFilter === eventType ? "destructive" : "outline"}
                onClick={() => setEventFilter(eventType)}
              >
                {eventType}
              </Button>
            ))}
          </div>

          {/* 접수 상태 */}
          <div className="flex flex-wrap items-center gap-1 text-muted-foreground mt-2">
            {(
              ["all", "접수대기", "접수중", "접수마감", "추가접수"] as const
            ).map((status) => (
              <Button
                key={status}
                size="sm"
                variant={statusFilter === status ? "destructive" : "outline"}
                onClick={() => setStatusFilter(status)}
              >
                {status === "all" ? "전체" : status}
              </Button>
            ))}
          </div>

          {/* 지난 대회 포함 여부 */}
          <div className="flex flex-wrap items-center gap-1 text-muted-foreground mt-2">
            <Button
              size="sm"
              variant={pastFilter === "exclude" ? "destructive" : "outline"}
              onClick={() => setPastFilter("exclude")}
            >
              지난대회 비포함
            </Button>
            <Button
              size="sm"
              variant={pastFilter === "include" ? "destructive" : "outline"}
              onClick={() => setPastFilter("include")}
            >
              지난대회 포함
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
