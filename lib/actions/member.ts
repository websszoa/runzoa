"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type UpdateMemberPayload = {
  id: string;
  full_name?: string;
  role: string;
  visit_count: number;
  is_deleted: boolean;
  created_at: string;
};

export async function updateMemberByAdmin(payload: UpdateMemberPayload) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("로그인이 필요합니다.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    throw new Error("관리자 권한이 필요합니다.");
  }

  const updateData: {
    role: string;
    visit_count: number;
    is_deleted: boolean;
    created_at: string;
    full_name?: string;
  } = {
    role: payload.role,
    visit_count: payload.visit_count,
    is_deleted: payload.is_deleted,
    created_at: payload.created_at,
  };
  if (payload.full_name !== undefined) {
    updateData.full_name = payload.full_name;
  }

  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update(updateData)
    .eq("id", payload.id);

  if (updateError) {
    throw new Error("회원 정보 업데이트에 실패했습니다.");
  }

  revalidatePath("/admin/member");

  const result: {
    full_name?: string;
    role: string;
    visit_count: number;
    is_deleted: boolean;
    created_at: string;
  } = {
    full_name: payload.full_name,
    role: payload.role,
    visit_count: payload.visit_count,
    is_deleted: payload.is_deleted,
    created_at: payload.created_at,
  };
  return result;
}
