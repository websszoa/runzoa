"use client";

import { basicMenuItems, guestMenuItems, userMenuItems } from "@/lib/menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import { useSheet } from "@/contexts/sheet-context";

import HeaderNavLink from "./header-nav-link";

export default function HeaderNav() {
  const { setIsOpen } = useSheet();
  const pathname = usePathname();
  const user = true;

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

        {userMenuItems.map((item) => {
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
      </nav>
    </ScrollArea>
  );
}
