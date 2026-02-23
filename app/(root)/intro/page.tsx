import { APP_ENG_NAME, APP_NAME } from "@/lib/constants";
import PageIntro from "@/components/page/page-intro";
import PageTitle from "@/components/page/page-title";

export const metadata = {
  title: `${APP_NAME} 소개 | ${APP_ENG_NAME} Intro`,
  description:
    "런조아 서비스 소개와 개발 과정, 기술 구성, 앞으로의 운영 방향을 안내합니다.",
};

export default function IntroPage() {
  return (
    <>
      <PageTitle
        subtitle="Intro"
        title="런조아 소개"
        description="런조아가 왜 시작되었고, 어떤 방식으로 만들고 운영하는지 소개합니다."
      />
      <PageIntro />
    </>
  );
}
