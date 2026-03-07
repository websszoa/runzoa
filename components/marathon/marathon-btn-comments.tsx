"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageSquareMore } from "lucide-react";

export default function MarathonBtnComments({ slug }: { slug: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          aria-label="댓글"
          asChild
        >
          <Link href={`/marathon/${slug}#comments`}>
            <MessageSquareMore className="h-4 w-4" />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-nanumNeo">댓글</p>
      </TooltipContent>
    </Tooltip>
  );
}
