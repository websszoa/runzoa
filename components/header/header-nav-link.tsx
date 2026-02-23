"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface HeaderNavLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function HeaderNavLink({
  href,
  icon: Icon,
  label,
  isActive,
  onClick,
}: HeaderNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-3 px-6 py-3 text-sm transition-colors",
        isActive
          ? "bg-brand/5 text-brand"
          : "text-muted-foreground hover:bg-brand/10 hover:text-brand"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="font-nanumNeo">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand" />
    </Link>
  );
}

