"use client";

import { useEffect, useMemo, useState } from "react";
import { Marathon, SearchFormValues } from "@/lib/types";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useIsMobile } from "@/hooks/use-mobile";

import MarathonTitle from "./marathon-title";
import MarathonListCard from "./marathon-list-card";
import MarathonListDate from "./marathon-list-date";
import MarathonListImage from "./marathon-list-image";
import MarathonListMedal from "./marathon-list-medal";
import MarathonNoData from "./marathon-no-data";
import MarathonFilter from "./marathon-filter";
import MarathonNotice from "./marathon-notice";
import MarathonSearchBar from "./marathon-search-bar";

type ViewMode = "card" | "date" | "image" | "medal";
type CountryFilter = "all" | "domestic" | "international";
type YearFilter = "all" | number;
type MonthFilter = "all" | number;
type AreaFilter = string | null;
type DistanceFilter = "all" | "FULL" | "HALF" | "10KM" | "5KM";
type EventFilter = "all" | string;
type StatusFilter = "all" | "접수대기" | "접수중" | "접수마감" | "추가접수";
type PastFilter = "exclude" | "include";

export default function MarathonMain({ marathons }: { marathons: Marathon[] }) {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [keywordFilter, setKeywordFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const [countryFilter, setCountryFilter] = useState<CountryFilter>("all");
  const [yearFilter, setYearFilter] = useState<YearFilter>("all");
  const [monthFilter, setMonthFilter] = useState<MonthFilter>("all");
  const [areaFilter, setAreaFilter] = useState<AreaFilter>(null);
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>("all");
  const [eventFilter, setEventFilter] = useState<EventFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [pastFilter, setPastFilter] = useState<PastFilter>("exclude");

  const form = useForm<SearchFormValues>({
    defaultValues: {
      keyword: "",
    },
  });

  const onSubmitSearch: SubmitHandler<SearchFormValues> = ({ keyword }) => {
    setKeywordFilter(keyword.trim());
  };

  useEffect(() => {
    setIsFilterOpen(!isMobile);
  }, [isMobile]);

  /** 연도 버튼 목록 필터링 */
  const availableYears = useMemo(
    () =>
      [...new Set(marathons.map((marathon) => marathon.year))].sort(
        (a, b) => b - a,
      ),
    [marathons],
  );

  /** event type 버튼 목록 */
  const availableEventTypes = useMemo(
    () => [
      ...new Set(
        marathons
          .map((marathon) => marathon.event_type?.trim())
          .filter((eventType): eventType is string => Boolean(eventType)),
      ),
    ],
    [marathons],
  );

  /** 1차 필터:국가(국내/해외) 버튼 목록 필터링 */
  const countryFilteredMarathons = useMemo(() => {
    if (countryFilter === "all") return marathons;
    if (countryFilter === "domestic") {
      return marathons.filter((marathon) => marathon.country.includes("한국"));
    }
    return marathons.filter((marathon) => !marathon.country.includes("한국"));
  }, [marathons, countryFilter]);

  /** 2차 필터: 년도 */
  const yearFilteredMarathons = useMemo(() => {
    if (yearFilter === "all") return countryFilteredMarathons;
    return countryFilteredMarathons.filter(
      (marathon) => marathon.year === yearFilter,
    );
  }, [countryFilteredMarathons, yearFilter]);

  /** 월 버튼 목록 (선택된 년도 기준) */
  const availableMonths = useMemo(
    () =>
      [
        ...new Set(yearFilteredMarathons.map((marathon) => marathon.month)),
      ].sort((a, b) => a - b),
    [yearFilteredMarathons],
  );

  /** 3차 필터: 월 */
  const monthFilteredMarathons = useMemo(() => {
    if (monthFilter === "all") return yearFilteredMarathons;
    return yearFilteredMarathons.filter(
      (marathon) => marathon.month === monthFilter,
    );
  }, [yearFilteredMarathons, monthFilter]);

  /** 지역 버튼 목록용 기준 데이터 */
  const areaOptionMarathons = useMemo(() => {
    if (countryFilter === "international") {
      return monthFilteredMarathons.filter(
        (marathon) => !marathon.country.includes("한국"),
      );
    }

    return monthFilteredMarathons.filter((marathon) =>
      marathon.country.includes("한국"),
    );
  }, [monthFilteredMarathons, countryFilter]);

  /** 지역 버튼 목록 */
  const availableAreas = useMemo(
    () => [
      ...new Set(
        areaOptionMarathons
          .map((marathon) => marathon.region)
          .filter((region): region is string => Boolean(region)),
      ),
    ],
    [areaOptionMarathons],
  );

  /** 4차 필터: 지역 */
  const areaFilteredMarathons = useMemo(() => {
    if (areaFilter === null) return monthFilteredMarathons;
    return monthFilteredMarathons.filter(
      (marathon) => marathon.region === areaFilter,
    );
  }, [monthFilteredMarathons, areaFilter]);

  /** 5차 필터: 코스(거리) */
  const distanceFilteredMarathons = useMemo(() => {
    if (distanceFilter === "all") return areaFilteredMarathons;

    return areaFilteredMarathons.filter((marathon) => {
      if (!marathon.registration_price) return false;
      const courseText = JSON.stringify(
        marathon.registration_price,
      ).toUpperCase();
      return courseText.includes(distanceFilter);
    });
  }, [areaFilteredMarathons, distanceFilter]);

  /** 6차 필터: event type */
  const eventFilteredMarathons = useMemo(() => {
    if (eventFilter === "all") return distanceFilteredMarathons;
    return distanceFilteredMarathons.filter(
      (marathon) => marathon.event_type === eventFilter,
    );
  }, [distanceFilteredMarathons, eventFilter]);

  /** 7차 필터: 접수 상태 */
  const statusFilteredMarathons = useMemo(() => {
    if (statusFilter === "all") return eventFilteredMarathons;
    return eventFilteredMarathons.filter(
      (marathon) => marathon.registration_status === statusFilter,
    );
  }, [eventFilteredMarathons, statusFilter]);

  /** 8차 필터: 지난 대회 포함 여부 */
  const pastFilteredMarathons = useMemo(() => {
    if (pastFilter === "include") return statusFilteredMarathons;

    const now = new Date();
    return statusFilteredMarathons.filter((marathon) => {
      const referenceDate = new Date(
        marathon.event_end_at ?? marathon.event_start_at,
      );
      return referenceDate >= now;
    });
  }, [statusFilteredMarathons, pastFilter]);

  /** 9차 필터: 검색어(마라톤명) */
  const keywordFilteredMarathons = useMemo(() => {
    const normalizedKeyword = keywordFilter.trim().toLowerCase();
    if (!normalizedKeyword) return pastFilteredMarathons;

    return pastFilteredMarathons.filter((marathon) =>
      marathon.name.toLowerCase().includes(normalizedKeyword),
    );
  }, [pastFilteredMarathons, keywordFilter]);

  /** 최종 목록 */
  const finalMarathons = keywordFilteredMarathons;

  return (
    <>
      {/* title */}
      <MarathonTitle />

      {/* filter */}
      <MarathonFilter
        isFilterOpen={isFilterOpen}
        onToggleFilter={() => setIsFilterOpen((prev) => !prev)}
        countryFilter={countryFilter}
        setCountryFilter={setCountryFilter}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        monthFilter={monthFilter}
        setMonthFilter={setMonthFilter}
        areaFilter={areaFilter}
        setAreaFilter={setAreaFilter}
        distanceFilter={distanceFilter}
        setDistanceFilter={setDistanceFilter}
        eventFilter={eventFilter}
        setEventFilter={setEventFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        pastFilter={pastFilter}
        setPastFilter={setPastFilter}
        availableYears={availableYears}
        availableMonths={availableMonths}
        availableAreas={availableAreas}
        availableEventTypes={availableEventTypes}
      />

      {/* notice */}
      <MarathonNotice
        totalCount={finalMarathons.length}
        countryFilter={countryFilter}
        yearFilter={yearFilter}
        monthFilter={monthFilter}
        areaFilter={areaFilter}
        distanceFilter={distanceFilter}
        eventFilter={eventFilter}
        statusFilter={statusFilter}
        pastFilter={pastFilter}
        keywordFilter={keywordFilter}
      />

      {/* search bar */}
      <MarathonSearchBar
        form={form}
        onSubmitSearch={onSubmitSearch}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* list */}
      {finalMarathons.length === 0 ? (
        <MarathonNoData />
      ) : viewMode === "card" ? (
        <MarathonListCard marathons={finalMarathons} />
      ) : viewMode === "date" ? (
        <MarathonListDate marathons={finalMarathons} />
      ) : viewMode === "image" ? (
        <MarathonListImage marathons={finalMarathons} />
      ) : viewMode === "medal" ? (
        <MarathonListMedal marathons={finalMarathons} />
      ) : (
        <MarathonNoData />
      )}
    </>
  );
}
