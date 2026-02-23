import z from "zod";

// 문의하기 폼 스키마
export const contactSchema = z.object({
  user_email: z.email("올바른 이메일 형식을 입력해주세요"),
  message: z
    .string()
    .min(10, "문의 내용을 10자 이상 입력해주세요")
    .max(1000, "문의 내용은 1000자 이내로 입력해주세요"),
});

// 프로필 이름 변경 폼 스키마
export const profileNameSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, "이름은 3자 이상 입력해주세요")
    .max(18, "이름은 18자 이내로 입력해주세요"),
});

// 관리자 로그인 폼 스키마
export const adminLoginSchema = z.object({
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

// 마라톤 추가 폼 스키마
const registrationStatusEnum = z.enum([
  "접수대기",
  "접수중",
  "추가접수",
  "접수마감",
]);
const priceItemSchema = z.object({
  distance: z.string(),
  price: z.union([z.string(), z.number()]).optional(),
});
const imageItemSchema = z.object({ src: z.string() });

export const marathonAddSchema = z.object({
  name: z.string().min(1, "대회명을 입력해주세요"),
  slug: z.string().min(1, "슬러그를 입력해주세요"),
  description: z.string().min(1, "설명을 입력해주세요"),
  event_start_date: z.string().min(1, "대회 시작 날짜를 입력해주세요"),
  event_start_time: z.string().optional(),
  event_end_date: z.string().optional(),
  event_end_time: z.string().optional(),
  event_type: z.string().min(1, "이벤트 타입을 입력해주세요"),
  event_scale: z.union([z.string(), z.number()]).optional(),
  event_site: z.string().optional(),
  registration_status: registrationStatusEnum,
  registration_start_date: z.string().optional(),
  registration_start_time: z.string().optional(),
  registration_end_date: z.string().optional(),
  registration_end_time: z.string().optional(),
  registration_add_start_date: z.string().optional(),
  registration_add_start_time: z.string().optional(),
  registration_add_end_date: z.string().optional(),
  registration_add_end_time: z.string().optional(),
  registration_site: z.string().optional(),
  registration_prices: z.array(priceItemSchema).min(1, "접수 가격을 1개 이상 입력해주세요"),
  location_country: z.string().min(1, "나라를 입력해주세요"),
  location_region: z.string().min(1, "지역을 입력해주세요"),
  location_place: z.string().optional(),
  location_lat: z.string().optional(),
  location_lng: z.string().optional(),
  images_cover: z.array(imageItemSchema).optional(),
  images_medal: z.array(imageItemSchema).optional(),
  images_souvenir: z.array(imageItemSchema).optional(),
  images_detail: z.array(imageItemSchema).optional(),
  host_organizer: z.string().optional(),
  host_manage: z.string().optional(),
  host_sponsor: z.string().optional(),
  host_souvenir: z.string().optional(),
  host_phone: z.string().optional(),
  host_email: z.string().optional(),
  sns_kakao: z.string().optional(),
  sns_instagram: z.string().optional(),
  sns_blog: z.string().optional(),
  sns_youtube: z.string().optional(),
});

// 마라톤 수정 폼 스키마 (추가 스키마 + id)
export const marathonEditSchema = marathonAddSchema.extend({
  id: z.string().min(1, "대회 ID가 필요합니다."),
});
