import { APP_ENG_NAME, APP_NAME } from "@/lib/constants";
import PageTitle from "@/components/page/page-title";
import PageFavorites from "@/components/page/page-favorites";
import AuthLogin from "@/components/auth/auth-login";

export const metadata = {
  title: `${APP_NAME} 즐겨찾기 | ${APP_ENG_NAME} Favorites`,
  description:
    "관심 있는 마라톤 대회를 한곳에서 편하게 확인하세요. 내가 찜한 대회를 빠르게 관리할 수 있습니다.",
};

export default async function FavoritesPage() {
  return (
    <>
      <PageTitle
        subtitle="Favorites"
        title="즐겨찾기"
        description="관심 있는 대회를 저장해두고 언제든지 빠르게 확인해보세요."
      />
      <AuthLogin>
        <PageFavorites />
      </AuthLogin>
    </>
  );
}
