"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { mobileMenuItems } from "@/lib/menu";
import { useSheet } from "@/contexts/sheet-context";

export default function MobileNav() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { setIsOpen } = useSheet();

  if (!isMobile) return null;

  const handleMoreClick = (e: React.MouseEvent, href: string) => {
    if (href === "#more") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {mobileMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isMore = item.href === "#more";

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => isMore && handleMoreClick(e, item.href)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-nanumNeo">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
