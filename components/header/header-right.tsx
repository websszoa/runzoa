"use client";

import type { User } from "@supabase/supabase-js";
import { Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSheet } from "@/contexts/sheet-context";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import HeaderInfo from "./header-info";
import HeaderSheet from "./header-sheet";
import HeaderUser from "./header-user";
import HeaderNav from "./header-nav";

interface HeaderRightProps {
  user: User | null;
}

export default function HeaderRight({ user }: HeaderRightProps) {
  const { isOpen, setIsOpen } = useSheet();

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-full hover:border bg-brand text-white hover:bg-white hover:text-brand overflow-hidden p-0"
            aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isOpen}
          >
            <Medal className="w-5 h-5" aria-hidden />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <HeaderSheet user={user} />
          <HeaderUser userId={user?.id} />
          <HeaderNav user={user} />
          <HeaderInfo />
        </SheetContent>
      </Sheet>
    </>
  );
}
