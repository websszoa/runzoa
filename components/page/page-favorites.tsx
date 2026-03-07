"use client";

import { Star } from "lucide-react";
import type { Marathon } from "@/lib/types";
import PageNoData from "./page-no-data";
import MarathonListCard from "@/components/marathon/marathon-list-card";

type PageFavoritesProps = {
  marathons: Marathon[];
};

export default function PageFavorites({ marathons }: PageFavoritesProps) {
  if (marathons.length === 0) {
    return (
      <PageNoData
        icon={Star}
        title="즐겨찾기가 없습니다."
        description="관심 있는 대회를 즐겨찾기에 추가해보세요."
        buttonText="마라톤 보러 가기"
        buttonHref="/"
      />
    );
  }

  return <MarathonListCard marathons={marathons} />;
}
