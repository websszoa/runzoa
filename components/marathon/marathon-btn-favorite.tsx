"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useLogin } from "@/contexts/login-context";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function MarathonBtnFavorite({
  marathonId,
}: {
  marathonId: string;
}) {
  const { openLogin } = useLogin();
  const supabase = createClient();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const { data } = await supabase
        .from("marathon_favorites")
        .select("marathon_id")
        .eq("user_id", session.user.id)
        .eq("marathon_id", marathonId)
        .maybeSingle();
      setIsFavorited(!!data);
    });
  }, [marathonId]);

  const handleClick = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      openLogin();
      toast.info("즐겨찾기는 로그인 후 이용할 수 있습니다.");
      return;
    }

    setIsLoading(true);
    if (isFavorited) {
      const { error } = await supabase
        .from("marathon_favorites")
        .delete()
        .eq("user_id", session.user.id)
        .eq("marathon_id", marathonId);
      if (!error) {
        setIsFavorited(false);
        toast.success("즐겨찾기에서 제거되었습니다.");
      }
    } else {
      const { error } = await supabase
        .from("marathon_favorites")
        .insert({ user_id: session.user.id, marathon_id: marathonId });
      if (!error) {
        setIsFavorited(true);
        toast.success("즐겨찾기에 추가되었습니다.");
      }
    }
    setIsLoading(false);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={isLoading}
          aria-label="즐겨찾기"
          onClick={handleClick}
          className={`h-9 w-9 shrink-0 border-slate-200 transition-colors hover:bg-red-50 hover:text-red-600 ${
            isFavorited
              ? "text-red-500 bg-red-50 border-red-200"
              : "text-slate-600"
          }`}
        >
          <Bookmark className="h-4 w-4" />
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
