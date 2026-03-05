"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Contact } from "@/lib/types";

type UpdateContactPayload = {
  id: string;
  status: Contact["status"];
  adminReply: string;
};

export async function updateContactByAdmin(payload: UpdateContactPayload) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(); //현재 로그인한 사용자 가져오기

  if (authError || !user) {
    throw new Error("로그인이 필요합니다."); // 로그인 안된 경우 즉시 차단
  }

  const { data: profile, error: profileError } = await supabase // profiles 테이블에서 role 확인
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    throw new Error("관리자 권한이 필요합니다."); // role이 admin이 아니면 수정 불가능
  }

  // 입력된 답변 문자열 양 끝 공백 제거
  const adminReply = payload.adminReply.trim();

  // status가 resolved(해결됨) 또는 closed(종료됨)인 경우
  const resolvedAt =
    payload.status === "resolved" || payload.status === "closed"
      ? new Date().toISOString()
      : null;

  // 실제 DB 업데이트는 supabaseAdmin으로 실행
  const { error: updateError } = await supabaseAdmin
    .from("contacts")
    .update({
      status: payload.status,
      admin_reply: adminReply.length > 0 ? adminReply : null,
      admin_id: user.id,
      resolved_at: resolvedAt,
    })
    .eq("id", payload.id);

  // DB 업데이트 실패 시 에러 처리
  if (updateError) {
    throw new Error("문의 업데이트에 실패했습니다.");
  }

  // Next.js 캐시 무효화
  revalidatePath("/admin/contact");

  // 클라이언트에서 바로 UI 반영할 수 있도록 업데이트된 값을 반환
  return {
    status: payload.status,
    admin_reply: adminReply.length > 0 ? adminReply : null,
    admin_id: user.id,
    resolved_at: resolvedAt,
  };
}
