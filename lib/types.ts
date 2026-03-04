import z from "zod";
import { contactSchema, profileNameSchema } from "./validations";

// 프로필 이름 변경 폼 타입
export type ProfileNameFormValues = z.infer<typeof profileNameSchema>;

// 문의하기 폼 타입 (contact)
export type ContactFormValues = z.infer<typeof contactSchema>;

// 프로필 타입
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  signup_provider: string;
  role: string;
  visit_count: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
