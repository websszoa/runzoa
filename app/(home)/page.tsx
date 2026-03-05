import { createClient } from "@/lib/supabase/server";
import MarathonMain from "@/components/marathon/marathon-main";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: marathons, error } = await supabase
    .from("marathons")
    .select("*")
    .order("event_start_at", { ascending: false });
  if (error) console.error(error);

  return <MarathonMain marathons={marathons ?? []} />;
}
