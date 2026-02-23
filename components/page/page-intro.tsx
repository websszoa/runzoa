"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { APP_NAME } from "@/lib/constants";
import { INTRO_TABS, type IntroTabKey } from "@/lib/planning";
import { Hamburger } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, renderHighlightText } from "@/lib/utils";

export default function PageIntro() {
  const [activeTab, setActiveTab] = useState<IntroTabKey>("plan");

  const activeContent = useMemo(() => {
    return INTRO_TABS.find((t) => t.key === activeTab) ?? INTRO_TABS[0];
  }, [activeTab]);

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

      {/* 탭 버튼 */}
      <section className="rounded-2xl border border-dashed border-gray-200 bg-white p-4 md:p-6 font-anyvid">
        <div className="mb-4 flex flex-wrap gap-2">
          {INTRO_TABS.map((tab) => (
            <Button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              variant="outline"
              className={cn(
                "h-auto rounded-full px-4 py-1 text-sm transition-colors",
                activeTab === tab.key
                  ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-900 hover:text-white"
                  : "border-gray-200 text-slate-600 hover:border-slate-300 hover:text-slate-900",
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* 선택된 탭: 문서형 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
          <p className="text-xs font-medium tracking-wide uppercase text-slate-500">
            {activeContent.label}
          </p>

          <h4 className="mt-2 font-paperlogy text-xl text-slate-900">
            {renderHighlightText(activeContent.title)}
          </h4>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground break-keep">
            {renderHighlightText(activeContent.summary)}
          </p>

          <div className="mt-5 space-y-4">
            {activeContent.sections.map((section) => (
              <div
                key={section.title}
                className="rounded-xl border border-gray-100 bg-slate-50 p-4"
              >
                <h5 className="font-paperlogy text-base text-slate-900">
                  {renderHighlightText(section.title)}
                </h5>

                {section.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground break-keep">
                    {renderHighlightText(section.description)}
                  </p>
                )}

                <div className="mt-3 space-y-1">
                  {section.items.map((item) => (
                    <p
                      key={item}
                      className="text-sm text-muted-foreground break-keep"
                    >
                      - {renderHighlightText(item)}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
