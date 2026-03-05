import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminContact from "@/components/admin/admin-contact";

export default async function AdminContactPage() {
  const { data: contacts, error } = await supabaseAdmin
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return <AdminContact contacts={contacts ?? []} />;
}
