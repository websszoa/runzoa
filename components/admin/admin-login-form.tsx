"use client";

import Link from "next/link";
import { House, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminLoginFormValues } from "@/lib/types";
import { adminLoginSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface AdminLoginFormProps {
  onSuccess: () => void;
}

export function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = async (values: AdminLoginFormValues) => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!adminPassword) {
      toast.error("관리자 비밀번호가 설정되지 않았습니다.");
      return;
    }

    if (values.password !== adminPassword) {
      toast.error("비밀번호가 올바르지 않습니다.");
      return;
    }

    toast.success("관리자 인증 완료");
    onSuccess();
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 font-nanumNeo">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="text-xl font-bold text-brand">관리자 로그인</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            관리자 전용 페이지입니다. 비밀번호를 입력해주세요.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex justify-center mb-4">
                      <InputOTP
                        maxLength={4}
                        pattern="^[0-9]*$"
                        value={field.value ?? ""}
                        onChange={(value) => {
                          const onlyDigits = value
                            .replace(/\D/g, "")
                            .slice(0, 4);
                          field.onChange(onlyDigits);
                        }}
                        disabled={isSubmitting}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="h-12 w-12 text-lg font-semibold"
                          />
                          <InputOTPSlot
                            index={1}
                            className="h-12 w-12 text-lg font-semibold"
                          />
                          <InputOTPSlot
                            index={2}
                            className="h-12 w-12 text-lg font-semibold"
                          />
                          <InputOTPSlot
                            index={3}
                            className="h-12 w-12 text-lg font-semibold"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Link href="/" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <House />
                </Button>
              </Link>

              <Button
                type="submit"
                className="flex-9 gap-2 bg-brand text-white hover:bg-brand/90"
                disabled={isSubmitting}
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                {isSubmitting ? "확인 중..." : "접속하기"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
