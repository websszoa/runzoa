"use client";

import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { Hamburger } from "lucide-react";

export default function PageAbout() {
  return (
    <div className="space-y-4">
      {/* 상단 소개 */}
      <div className="rounded-2xl font-anyvid border border-dashed border-gray-200 p-4 md:p-8">
        <section className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-8">
          <div className="relative w-full overflow-hidden rounded-xl border border-gray-100 bg-white">
            <Image
              src="/runzoa.webp"
              alt={`${APP_NAME} 소개 이미지`}
              width={1200}
              height={800}
              className="h-auto w-full object-cover"
              priority
            />
          </div>

          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground break-keep">
            <h3 className="font-paperlogy text-2xl text-slate-900">
              안녕하세요! {APP_NAME}입니다.
            </h3>

            <p>
              <strong>{APP_NAME}</strong>는 국내외 마라톤 대회 정보를 한 곳에
              모아 제공하는 서비스입니다. 대회 일정, 지역, 종목, 접수 상태 등
              필요한 정보를 보기 쉽게 정리하고, 사용자가 원하는 조건으로 빠르게
              탐색할 수 있도록 돕습니다.
            </p>

            <p>
              흩어져 있는 대회 정보를 일일이 찾는 시간을 줄이고, 관심 있는
              대회를 저장해두고 언제든 다시 확인할 수 있도록 구성했습니다.{" "}
              {APP_NAME}는 러너가 더 편하게 대회를 선택하고 준비할 수 있도록
              지속적으로 개선해 나가겠습니다. 이용 중 궁금한 사항이나 개선
              아이디어가 있다면 언제든 문의사항으로 남겨주세요.
            </p>

            <div className="pt-1">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 group text-sm font-anyvid text-muted-foreground"
              >
                <Hamburger className="w-4 h-4 group-hover:text-red-500" />
                문의사항/제보하기
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
