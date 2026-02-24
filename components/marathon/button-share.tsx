"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Share2 } from "lucide-react";
import { shareMarathonLink } from "@/lib/utils";
import type { Marathon } from "@/lib/types";
import { cn } from "@/lib/utils";

type ButtonShareProps = {
  marathon: Marathon;
  onShareSuccess?: (marathonId: string) => void;
  className?: string;
};

export default function ButtonShare({
  marathon,
  onShareSuccess,
  className,
}: ButtonShareProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn("button-share", className)}
          aria-label="공유하기"
          onClick={() => shareMarathonLink(marathon, onShareSuccess)}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-nanumNeo">공유하기</p>
      </TooltipContent>
    </Tooltip>
  );
}
