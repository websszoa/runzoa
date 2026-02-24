"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useLogin } from "@/contexts/login-context";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ButtonFavoriteProps = {
  marathonId: string;
  className?: string;
};

export default function ButtonFavorite({
  marathonId,
  className,
}: ButtonFavoriteProps) {
  const { openLogin } = useLogin();
  const supabase = createClient();
  const [isFavorited, setIsFavorited] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      const { data } = await supabase.rpc("is_marathon_favorited", {
        p_marathon_id: marathonId,
      });
      if (!cancelled) setIsFavorited(!!data);
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
      toast.info("로그인 후 즐겨찾기를 추가할 수 있어요.");
      return;
    }

    const { data, error } = await supabase.rpc("toggle_marathon_favorite", {
      p_marathon_id: marathonId,
    });

    if (error) {
      toast.error(error.message || "처리 중 오류가 발생했습니다.");
      return;
    }

    setIsFavorited(data === true);
    if (data === true) {
      toast.success("즐겨찾기에 추가되었습니다.");
    } else {
      toast.success("즐겨찾기를 해제했습니다.");
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
            "button-favorite",
            className,
            isFavorited && "bg-red-50 border-red-200 text-red-600",
          )}
          aria-label={isFavorited ? "즐겨찾기 해제" : "즐겨찾기"}
          onClick={handleClick}
        >
          <Bookmark
            className={`h-4 w-4 ${isFavorited ? "text-red-600" : ""}`}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-nanumNeo">
          {isFavorited ? "즐겨찾기 해제" : "즐겨찾기"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
