"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Marathon } from "@/lib/types";

import AdminMarathonHeader from "./admin-marathon-header";
import AdminMarathonStats from "./admin-marathon-stats";
import AdminMarathonTable from "./admin-marathon-table";
import AdminMarathonFilter from "./admin-marathon-filter";
import AdminMarathonSearch from "./admin-marathon-search";

type YearFilter = number | null;
type MonthFilter = number | null;
type RegionFilter = "domestic" | "international" | null;
type AreaFilter = string | null;
type DistanceFilter = "all" | "FULL" | "HALF" | "10KM" | "5KM";
type EventTypeFilter = string | null;
type StatusFilter = "all" | "접수대기" | "접수중" | "접수마감" | "추가접수";
type PastFilter = "exclude" | "include";
type KeywordFilter = string;

export default function AdminMarathon({
  marathons: marathons,
}: {
  marathons: Marathon[];
}) {
  const [marathonList, setMarathonList] = useState<Marathon[]>(marathons);
  const [yearFilter, setYearFilter] = useState<YearFilter>(null);
  const [monthFilter, setMonthFilter] = useState<MonthFilter>(null);
  const [regionFilter, setRegionFilter] = useState<RegionFilter>(null);
  const [areaFilter, setAreaFilter] = useState<AreaFilter>(null);
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>("all");
  const [eventTypeFilter, setEventTypeFilter] = useState<EventTypeFilter>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [pastFilter, setPastFilter] = useState<PastFilter>("include");
  const [keywordFilter, setKeywordFilter] = useState<KeywordFilter>("");

  useEffect(() => {
    setMarathonList(marathons);
  }, [marathons]);

  /** 필터 버튼용 년도 목록 */
  const availableYears = useMemo(
    () => [...new Set(marathonList.map((marathon) => marathon.year))],
    [marathonList],
  );

  /** 필터 버튼용 월 목록 (선택한 연도 기준) */
  const availableMonths = useMemo(() => {
    const sourceMarathons =
      yearFilter === null
        ? marathonList
        : marathonList.filter((marathon) => marathon.year === yearFilter);

    return [...new Set(sourceMarathons.map((marathon) => marathon.month))].sort(
      (a, b) => a - b,
    );
  }, [marathonList, yearFilter]);

  /** 연도/월 필터 적용 목록 */
  const periodMarathons = useMemo(() => {
    return marathonList.filter((marathon) => {
      const matchedYear = yearFilter === null || marathon.year === yearFilter;
      const matchedMonth =
        monthFilter === null || marathon.month === monthFilter;
      return matchedYear && matchedMonth;
    });
  }, [marathonList, yearFilter, monthFilter]);

  /** 1차 필터 목록: 국내/해외 + 년도 + 월 */
  const baseMarathons = useMemo(() => {
    if (regionFilter === null) return periodMarathons;
    if (regionFilter === "domestic") {
      return periodMarathons.filter((marathon) =>
        marathon.country.includes("한국"),
      );
    }

    return periodMarathons.filter(
      (marathon) => !marathon.country.includes("한국"),
    );
  }, [periodMarathons, regionFilter]);

  /** 지역 버튼 목록용 기준 데이터 (초기값은 국내 지역 기준) */
  const areaOptionMarathons = useMemo(() => {
    if (regionFilter === "international") {
      return periodMarathons.filter(
        (marathon) => !marathon.country.includes("한국"),
      );
    }

    return periodMarathons.filter((marathon) =>
      marathon.country.includes("한국"),
    );
  }, [periodMarathons, regionFilter]);

  /** 지역 버튼 목록 */
  const availableAreas = useMemo(() => {
    return [
      ...new Set(
        areaOptionMarathons
          .map((marathon) => marathon.region)
          .filter((region): region is string => Boolean(region)),
      ),
    ];
  }, [areaOptionMarathons]);

  /** 이벤트 타입 버튼 목록 */
  const availableEventTypes = useMemo(
    () => [
      ...new Set(
        marathonList
          .map((marathon) => marathon.event_type?.trim())
          .filter((eventType): eventType is string => Boolean(eventType)),
      ),
    ],
    [marathonList],
  );

  /** 2차 필터 목록: baseMarathons + 세부 지역(region) */
  const regionMarathons = useMemo(() => {
    if (areaFilter === null) return baseMarathons;

    return baseMarathons.filter((marathon) => marathon.region === areaFilter);
  }, [baseMarathons, areaFilter]);

  /** 3차 필터 목록: regionMarathons + 거리(distance) */
  const distanceMarathons = useMemo(() => {
    if (distanceFilter === "all") return regionMarathons;

    return regionMarathons.filter((marathon) => {
      if (!marathon.registration_price) return false;
      const priceDataStr = JSON.stringify(
        marathon.registration_price,
      ).toUpperCase();
      return priceDataStr.includes(distanceFilter.toUpperCase());
    });
  }, [regionMarathons, distanceFilter]);

  /** 최종 목록 */
  const finalMarathons = useMemo(() => {
    let list = distanceMarathons;

    if (eventTypeFilter !== null) {
      const keyword = eventTypeFilter.trim().toUpperCase();
      if (keyword) {
        list = list.filter((marathon) =>
          marathon.event_type.toUpperCase().includes(keyword),
        );
      }
    }

    if (statusFilter !== "all") {
      list = list.filter(
        (marathon) => marathon.registration_status === statusFilter,
      );
    }

    if (pastFilter === "exclude") {
      const now = new Date();
      list = list.filter((marathon) => {
        const referenceDate = new Date(
          marathon.event_end_at ?? marathon.event_start_at,
        );
        return referenceDate >= now;
      });
    }

    const keyword = keywordFilter.trim().toLowerCase();
    if (keyword) {
      list = list.filter((marathon) =>
        (marathon.name?.toLowerCase() ?? "").includes(keyword),
      );
    }

    return list;
  }, [
    distanceMarathons,
    eventTypeFilter,
    statusFilter,
    pastFilter,
    keywordFilter,
  ]);

  // 다이얼로그 수정 성공 시, 전체 새로고침 없이 해당 행만 로컬 목록에서 교체한다.
  const handleMarathonUpdated = useCallback((updatedMarathon: Marathon) => {
    setMarathonList((prev) =>
      prev.map((marathon) =>
        marathon.id === updatedMarathon.id ? updatedMarathon : marathon,
      ),
    );
  }, []);

  // 다이얼로그 추가 성공 시, 전체 새로고침 없이 로컬 목록에 맨 앞에 추가한다.
  const handleMarathonAdded = useCallback((addedMarathon: Marathon) => {
    setMarathonList((prev) => {
      const withoutDuplicate = prev.filter(
        (marathon) => marathon.id !== addedMarathon.id,
      );
      return [addedMarathon, ...withoutDuplicate];
    });
  }, []);

  // 다이얼로그 삭제 성공 시, 로컬 목록에서 해당 항목을 제거한다.
  const handleMarathonDeleted = useCallback((deletedMarathon: Marathon) => {
    setMarathonList((prev) =>
      prev.filter((marathon) => marathon.id !== deletedMarathon.id),
    );
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <AdminMarathonHeader onMarathonAdded={handleMarathonAdded} />

      {/* Stats */}
      <AdminMarathonStats marathons={marathonList} />

      {/* Filter */}
      <AdminMarathonFilter
        regionFilter={regionFilter}
        yearFilter={yearFilter}
        monthFilter={monthFilter}
        areaFilter={areaFilter}
        distanceFilter={distanceFilter}
        eventTypeFilter={eventTypeFilter}
        statusFilter={statusFilter}
        pastFilter={pastFilter}
        availableYears={availableYears}
        availableMonths={availableMonths}
        availableAreas={availableAreas}
        availableEventTypes={availableEventTypes}
        setRegionFilter={setRegionFilter}
        setYearFilter={setYearFilter}
        setMonthFilter={setMonthFilter}
        setAreaFilter={setAreaFilter}
        setDistanceFilter={setDistanceFilter}
        setEventTypeFilter={setEventTypeFilter}
        setStatusFilter={setStatusFilter}
        setPastFilter={setPastFilter}
      />

      {/* Search & Notice */}
      <AdminMarathonSearch
        keywordFilter={keywordFilter}
        setKeywordFilter={setKeywordFilter}
        totalCount={finalMarathons.length}
        regionFilter={regionFilter}
        yearFilter={yearFilter}
        monthFilter={monthFilter}
        areaFilter={areaFilter}
        distanceFilter={distanceFilter}
        statusFilter={statusFilter}
        eventTypeFilter={eventTypeFilter}
        pastFilter={pastFilter}
      />

      {/* Table */}
      <AdminMarathonTable
        marathons={finalMarathons}
        onMarathonUpdated={handleMarathonUpdated}
        onMarathonDeleted={handleMarathonDeleted}
      />
    </div>
  );
}
