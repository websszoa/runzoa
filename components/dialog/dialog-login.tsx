"use client";

import { TentTree } from "lucide-react";
import { APP_ENG_NAME } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import GoogleLoginButton from "../auth/google-login-button";
import KakaoLoginButton from "../auth/kakao-login-button";

interface DialogLoginProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DialogLogin({ open, onOpenChange }: DialogLoginProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 font-paperlogy uppercase font-extrabold text-brand text-xl">
                <TentTree className="size-9" />
                {APP_ENG_NAME}
              </div>
            </div>
            <DialogTitle className="text-xl mt-2">
              Welcome to <span className="capitalize">{APP_ENG_NAME}</span>.com
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-center font-anyvid break-keep">
            로그인을 하시면{" "}
            <a
              href="/privacy"
              target="_blank"
              className="underline underline-offset-3 hover:text-brand transition-colors"
            >
              개인정보 처리방침
            </a>{" "}
            및{" "}
            <a
              href="/terms"
              target="_blank"
              className="underline underline-offset-3 hover:text-brand transition-colors"
            >
              이용약관
            </a>
            에 <br className="hidden md:block" /> 동의한 것으로 간주됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 pt-2">
          <GoogleLoginButton />
          <KakaoLoginButton />
        </div>
      </DialogContent>
    </Dialog>
  );
}
