"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Marathon, MarathonAddFormValues } from "@/lib/types";

function toTimestamp(dateStr: string, timeStr?: string): string | null {
  if (!dateStr?.trim()) return null;
  const time = timeStr?.trim() || "00:00";
  const iso = new Date(`${dateStr}T${time}:00`).toISOString();
  return iso;
}

export async function marathonAddAction(
  values: MarathonAddFormValues
): Promise<{ success: boolean; message?: string; marathon?: Marathon }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: "로그인이 필요합니다." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return { success: false, message: "관리자 권한이 필요합니다." };
  }

  const eventStartAt = toTimestamp(
    values.event_start_date,
    values.event_start_time
  );
  if (!eventStartAt) {
    return { success: false, message: "대회 시작 일시가 올바르지 않습니다." };
  }

  const startDate = new Date(eventStartAt);
  const year = startDate.getUTCFullYear();
  const month = startDate.getUTCMonth() + 1;

  const eventEndAt = toTimestamp(
    values.event_end_date ?? "",
    values.event_end_time
  );

  const registrationStartAt = toTimestamp(
    values.registration_start_date ?? "",
    values.registration_start_time
  );
  const registrationEndAt = toTimestamp(
    values.registration_end_date ?? "",
    values.registration_end_time
  );
  const registrationAddStartAt = toTimestamp(
    values.registration_add_start_date ?? "",
    values.registration_add_start_time
  );
  const registrationAddEndAt = toTimestamp(
    values.registration_add_end_date ?? "",
    values.registration_add_end_time
  );

  const registrationPrice = (values.registration_prices ?? [])
    .filter((p) => (p.distance ?? "").trim() !== "")
    .map((p) => ({
      distance: String(p.distance).trim(),
      price:
        p.price === "" || p.price === undefined || p.price === null
          ? null
          : Number(p.price),
    }));

  const images = {
    cover: (values.images_cover ?? []).map((i) => (i.src ?? "").trim()).filter(Boolean),
    medal: (values.images_medal ?? []).map((i) => (i.src ?? "").trim()).filter(Boolean),
    souvenir: (values.images_souvenir ?? []).map((i) => (i.src ?? "").trim()).filter(Boolean),
    detail: (values.images_detail ?? []).map((i) => (i.src ?? "").trim()).filter(Boolean),
  };

  const location = {
    country: values.location_country?.trim() || null,
    region: values.location_region?.trim() || null,
    place: values.location_place?.trim() || null,
    lat: values.location_lat?.trim() ? Number(values.location_lat) : null,
    lng: values.location_lng?.trim() ? Number(values.location_lng) : null,
  };

  const hosts = {
    organizer: values.host_organizer?.trim() || null,
    manage: values.host_manage?.trim() || null,
    sponsor: values.host_sponsor?.trim() || null,
    souvenir: values.host_souvenir?.trim() || null,
    phone: values.host_phone?.trim() || null,
    email: values.host_email?.trim() || null,
  };

  const sns = {
    kakao: values.sns_kakao?.trim() || null,
    instagram: values.sns_instagram?.trim() || null,
    blog: values.sns_blog?.trim() || null,
    youtube: values.sns_youtube?.trim() || null,
  };

  const eventScale = values.event_scale !== "" && values.event_scale != null
    ? Number(values.event_scale)
    : null;

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("marathons")
    .insert({
      year,
      month,
      country: values.location_country.trim(),
      region: values.location_region.trim(),
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: values.description.trim(),
      event_start_at: eventStartAt,
      event_end_at: eventEndAt,
      event_scale: eventScale,
      event_type: values.event_type.trim(),
      event_site: values.event_site?.trim() || null,
      registration_status: values.registration_status,
      registration_start_at: registrationStartAt,
      registration_end_at: registrationEndAt,
      registration_add_start_at: registrationAddStartAt,
      registration_add_end_at: registrationAddEndAt,
      registration_price: registrationPrice.length > 0 ? registrationPrice : null,
      registration_site: values.registration_site?.trim() || null,
      images: Object.keys(images).some((k) => (images as Record<string, string[]>)[k].length > 0)
        ? images
        : null,
      location,
      hosts,
      sns,
    })
    .select()
    .single();

  if (insertError) {
    console.error(insertError);
    return {
      success: false,
      message: insertError.message ?? "마라톤 등록에 실패했습니다.",
    };
  }

  revalidatePath("/admin/marathon");

  const row = inserted as Record<string, unknown>;
  const marathon: Marathon = {
    id: row.id as string,
    year: row.year as number,
    month: row.month as number,
    country: row.country as string,
    region: row.region as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string,
    event_start_at: row.event_start_at as string,
    event_end_at: row.event_end_at as string | null,
    event_scale: row.event_scale as number | null,
    event_type: row.event_type as string,
    event_site: row.event_site as string | null,
    registration_status: row.registration_status as Marathon["registration_status"],
    registration_start_at: row.registration_start_at as string | null,
    registration_end_at: row.registration_end_at as string | null,
    registration_add_start_at: row.registration_add_start_at as string | null,
    registration_add_end_at: row.registration_add_end_at as string | null,
    registration_price: row.registration_price as Marathon["registration_price"],
    registration_site: row.registration_site as string | null,
    images: row.images as Marathon["images"],
    location: row.location as Marathon["location"],
    hosts: row.hosts as Marathon["hosts"],
    sns: row.sns as Marathon["sns"],
    comment_count: (row.comment_count as number) ?? 0,
    view_count: (row.view_count as number) ?? 0,
    heart_count: (row.heart_count as number) ?? 0,
    favorite_count: (row.favorite_count as number) ?? 0,
    share_count: (row.share_count as number) ?? 0,
    alert_count: (row.alert_count as number) ?? 0,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };

  return { success: true, marathon };
}
