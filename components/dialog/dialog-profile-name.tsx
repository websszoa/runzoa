"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { APP_ENG_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { SquarePen, TentTree } from "lucide-react";
import { ProfileNameFormValues } from "@/lib/types";
import { profileNameSchema } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface DialogProfileNameProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName?: string | null;
  onUpdated?: (newName: string) => void;
}

export default function DialogProfileName({
  open,
  onOpenChange,
  currentName,
  onUpdated,
}: DialogProfileNameProps) {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileNameFormValues>({
    resolver: zodResolver(profileNameSchema),
    defaultValues: {
      full_name: currentName || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      form.reset({ full_name: currentName || "" });
    }
  }, [open, currentName]);

  const onSubmit = async (data: ProfileNameFormValues) => {
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("로그인이 필요합니다.");
        return;
      }

      const newName = data.full_name.trim();
      const { data: isAvailable } = await supabase.rpc(
        "is_full_name_available",
        {
          name_text: newName,
        },
      );
      if (isAvailable === false) {
        toast.error("이미 사용 중인 이름입니다.");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ full_name: newName })
        .eq("id", user.id);

      if (error) throw error;

      onUpdated?.(newName);
      toast.success("이름이 변경되었습니다.");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("이름 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 font-paperlogy font-extrabold uppercase text-brand text-xl">
                <TentTree className="size-9" />
                {APP_ENG_NAME}
              </div>
            </div>

            <DialogTitle className="text-xl mt-2 font-nanumNeo">
              이름을 변경할 수 있습니다.
            </DialogTitle>
          </div>

          <DialogDescription className="text-sm text-center font-anyvid break-keep">
            변경할 이름을 입력해주세요. <br />
            이름은 3자 이상 18자 이내로 설정해 주세요.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4 pb-0"
          >
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="이름을 입력하세요"
                      maxLength={18}
                      className="font-nanumNeo"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage className="font-nanumNeo text-xs" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full bg-brand hover:bg-brand/90 font-nanumNeo"
              disabled={isLoading || !form.formState.isValid}
            >
              <SquarePen />
              {isLoading ? "변경 중..." : "변경하기"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
