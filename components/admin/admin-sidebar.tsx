"use client";

import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { AdminNavMain } from "./admin-nav-main";
import { AdminNavUser } from "./admin-nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AdminSidebar() {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <h1 className="flex items-center justify-center bg-gray-200 py-6">
                <Image
                  src="/icons/favicon.svg"
                  alt="logo"
                  width={100}
                  height={100}
                  className="w-7 h-7"
                />
                <span className="text-xl font-semibold font-paperlogy">
                  {APP_NAME} 관리자
                </span>
              </h1>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AdminNavMain />
      </SidebarContent>
      <SidebarFooter>
        <AdminNavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
