import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Marathon } from "@/lib/types";
import {
  APP_NAME,
  APP_SLOGAN,
  APP_DESCRIPTION,
  APP_SITE_URL,
  MARATHON_IMAGE_BASE_URL,
} from "@/lib/constants";

import DetailHeader from "@/components/detail/detail-header";
import DetailViewCount from "@/components/detail/detail-view-count";
import DetailInfo from "@/components/detail/detail-info";
import DetailPrice from "@/components/detail/detail-price";
import DetailHosts from "@/components/detail/detail-hosts";
import DetailContact from "@/components/detail/detail-contact";
import DetailOrganizer from "@/components/detail/detail-organizer";
import DetailRegister from "@/components/detail/detail-register";
import DetailComments from "@/components/detail/detail-comments";
import DetailOngoing from "@/components/detail/detail-ongoing";
import DetailNotice from "@/components/detail/detail-notice";
import DetailLocation from "@/components/detail/detail-location";
import DetailImage from "@/components/detail/detail-image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 메타데이터 설정
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  // 데이터 가져오기
  const { data } = await supabase
    .from("marathons")
    .select("name, description, images")
    .eq("slug", slug)
    .maybeSingle<Pick<Marathon, "name" | "description" | "images">>();

  // 데이터 없음 → 기본 SEO
  if (!data) {
    return {
      title: `${APP_NAME} | ${APP_SLOGAN}`,
      description: APP_DESCRIPTION,
    };
  }

  // 대표 이미지
  const ogImage = data.images?.cover?.[0]
    ? `${MARATHON_IMAGE_BASE_URL}/cover/${data.images.cover[0]}`
    : `${APP_SITE_URL}/runzoa.webp`;

  return {
    title: `${data.name} | ${APP_NAME}`,
    description: data.description ?? APP_DESCRIPTION,

    openGraph: {
      title: `${data.name} | ${APP_NAME}`,
      description: data.description ?? APP_DESCRIPTION,
      images: [ogImage],
      type: "article",
      url: `${APP_SITE_URL}/marathon/${slug}`,
    },
  };
}

export default async function MarathonDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 상세 데이터 가져오기
  const { data: marathon } = await supabase
    .from("marathons")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<Marathon>();

  if (!marathon) return notFound();

  return (
    <div className="detail__container">
      {/* 조회수 증가 */}
      <DetailViewCount marathonId={marathon.id} />

      {/* 헤더 */}
      <DetailHeader marathon={marathon} />

      <div className="detail__contents">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {/* 대회정보 */}
            <DetailInfo marathon={marathon} />

            {/* 참가비 */}
            <DetailPrice marathon={marathon} />

            {/* 기념품 */}
            <DetailHosts marathon={marathon} />

            {/* 문의하기 */}
            <DetailContact marathon={marathon} />

            {/* 지도 보기 */}
            <DetailLocation marathon={marathon} />

            {/* 마라톤 이미지 리스트 */}
            <DetailImage marathonId={marathon.id} />
          </div>
          <div>
            {/* 주최 */}
            <DetailOrganizer marathon={marathon} />

            {/* 신청하기 */}
            <DetailRegister marathon={marathon} />

            {/* 댓글 */}
            <DetailComments marathonId={marathon.id} />

            {/* 마라톤 접수중 리스트 */}
            <DetailOngoing marathonId={marathon.id} />
          </div>
        </div>

        {/* 마라톤 주의사항 */}
        <DetailNotice marathon={marathon} />
      </div>
    </div>
  );
}
