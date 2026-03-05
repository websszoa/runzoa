"use client";

import { usePathname, useRouter } from "next/navigation";
import { adminMenuItems } from "@/lib/menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AdminNavMain() {
  const pathname = usePathname();
  const router = useRouter();

  const handleMenuClick = (href: string) => {
    router.push(href);
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {adminMenuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  tooltip={item.label}
                  isActive={isActive}
                  onClick={() => handleMenuClick(item.href)}
                  className="
                    hover:text-brand hover:bg-brand/10
                    data-[active=true]:bg-brand
                    data-[active=true]:text-white
                  "
                >
                  {item.icon && <item.icon />}
                  <span className="font-nanumNeo text-sm">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
