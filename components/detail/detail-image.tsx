import { ChessKing } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Marathon } from "@/lib/types";

import DetailImageCarousel from "./detail-image-carousel";

type DetailImageProps = {
  marathonId: string;
};

export default async function DetailImage({ marathonId }: DetailImageProps) {
  const supabase = await createClient();

  // 마라톤 조회 (현재 마라톤 제외, 최대 8개)
  const { data: marathons, error } = await supabase
    .from("marathons")
    .select("*")
    .neq("id", marathonId)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error || !marathons || marathons.length === 0) {
    return null;
  }

  return (
    <div className="detail__block">
      <DetailImageCarousel
        marathons={marathons as Marathon[]}
        title={
          <h3>
            <ChessKing className="w-5 h-5 text-brand" /> 다른 마라톤 보기
          </h3>
        }
      />
    </div>
  );
}
