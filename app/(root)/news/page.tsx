import { APP_NAME, APP_ENG_NAME } from "@/lib/constants";
import PageTitle from "@/components/page/page-title";
import PageNews from "@/components/page/page-news";

export const metadata = {
  title: `${APP_NAME} 소식 | ${APP_ENG_NAME} News`,
  description:
    "마라톤 대회 소식, 런조아 업데이트, 러닝 팁 등 최신 소식을 확인하세요.",
};

export default function NewsPage() {
  return (
    <>
      <PageTitle
        subtitle="News"
        title="런조아 소식"
        description="마라톤 대회 소식, 서비스 업데이트, 러닝 팁 등 최신 소식을 전달합니다."
      />
      <PageNews />
    </>
  );
}
