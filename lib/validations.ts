import z from "zod";

// 프로필 이름 변경 폼 스키마
export const profileNameSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, "이름은 3자 이상 입력해주세요")
    .max(18, "이름은 18자 이내로 입력해주세요"),
});

// 문의하기 폼 스키마
export const contactSchema = z.object({
  user_email: z.email("올바른 이메일 형식을 입력해주세요"),
  message: z
    .string()
    .min(10, "문의 내용을 10자 이상 입력해주세요")
    .max(1000, "문의 내용은 1000자 이내로 입력해주세요"),
});

// 관리자 로그인 폼 스키마
export const adminLoginSchema = z.object({
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});
