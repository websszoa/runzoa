import Image from "next/image";
import Link from "next/link";
import type { NewsPostMeta } from "@/lib/news";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

interface PageNewsProps {
  posts: NewsPostMeta[];
}

export default function PageNews({ posts }: PageNewsProps) {
  if (!posts.length) {
    return (
      <section className="rounded-lg border border-dashed border-gray-200 p-6 text-center">
        <p className="font-anyvid text-sm text-muted-foreground">
          등록된 뉴스가 없습니다.
        </p>
      </section>
    );
  }

  const featuredNews = posts[0];
  const latestNews = posts.slice(1, 4);
  const newsCards = posts.slice(1);

  return (
    <section className="rounded-lg border border-dashed border-gray-200 p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
        <article className="order-1 overflow-hidden rounded-lg border border-gray-200 lg:col-span-2">
          <Link href={`/news/${featuredNews.slug}`} className="block">
            <div className="relative h-44 w-full sm:h-56">
              <Image
                src={featuredNews.image}
                alt={featuredNews.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            </div>
            <div className="space-y-3 p-4 sm:p-6">
              <Badge className="text-xs">{featuredNews.category}</Badge>
              <h3 className="font-nanumNeo text-xl text-slate-900">
                {featuredNews.title}
              </h3>
              <p className="font-anyvid text-sm leading-relaxed text-muted-foreground break-keep">
                {featuredNews.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-3.5" />
                  {featuredNews.date}
                </span>
                <span>{featuredNews.source}</span>
              </div>
            </div>
          </Link>
        </article>

        <aside className="order-2 rounded-lg border border-gray-200 p-4 sm:p-6">
          <p className="font-paperlogy text-sm text-slate-900">최신 브리핑</p>
          <div className="mt-4 space-y-4">
            {latestNews.map((item) => (
              <article
                key={item.slug}
                className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <p className="mb-1 text-xs text-muted-foreground">{item.date}</p>
                <Link href={`/news/${item.slug}`} className="font-nanumNeo text-sm text-slate-800 hover:text-brand">
                  {item.title}
                </Link>
              </article>
            ))}
          </div>
        </aside>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:mt-4 lg:grid-cols-3 lg:gap-4">
        {newsCards.map((item) => (
          <Link
            key={item.slug}
            href={`/news/${item.slug}`}
            className="rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:border-brand/50 hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <Badge variant="outline" className="text-xs">
                {item.category}
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" />
                {item.date}
              </span>
            </div>

            <h4 className="font-nanumNeo text-base text-slate-900">{item.title}</h4>
            <p className="mt-2 font-anyvid text-sm leading-relaxed text-muted-foreground break-keep">
              {item.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
