"use client";

import type { User } from "@supabase/supabase-js";
import { APP_NAME } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/contexts/login-context";
import { useSheet } from "@/contexts/sheet-context";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface HeaderSheetProps {
  user: User | null;
}

export default function HeaderSheet({ user }: HeaderSheetProps) {
  const router = useRouter();
  const { openLogin } = useLogin();
  const { setIsOpen } = useSheet();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsOpen(false);
    toast.success("로그아웃 되었습니다.");
    router.push("/");
    router.refresh();
  };

  return (
    <SheetHeader className="border-b border-brand/10">
      <SheetTitle className="font-paperlogy font-normal text-xl uppercase text-brand flex items-center gap-2">
        {APP_NAME}

        {user ? (
          <Button
            size="sm"
            type="button"
            className="text-[12px] rounded-full px-2.5 font-paperlogy bg-brand hover:bg-brand/90 text-white font-normal h-6"
            onClick={handleSignOut}
          >
            로그아웃
          </Button>
        ) : (
          <Button
            size="sm"
            type="button"
            className="text-[12px] rounded-full px-2.5 font-paperlogy bg-brand hover:bg-brand/90 text-white font-normal h-6"
            onClick={openLogin}
          >
            로그인
          </Button>
        )}
      </SheetTitle>
      <SheetDescription className="sr-only">
        메뉴 및 사용자 정보를 확인할 수 있습니다.
      </SheetDescription>
    </SheetHeader>
  );
}
