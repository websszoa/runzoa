import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminSiteHeader } from "@/components/admin/admin-site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AuthAdmin from "@/components/auth/auth-admin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthAdmin>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AdminSidebar />
        <SidebarInset>
          <AdminSiteHeader />
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthAdmin>
  );
}
