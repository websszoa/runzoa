import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { APP_NAME, APP_DESCRIPTION, APP_SITE_URL } from "@/lib/constants";
import { getAllNewsPosts, getNewsPostBySlug } from "@/lib/news";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import PageNewsContent from "@/components/page/page-news-content";

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllNewsPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsPostBySlug(slug);

  if (!post) {
    return {
      title: "소식",
      description: APP_DESCRIPTION,
    };
  }

  const url = `${APP_SITE_URL}/news/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      images: [post.image],
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const post = getNewsPostBySlug(slug);
  if (!post) return notFound();
  const allPosts = getAllNewsPosts();
  const currentIndex = allPosts.findIndex((item) => item.slug === post.slug);
  const prevPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1
      ? allPosts[currentIndex + 1]
      : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const relatedPosts = allPosts
    .filter((item) => item.slug !== post.slug)
    .map((item) => {
      const sameCategory = item.category === post.category ? 2 : 0;
      const sharedTags = item.tags.filter((tag) => post.tags.includes(tag)).length;
      return { item, score: sameCategory + sharedTags };
    })
    .sort((a, b) => b.score - a.score || b.item.date.localeCompare(a.item.date))
    .slice(0, 3)
    .map(({ item }) => item);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: [`${APP_SITE_URL}${post.image}`],
    author: {
      "@type": "Organization",
      name: post.source,
    },
    publisher: {
      "@type": "Organization",
      name: APP_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${APP_SITE_URL}/icons/icon512.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${APP_SITE_URL}/news/${post.slug}`,
    },
  };

  return (
    <article className="rounded-lg border border-dashed border-gray-200 p-4 sm:p-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-4 border-b border-gray-100 pb-5">
        <Badge className="text-xs">{post.category}</Badge>
        <h1 className="font-nanumNeo mt-3 text-2xl leading-snug text-slate-900 md:text-3xl">
          {post.title}
        </h1>
        <p className="font-anyvid mt-3 text-sm text-muted-foreground">
          {post.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-3.5" />
            {post.date}
          </span>
          <span>{post.source}</span>
        </div>
      </header>

      <div className="relative mb-6 h-56 w-full overflow-hidden rounded-lg border border-gray-200 md:h-72">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1024px"
          priority
        />
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-slate-50 px-4 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          ADSENSE SLOT A (상단 본문 광고 영역)
        </p>
      </div>

      <section className="rounded-lg border border-gray-200 p-4 md:p-6">
        <PageNewsContent content={post.content} />
      </section>

      <div className="mt-6 rounded-lg border border-gray-200 bg-slate-50 px-4 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          ADSENSE SLOT B (하단 본문 광고 영역)
        </p>
      </div>

      <section className="mt-6 rounded-lg border border-gray-200 p-4 md:p-6">
        <h2 className="font-paperlogy text-base text-slate-900">이전/다음 글</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {prevPost ? (
            <Link
              href={`/news/${prevPost.slug}`}
              className="rounded-lg border border-gray-200 p-4 hover:border-brand/50"
            >
              <p className="mb-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <ChevronLeft className="size-3.5" />
                이전 글
              </p>
              <p className="font-nanumNeo text-sm text-slate-800">{prevPost.title}</p>
            </Link>
          ) : (
            <div className="rounded-lg border border-gray-100 bg-slate-50 p-4 text-xs text-muted-foreground">
              이전 글이 없습니다.
            </div>
          )}

          {nextPost ? (
            <Link
              href={`/news/${nextPost.slug}`}
              className="rounded-lg border border-gray-200 p-4 text-right hover:border-brand/50"
            >
              <p className="mb-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                다음 글
                <ChevronRight className="size-3.5" />
              </p>
              <p className="font-nanumNeo text-sm text-slate-800">{nextPost.title}</p>
            </Link>
          ) : (
            <div className="rounded-lg border border-gray-100 bg-slate-50 p-4 text-right text-xs text-muted-foreground">
              다음 글이 없습니다.
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-gray-200 p-4 md:p-6">
        <h2 className="font-paperlogy text-base text-slate-900">관련 뉴스</h2>
        {relatedPosts.length ? (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            {relatedPosts.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-brand/50"
              >
                <p className="mb-2 text-xs text-muted-foreground">{item.date}</p>
                <p className="font-nanumNeo text-sm text-slate-800">{item.title}</p>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">관련 뉴스가 없습니다.</p>
        )}
      </section>
    </article>
  );
}
