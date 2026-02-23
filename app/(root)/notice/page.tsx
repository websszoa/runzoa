import { APP_NAME, APP_ENG_NAME } from "@/lib/constants";
import PageNotice from "@/components/page/page-notice";
import PageTitle from "@/components/page/page-title";

export const metadata = {
  title: `${APP_NAME} 공지사항 | ${APP_ENG_NAME} Notice`,
  description: `${APP_NAME}의 서비스 소식, 기능 업데이트, 마라톤 대회 데이터 추가 및 주요 안내사항을 한곳에서 확인하세요.`,
};

export default function NoticePage() {
  return (
    <>
      <PageTitle
        subtitle="Notice"
        title="공지사항"
        description="서비스 소식과 전국 마라톤 대회 관련 업데이트를 빠르게 확인하세요."
      />
      <PageNotice />
    </>
  );
}
