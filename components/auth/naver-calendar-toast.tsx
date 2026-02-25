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

    if (result === "success") {
      toast.success("네이버 캘린더에 일정이 추가되었습니다.");
    } else if (result === "error") {
      toast.error("네이버 캘린더 추가에 실패했습니다. 다시 시도해 주세요.");
    }

    const next = new URLSearchParams(searchParams);
    next.delete("naver_calendar");
    const q = next.toString();
    router.replace(q ? `${pathname}?${q}` : pathname);
  }, [searchParams, pathname, router]);

  return null;
}
