import z from "zod";
import type { ComponentType } from "react";
import {
  adminLoginSchema,
  contactSchema,
  profileNameSchema,
  marathonAddSchema,
  marathonEditSchema,
} from "./validations";

// 문의하기 폼 타입 (contact)
export type ContactFormValues = z.infer<typeof contactSchema>;

// 프로필 이름 변경 폼 타입
export type ProfileNameFormValues = z.infer<typeof profileNameSchema>;

// 관리자 로그인 폼 타입
export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

// 마라톤 추가 폼 타입
export type MarathonAddFormValues = z.infer<typeof marathonAddSchema>;

// 마라톤 수정 폼 타입
export type MarathonEditFormValues = z.infer<typeof marathonEditSchema>;

// 프로필 타입
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: string;
  visit_count: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// 문의 타입
export interface Contact {
  id: string;
  user_id: string;
  user_email?: string | null;
  message: string;
  status: "pending" | "progress" | "resolved" | "closed";
  admin_reply: string | null;
  admin_id: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

// 페이지 데이터 없음 타입
export type PageNoDataProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
};

// 매안 검색 폼 타임
export type SearchFormValues = {
  keyword: string;
};

// 마라톤 대회 목록 (admin-marathon, DB marathons 테이블)
export type RegistrationStatus =
  | "접수대기"
  | "접수중"
  | "접수마감"
  | "추가접수";

export type MarathonImages = {
  cover?: string[];
  medal?: string[];
  souvenir?: string[];
  detail?: string[];
};

export type MarathonLocation = {
  country?: string | null;
  region?: string | null;
  place?: string | null;
  lat?: number | null;
  lng?: number | null;
};

export type MarathonHosts = {
  organizer?: string | null;
  manage?: string | null;
  sponsor?: string | null;
  souvenir?: string | null;
  phone?: string | null;
  email?: string | null;
};

export type MarathonSNS = {
  kakao?: string | null;
  instagram?: string | null;
  blog?: string | null;
  youtube?: string | null;
};

export type MarathonRegistrationPrice = {
  distance: string;
  price: number | null;
}[];

export interface Marathon {
  id: string;

  year: number;
  month: number;
  country: string;
  region: string;

  name: string;
  slug: string;
  description: string;

  event_start_at: string;
  event_end_at: string | null;
  event_scale: number | null;
  event_type: string;
  event_site: string | null;

  registration_status: RegistrationStatus;
  registration_start_at: string | null;
  registration_end_at: string | null;
  registration_add_start_at: string | null;
  registration_add_end_at: string | null;
  registration_price: MarathonRegistrationPrice | null;
  registration_site: string | null;

  images: MarathonImages | null;
  location: MarathonLocation | null;
  hosts: MarathonHosts | null;
  sns: MarathonSNS | null;

  comment_count: number;
  view_count: number;
  heart_count: number;
  favorite_count: number;
  share_count: number;
  alert_count: number;
  created_at: string;
  updated_at: string;
}
