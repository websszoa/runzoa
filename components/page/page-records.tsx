"use client";

import { ClipboardList } from "lucide-react";
import PageNoData from "./page-no-data";

export default function PageRecords() {
  return (
    <PageNoData
      icon={ClipboardList}
      title="기록이 없습니다."
      description="참가한 마라톤 대회 기록을 추가해보세요."
      buttonText="기록 추가하기"
      buttonHref="/"
    />
  );
}
