"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { useLogin } from "@/contexts/login-context";
import { ContactFormValues } from "@/lib/types";
import { contactSchema } from "@/lib/validations";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { faqs } from "@/lib/notice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronDown, Mails, AlertCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function PageContact() {
  const { openLogin } = useLogin();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const supabase = createClient();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      message: "",
      user_email: "",
    },
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const loggedIn = !!session?.user;
      const sessionEmail = session?.user?.email || "";
      setIsLoggedIn(loggedIn);
      setUserId(session?.user?.id || null);
      setUserEmail(sessionEmail);
      form.setValue("user_email", sessionEmail);
      if (!loggedIn) setShowForm(false);
    });
  }, [form, supabase.auth]);

  const onSubmit = async (data: ContactFormValues) => {
    if (!userId) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    try {
      const { error } = await supabase.from("contacts").insert({
        user_id: userId,
        user_email: data.user_email,
        message: data.message,
        status: "pending",
      });

      if (error) throw error;

      toast.success("문의가 성공적으로 접수되었습니다.");
      form.reset({ message: "", user_email: userEmail });
      setIsSubmitted(true);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      toast.error("문의 접수 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="rounded-lg border border-dashed border-gray-200 p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        {/* 왼쪽: FAQ - 모바일에서는 아래, 데스크톱에서는 왼쪽 */}
        <div className="order-2 lg:order-1 space-y-3 lg:space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="font-anyvid cursor-pointer rounded-lg border border-gray-200 px-4 py-4 sm:py-6 sm:px-6 hover:shadow-md transition-all duration-200 hover:border-brand/50"
            >
              <details className="group">
                <summary className="list-none [&::-webkit-details-marker]:hidden [&::marker]:hidden">
                  <div className="flex items-center gap-3">
                    <Badge className="hidden sm:inline-flex text-xs shrink-0">
                      {faq.category}
                    </Badge>
                    <h3 className="text-sm text-muted-foreground transition-colors flex-1">
                      {faq.title}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-all shrink-0 group-open:hidden" />
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-all shrink-0 hidden group-open:block" />
                  </div>
                </summary>

                <div className="pt-4 mt-4 sm:pt-6 sm:mt-6 border-t text-muted-foreground">
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {faq.content}
                  </p>
                </div>
              </details>
            </div>
          ))}
        </div>

        {/* 오른쪽 - 모바일에서는 위, 데스크톱에서는 오른쪽 */}
        <div className="order-1 lg:order-2 space-y-4 border border-gray-200 rounded-lg p-4 lg:p-6 flex items-center justify-center">
          {!showForm ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-3 overflow-hidden">
                  <Image
                    src="/face/face01.png"
                    alt="프로필"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-gray-700 font-nanumNeo text-xl mb-1">
                  {isSubmitted
                    ? "문의가 정상적으로 접수되었습니다."
                    : isLoggedIn
                      ? "문의를 작성해 주세요"
                      : "로그인이 필요합니다"}
                </h3>
                <p className="text-sm text-muted-foreground font-anyvid mb-4">
                  {isSubmitted
                    ? "빠른 시일 내에 답변드리겠습니다."
                    : isLoggedIn
                      ? "아래 버튼을 클릭하면 문의 작성란을 볼 수 있습니다."
                      : "문의 작성은 로그인 후에만 가능합니다."}
                </p>
              </div>
              {!isLoggedIn ? (
                <Button
                  variant="destructive"
                  className="font-anyvid"
                  onClick={openLogin}
                >
                  로그인하기
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  className="font-anyvid"
                  onClick={() => {
                    setShowForm(true);
                    if (isSubmitted) setIsSubmitted(false);
                  }}
                >
                  {isSubmitted ? "새 문의 작성" : "문의 작성하기"}
                </Button>
              )}
            </div>
          ) : (
            <>
              {!isLoggedIn && (
                <div className="flex items-center gap-2 rounded border border-brand/20 bg-brand/5 px-3 py-2.5">
                  <AlertCircle
                    className="h-4 w-4 shrink-0 text-brand"
                    aria-hidden
                  />
                  <p className="text-sm text-gray-700 font-anyvid">
                    로그인 후 작성할 수 있습니다.
                  </p>
                </div>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="user_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          이메일 <span className="star">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="이메일을 입력해주세요"
                            readOnly
                            disabled={!isLoggedIn}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          메시지 <span className="star">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="문의 내용을 입력해주세요"
                            rows={10}
                            className="h-55"
                            disabled={!isLoggedIn}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      className="font-anyvid flex-1"
                      onClick={() => setShowForm(false)}
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1 font-anyvid bg-brand text-white hover:bg-brand/90"
                      disabled={!isLoggedIn || form.formState.isSubmitting}
                    >
                      <Mails className="w-4 h-4" aria-hidden="true" />
                      {form.formState.isSubmitting ? "전송 중..." : "문의하기"}
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
