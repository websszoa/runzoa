"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function KakaoLoginButton() {
  const [loading, setLoading] = useState(false);

  const loginWithKakao = async () => {};

  return (
    <Button
      onClick={loginWithKakao}
      disabled={loading}
      className="w-full h-11 flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#FEE500]/80 text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-anyvid text-black/70">로그인 중...</span>
        </>
      ) : (
        <>
          {/* Kakao icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 21 21"
            className="shrink-0"
          >
            <path
              fill="#3C1E1E"
              d="M10.5 3.217c4.514 0 8 2.708 8 6.004 0 3.758-4.045 6.184-8 5.892-1.321-.093-1.707-.17-2.101-.23-1.425.814-2.728 2.344-3.232 2.334-.325-.19.811-2.896.533-3.114-.347-.244-3.157-1.329-3.2-4.958 0-3.199 3.486-5.928 8-5.928Z"
            />
          </svg>

          <span className="font-anyvid text-black/70">카카오 로그인</span>
        </>
      )}
    </Button>
  );
}
