import Image from "next/image";
import NaverMap from "@/components/detail/detail-naver-map";
import { MapPin } from "lucide-react";
import type { Marathon, MarathonLocation } from "@/lib/types";

type DetailLocationProps = {
  marathon: Marathon;
};

/** 검색어: 한국, 서울, place만 사용 (지역·국가 필드는 사용하지 않음) */
function locationToSearchText(loc: MarathonLocation | null): string {
  if (!loc) return "";
  const parts = ["한국", "서울", loc.place].filter(Boolean) as string[];
  return parts.join(" ");
}

/** NaverMap이 기대하는 형식: latitude, longitude, text */
function locationToNaverMapFormat(loc: MarathonLocation | null) {
  if (!loc) return "";
  const text = locationToSearchText(loc);
  const lat = loc.lat != null ? Number(loc.lat) : undefined;
  const lng = loc.lng != null ? Number(loc.lng) : undefined;
  if (lat != null && lng != null) {
    return { latitude: lat, longitude: lng, text: text || "마라톤 대회 장소" };
  }
  return text || "마라톤 대회 장소";
}

export default function DetailLocation({ marathon }: DetailLocationProps) {
  if (!marathon.location) {
    return null;
  }

  const loc = marathon.location;
  const searchText = locationToSearchText(loc);
  const naverMapLocation = locationToNaverMapFormat(loc);
  const hasLatLng = loc.lat != null && loc.lng != null;
  const lat = loc.lat != null ? Number(loc.lat) : 0;
  const lng = loc.lng != null ? Number(loc.lng) : 0;

  return (
    <div className="detail__block">
      <h3>
        <MapPin className="w-5 h-5 text-brand" /> 지도 보기
      </h3>
      <div>
        <NaverMap key={marathon.slug} location={naverMapLocation} />

        <div className="mt-4 p-4 bg-gray-50 rounded-lg flex flex-wrap gap-4 md:gap-6">
          {/* 웹 지도로 보기: 네이버, 카카오맵 */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-600 mb-2">
              웹 지도로 보기
            </p>
            <div className="flex gap-2">
              <a
                href={`https://map.naver.com/p/search/${encodeURIComponent(searchText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/map/navermap.webp"
                  alt="네이버 지도"
                  width={36}
                  height={36}
                  className="inline-block border rounded-[10px]"
                />
              </a>
              <a
                href={`https://map.kakao.com/link/search/${encodeURIComponent(searchText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/map/kakaomap.webp"
                  alt="카카오 지도"
                  width={36}
                  height={36}
                  className="inline-block border border-[#ECD729] rounded-[10px]"
                />
              </a>
            </div>
          </div>

          {/* 길찾기: 티맵, 구글지도 */}
          {hasLatLng && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 mb-2">길찾기</p>
              <div className="flex gap-2">
                <a
                  href={`tmap://route?goalname=${encodeURIComponent(searchText)}&goalx=${lng}&goaly=${lat}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-only flex items-center gap-1 text-xs text-blue-600 hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/map/tmap.webp"
                    alt="티맵 길찾기"
                    width={36}
                    height={36}
                    className="inline-block border rounded-[10px]"
                  />
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/map/googlemaps.webp"
                    alt="구글 맵 길찾기"
                    width={36}
                    height={36}
                    className="inline-block border rounded-[10px]"
                  />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
