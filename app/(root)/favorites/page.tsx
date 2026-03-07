import { APP_ENG_NAME, APP_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { Marathon } from "@/lib/types";
import PageTitle from "@/components/page/page-title";
import PageFavorites from "@/components/page/page-favorites";
import PageLogin from "@/components/page/page-login";

export const metadata = {
  title: `${APP_NAME} 즐겨찾기 | ${APP_ENG_NAME} Favorites`,
  description:
    "관심 있는 마라톤 대회를 한곳에서 편하게 확인하세요. 내가 찜한 대회를 빠르게 관리할 수 있습니다.",
};

export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let favoriteMarathons: Marathon[] = [];
  if (user?.id) {
    const { data: favorites } = await supabase
      .from("marathon_favorites")
      .select("marathon_id")
      .eq("user_id", user.id);
    const marathonIds = (favorites ?? []).map((f) => f.marathon_id);
    if (marathonIds.length > 0) {
      const { data: marathons } = await supabase
        .from("marathons")
        .select("*")
        .in("id", marathonIds)
        .order("event_start_at", { ascending: false });
      favoriteMarathons = (marathons ?? []) as Marathon[];
    }
  }

  return (
    <>
      <PageTitle
        subtitle="Favorites"
        title="즐겨찾기"
        description="관심 있는 대회를 저장해두고 언제든지 빠르게 확인해보세요."
      />
      {user?.id ? (
        <PageFavorites marathons={favoriteMarathons} />
      ) : (
        <PageLogin />
      )}
    </>
  );
}
