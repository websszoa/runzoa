import HeaderLeft from "./header-left";
import HeaderRight from "./header-right";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <header className="header__container">
      <div className="flex items-center justify-between">
        <HeaderLeft />
        <HeaderRight user={data?.user ?? null} />
      </div>
    </header>
  );
}
