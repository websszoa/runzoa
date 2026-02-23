import { APP_NAME, APP_ENG_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import PageTitle from "@/components/page/page-title";
import PageProfile from "@/components/page/page-profile";
import PageLogin from "@/components/page/page-login";

export const metadata = {
  title: `${APP_NAME} 프로필 | ${APP_ENG_NAME} Profile`,
  description:
    "내 프로필 정보를 확인하고 수정할 수 있는 페이지입니다. 계정 정보와 서비스 이용 내역을 편리하게 관리해보세요.",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <>
      <PageTitle
        subtitle="Profile"
        title="프로필"
        description="내 프로필 정보를 확인하고 수정할 수 있는 페이지입니다."
      />
      {user?.id ? <PageProfile profile={profile} /> : <PageLogin />}
    </>
  );
}
