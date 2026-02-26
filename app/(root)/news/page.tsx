import { APP_NAME, APP_ENG_NAME, APP_SITE_URL } from "@/lib/constants";
import PageTitle from "@/components/page/page-title";
import PageNews from "@/components/page/page-news";
import { getAllNewsPosts } from "@/lib/news";

export const metadata = {
  title: `소식 | ${APP_ENG_NAME} News`,
  description: `${APP_NAME}에서 큐레이션한 마라톤 대회 소식, 훈련 팁, 장비 및 건강 관련 뉴스를 카드 형식으로 확인하세요.`,
  alternates: { canonical: `${APP_SITE_URL}/news` },
  openGraph: {
    title: `${APP_NAME} 소식`,
    description:
      `${APP_NAME}에서 큐레이션한 마라톤 대회 소식, 훈련 팁, 장비 및 건강 관련 뉴스를 카드 형식으로 확인하세요.`,
    url: `${APP_SITE_URL}/news`,
    type: "website",
  },
};

export default function NewsPage() {
  const posts = getAllNewsPosts();

  return (
    <>
      <PageTitle
        subtitle="News"
        title="소식"
        description="마라톤 대회 소식과 러닝 트렌드를 카드 뉴스로 빠르게 확인하세요."
      />
      <PageNews posts={posts} />
    </>
  );
}
