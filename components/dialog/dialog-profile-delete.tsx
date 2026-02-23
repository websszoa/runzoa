"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { APP_ENG_NAME } from "@/lib/constants";
import { Mail, TentTree, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DialogProfileDeleteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DialogProfileDelete({
  open,
  onOpenChange,
}: DialogProfileDeleteProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("로그인 정보를 찾을 수 없습니다.");
        return;
      }

      const { error: rpcError } = await supabase.rpc("soft_delete_account");

      if (rpcError) {
        throw rpcError;
      }

      // 로그아웃 처리
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }

      toast.success("탈퇴가 완료되었습니다.");
      onOpenChange(false);
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("탈퇴 처리 오류:", error);
      toast.error("탈퇴 처리 중 오류가 발생했습니다.");
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
              정말 탈퇴하시겠습니까?
            </DialogTitle>
          </div>

          <DialogDescription className="text-sm text-center font-anyvid break-keep">
            탈퇴 시 계정 정보가 삭제됩니다.
          </DialogDescription>
        </DialogHeader>

        {/* 안내 메시지 */}
        <div className="w-full space-y-4 text-left bg-gray-50 p-4 rounded-lg font-anyvid">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-brand mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">
                탈퇴 시 계정 접근이 즉시 제한됩니다.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                탈퇴가 완료되면 해당 계정으로 더 이상 로그인할 수 없으며, 동일한
                소셜 계정으로도 재가입이 제한될 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 안내 사항 */}
        <div className="w-full space-y-2 text-left font-anyvid">
          <p className="text-sm text-muted-foreground">
            💡 탈퇴 전 꼭 확인해주세요
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-7">
            <li>탈퇴 후 계정은 복구할 수 없습니다</li>
            <li>프로필, 활동 내역 등 모든 정보 이용이 중단됩니다</li>
            <li>탈퇴 즉시 로그아웃 처리됩니다</li>
          </ul>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 font-nanumNeo"
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isLoading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-nanumNeo"
          >
            <Trash2 className="w-4 h-4" />
            {isLoading ? "처리 중..." : "탈퇴하기"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
