import { APP_ENG_NAME, APP_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import PageTitle from "@/components/page/page-title";
import PageRecords from "@/components/page/page-records";
import PageLogin from "@/components/page/page-login";

export const metadata = {
  title: `${APP_NAME} 기록하기 | ${APP_ENG_NAME} Records`,
  description:
    "마라톤 기록을 관리하고 추적하세요. 내가 참가한 대회의 기록을 한눈에 확인할 수 있습니다.",
};

export default async function RecordsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <>
      <PageTitle
        subtitle="Records"
        title="기록하기"
        description="내가 참가한 마라톤 대회의 기록을 관리하고 추적해보세요."
      />
      {data?.user ? <PageRecords /> : <PageLogin />}
    </>
  );
}
