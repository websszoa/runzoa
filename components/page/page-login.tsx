"use client";

import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/contexts/login-context";

export default function PageLogin() {
  const { openLogin } = useLogin();

  return (
    <div className="rounded-lg border border-dashed border-gray-200 py-16 px-6 text-center">
      <LogIn className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-gray-700 font-nanumNeo text-xl mb-1">
        로그인이 필요합니다.
      </h3>
      <p className="text-sm text-muted-foreground font-anyvid mb-4">
        로그인하면 개인화된 기능과 저장한 정보를 확인할 수 있어요.
      </p>
      <Button variant="destructive" className="font-anyvid" onClick={openLogin}>
        로그인하기
      </Button>
    </div>
  );
}
