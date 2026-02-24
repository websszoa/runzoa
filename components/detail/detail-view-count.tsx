"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const VIEW_STORAGE_PREFIX = "marathon_view_";

interface Props {
  marathonId: string;
}

export default function DetailViewCount({ marathonId }: Props) {
  useEffect(() => {
    if (!marathonId) return;

    const storageKey = `${VIEW_STORAGE_PREFIX}${marathonId}`;
    try {
      if (
        typeof sessionStorage !== "undefined" &&
        sessionStorage.getItem(storageKey)
      ) {
        return;
      }
    } catch {
      // sessionStorage 사용 불가 시 그냥 증가 시도
    }

    const supabase = createClient();

    const incrementView = async () => {
      const { error: rpcError } = await supabase.rpc(
        "increment_marathon_view_count",
        {
          p_marathon_id: marathonId,
        },
      );

      if (!rpcError) {
        try {
          sessionStorage?.setItem(storageKey, "1");
        } catch {
          // ignore
        }
        return;
      }

      // RPC 실패 시: marathons 테이블은 anon/authenticated에 UPDATE 권한이 없어
      // 반드시 sql/supabase_function.sql 의 increment_marathon_view_count 함수를
      // Supabase SQL Editor에서 실행해 두어야 조회수가 증가합니다.
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[DetailViewCount] RPC 실패, 조회수 미증가. supabase_function.sql 의 increment_marathon_view_count 실행 여부 확인:",
          rpcError,
        );
      }
    };

    incrementView();
  }, [marathonId]);

  return null;
}
