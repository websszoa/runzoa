"use client";

import { newsList, News } from "@/lib/news";
import { Badge } from "../ui/badge";
import { CalendarDays } from "lucide-react";

const categoryVariant: Record<
  News["category"],
  "default" | "destructive" | "secondary" | "outline"
> = {
  대회: "destructive",
  운영: "default",
  러닝팁: "secondary",
  이벤트: "outline",
};

function NewsCard({ news }: { news: News }) {
  return (
    <div className="font-anyvid group cursor-pointer rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md hover:border-brand/40 transition-all duration-200 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <Badge
          variant={categoryVariant[news.category]}
          className="text-xs shrink-0"
        >
          {news.category}
        </Badge>
        {news.isNew && (
          <span className="text-[10px] font-semibold text-red-500 uppercase tracking-widest">
            NEW
          </span>
        )}
      </div>

      <h3 className="font-nanumNeo text-sm text-slate-800 leading-snug group-hover:text-brand transition-colors line-clamp-2">
        {news.title}
      </h3>

      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 break-keep">
        {news.summary}
      </p>

      <div className="mt-auto flex items-center gap-1 text-xs text-muted-foreground pt-1">
        <CalendarDays className="size-3.5" />
        <span>{news.date}</span>
      </div>
    </div>
  );
}

export default function PageNews() {
  const featured = newsList.find((n) => n.isFeatured);
  const rest = newsList.filter((n) => !n.isFeatured);

  return (
    <div className="space-y-4">
      {/* 주요 소식 */}
      {featured && (
        <div className="rounded-xl border border-dashed border-brand/40 bg-brand/5 p-5 sm:p-6 font-anyvid cursor-pointer hover:shadow-md transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant={categoryVariant[featured.category]} className="text-xs">
                {featured.category}
              </Badge>
              <span className="text-[10px] font-semibold text-red-500 uppercase tracking-widest">
                NEW
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-nanumNeo text-base text-slate-900 leading-snug line-clamp-1">
                {featured.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1 break-keep">
                {featured.summary}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <CalendarDays className="size-3.5" />
              <span>{featured.date}</span>
            </div>
          </div>
        </div>
      )}

      {/* 소식 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {rest.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </div>
  );
}
