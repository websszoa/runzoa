"use client";

import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="main__container flex flex-col justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center py-12 md:py-20">
        {/* 에러 아이콘 */}
        <div className="text-center mb-6">
          <h1 className="font-poppins uppercase text-6xl md:text-8xl font-black text-red-500/20 select-none">
            ERROR
          </h1>
        </div>

        {/* 타이틀 섹션 */}
        <div className="text-center mb-8 max-w-md px-4">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-red-500/80 block mb-2">
            Something Went Wrong
          </span>
          <h2 className="font-nanumNeo text-2xl md:text-3xl text-slate-900 mb-3">
            오류가 발생했습니다
          </h2>
          <p className="font-anyvid text-sm text-muted-foreground leading-relaxed">
            예상치 못한 오류가 발생했습니다.
            <br className="hidden sm:block" />
            잠시 후 다시 시도해 주세요.
          </p>
          {error.message && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="font-nanumNeo text-xs text-red-700 wrap-break-word">
                {error.message}
              </p>
            </div>
          )}
        </div>

        {/* 버튼 그룹 */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0">
          <Button
            onClick={reset}
            variant="default"
            size="lg"
            className="w-full sm:w-auto"
          >
            <RefreshCw className="size-4" />
            다시 시도
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/">
              <Home className="size-4" />
              홈으로 돌아가기
            </Link>
          </Button>
        </div>

        {/* 추가 안내 */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="font-anyvid text-sm text-muted-foreground text-center">
            문제가 지속되면{" "}
            <Link
              href="/contact"
              className="text-brand hover:underline underline-offset-2"
            >
              문의하기
            </Link>
            를 통해 알려주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
