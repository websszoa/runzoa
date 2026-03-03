import { APP_NAME, APP_ENG_NAME } from "@/lib/constants";
import PageNotice from "@/components/page/page-notice";
import PageTitle from "@/components/page/page-title";

export const metadata = {
  title: `${APP_NAME} 공지사항 | ${APP_ENG_NAME} Notice`,
  description: `${APP_NAME} 서비스의 업데이트 소식, 시스템 안내, 이벤트 공지 등 중요한 정보를 확인할 수 있는 공지사항 페이지입니다.`,
};

export default function NoticePage() {
  return (
    <>
      <PageTitle
        subtitle="Notice"
        title="공지사항"
        description="서비스 업데이트, 안내 사항, 이벤트 소식 등 중요한 정보를 확인하세요."
      />
      <PageNotice />
    </>
  );
}
