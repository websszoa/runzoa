"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

/** 네이버 캘린더 콜백 후 URL의 naver_calendar 파라미터로 토스트 표시 */
export default function NaverCalendarToast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const result = searchParams.get("naver_calendar");
    if (!result) return;

    const reason = searchParams.get("reason");

    if (result === "success") {
      toast.success("네이버 캘린더에 일정이 추가되었습니다. 네이버 캘린더 앱/웹에서 확인해 보세요.");
    } else if (result === "error") {
      const messages: Record<string, string> = {
        no_code: "인증 정보가 없습니다.",
        env: "서버 설정(API 키)을 확인해 주세요.",
        token: "네이버 로그인 토큰 발급에 실패했습니다.",
        token_network: "네이버 서버 연결에 실패했습니다.",
        marathon: "마라톤 정보를 불러오지 못했습니다.",
        api: "네이버 캘린더 API 호출에 실패했습니다.",
        api_network: "네이버 캘린더 서버 연결에 실패했습니다.",
      };
      const msg = reason ? messages[reason] : null;
      toast.error(msg ?? "네이버 캘린더 추가에 실패했습니다. 다시 시도해 주세요.");
    }

    const next = new URLSearchParams(searchParams);
    next.delete("naver_calendar");
    next.delete("reason");
    const q = next.toString();
    router.replace(q ? `${pathname}?${q}` : pathname);
  }, [searchParams, pathname, router]);

  return null;
}
