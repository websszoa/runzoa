"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { mobileMenuItems } from "@/lib/menu";
import { useSheet } from "@/contexts/sheet-context";
import { TentTree } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();
  const { setIsOpen } = useSheet();

  const handleMoreClick = (e: React.MouseEvent, href: string) => {
    if (href === "#more") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* 모바일: 하단 고정 탭바 */}
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

      {/* PC: 하단 중앙 플로팅 glassmorphism 독 */}
      <nav className="fixed bottom-6 right-0 left-0 z-30 hidden md:flex justify-center pointer-events-none">
        <div className="pointer-events-auto bg-brand px-7 py-3 rounded-full flex items-center gap-5">
          <TentTree className="size-4.5 text-white shrink-0" aria-hidden />
          {mobileMenuItems.map((item) => {
            const isActive = pathname === item.href;
            const isMore = item.href === "#more";

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => isMore && handleMoreClick(e, item.href)}
                className={cn(
                  "text-sm font-anyvid transition-colors",
                  isActive
                    ? "text-white font-medium"
                    : "text-white/80 hover:text-white hover:opacity-100",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
