"use client";

import { Star } from "lucide-react";
import PageNoData from "./page-no-data";

export default function PageFavorites() {
  return (
    <PageNoData
      icon={Star}
      title="즐겨찾기가 없습니다."
      description="관심 있는 정보를 즐겨찾기에 추가해보세요."
      buttonText="즐겨찾기 추가하기"
      buttonHref="/"
    />
  );
}
