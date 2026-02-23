"use client";

import { Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSheet } from "@/contexts/sheet-context";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import HeaderInfo from "./header-info";
import HeaderSheet from "./header-sheet";
import HeaderUser from "./header-user";
import HeaderNav from "./header-nav";

export default function HeaderRight() {
  const { isOpen, setIsOpen } = useSheet();

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-full hover:border bg-brand text-white hover:bg-white hover:text-brand overflow-hidden p-0"
          >
            <Medal className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <HeaderSheet user={null} />
          <HeaderUser />
          <HeaderNav user={null} />
          <HeaderInfo />
        </SheetContent>
      </Sheet>
    </>
  );
}
