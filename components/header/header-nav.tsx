"use client";

import type { User } from "@supabase/supabase-js";
import { basicMenuItems, guestMenuItems, userMenuItems } from "@/lib/menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSheet } from "@/contexts/sheet-context";
import { usePathname } from "next/navigation";
import HeaderNavLink from "./header-nav-link";

interface HeaderNavProps {
  user: User | null;
}

export default function HeaderNav({ user }: HeaderNavProps) {
  const { setIsOpen } = useSheet();
  const pathname = usePathname();
  const menuItems = user ? userMenuItems : guestMenuItems;

  return (
    <ScrollArea className="flex-1 h-[calc(100vh-400px)] mt-[-12px] mb-13">
      <nav className="space-y-1 mt-1">
        {basicMenuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <HeaderNavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive}
              onClick={() => setIsOpen(false)}
            />
          );
        })}

        <Separator className="my-2" />

        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <HeaderNavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive}
              onClick={() => setIsOpen(false)}
            />
          );
        })}

        <Separator className="my-2" />
      </nav>
    </ScrollArea>
  );
}
