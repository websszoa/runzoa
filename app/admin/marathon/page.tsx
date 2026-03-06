import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminMarathon from "@/components/admin/admin-marathon";

export default async function AdminMarathonPage() {
  const { data: marathons, error } = await supabaseAdmin
    .from("marathons")
    .select("*")
    .order("event_start_at", { ascending: false });
  if (error) console.error(error);

  return <AdminMarathon marathons={marathons ?? []} />;
}
