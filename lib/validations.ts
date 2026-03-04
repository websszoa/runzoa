import z from "zod";

// 프로필 이름 변경 폼 스키마
export const profileNameSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, "이름은 3자 이상 입력해주세요")
    .max(18, "이름은 18자 이내로 입력해주세요"),
});
