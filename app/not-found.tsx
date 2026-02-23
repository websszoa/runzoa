import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "404 - 페이지를 찾을 수 없습니다 | {APP_NAME}",
  description: "요청하신 페이지를 찾을 수 없습니다.",
};

export default function NotFound() {
  return (
    <div className="main__container flex flex-col justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center py-12 md:py-20">
        {/* 404 숫자 */}
        <div className="text-center mb-6">
          <h1 className="font-paperlogy text-8xl md:text-9xl font-black text-brand/20 select-none">
            404
          </h1>
        </div>

        {/* 타이틀 섹션 */}
        <div className="text-center mb-8 max-w-md px-4">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-brand/80 block mb-2">
            Page Not Found
          </span>
          <h2 className="font-nanumNeo text-2xl md:text-3xl text-slate-900 mb-3">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="font-anyvid text-sm text-muted-foreground leading-relaxed">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            <br className="hidden sm:block" />
            URL을 다시 확인해 주세요.
          </p>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0">
          <Button
            asChild
            variant="default"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/">
              <Home className="size-4" />
              홈으로 돌아가기
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/notice">
              <Search className="size-4" />
              공지사항 보기
            </Link>
          </Button>
        </div>

        {/* 추가 안내 */}
        <div className="mt-8 pt-8 border-t border-gray-200">
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
