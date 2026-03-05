import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminMember from "@/components/admin/admin-member";

export default async function AdminMemberPage() {
  const { data: members, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return <AdminMember members={members ?? []} />;
}
