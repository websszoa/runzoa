"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useLogin } from "@/contexts/login-context";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ButtonHeartProps = {
  marathonId: string;
  className?: string;
};

export default function ButtonHeart({
  marathonId,
  className,
}: ButtonHeartProps) {
  const { openLogin } = useLogin();
  const supabase = createClient();
  const [isHearted, setIsHearted] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      const { data } = await supabase.rpc("is_marathon_hearted", {
        p_marathon_id: marathonId,
      });
      if (!cancelled) setIsHearted(!!data);
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [marathonId]);

  const handleClick = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      openLogin();
      toast.info("로그인 후 좋아요를 누를 수 있어요.");
      return;
    }

    const { data, error } = await supabase.rpc("toggle_marathon_heart", {
      p_marathon_id: marathonId,
    });

    if (error) {
      toast.error(error.message || "처리 중 오류가 발생했습니다.");
      return;
    }

    setIsHearted(data === true);
    if (data === true) {
      toast.success("좋아요를 눌렀어요.");
    } else {
      toast.success("좋아요를 취소했어요.");
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            "button-heart",
            className,
            isHearted && "bg-red-50 border-red-200 text-red-600",
          )}
          aria-label={isHearted ? "좋아요 취소" : "좋아요"}
          onClick={handleClick}
        >
          <Heart className={cn("h-4 w-4", isHearted && "text-red-600")} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-nanumNeo">{isHearted ? "좋아요 취소" : "좋아요"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
