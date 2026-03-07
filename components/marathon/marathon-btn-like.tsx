"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useLogin } from "@/contexts/login-context";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function MarathonBtnLike({
  marathonId,
}: {
  marathonId: string;
}) {
  const { openLogin } = useLogin();
  const supabase = createClient();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const { data } = await supabase
        .from("marathon_likes")
        .select("marathon_id")
        .eq("user_id", session.user.id)
        .eq("marathon_id", marathonId)
        .maybeSingle();
      setIsLiked(!!data);
    });
  }, [marathonId]);

  const handleClick = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      openLogin();
      toast.info("좋아요는 로그인 후 이용할 수 있습니다.");
      return;
    }

    setIsLoading(true);
    if (isLiked) {
      const { error } = await supabase
        .from("marathon_likes")
        .delete()
        .eq("user_id", session.user.id)
        .eq("marathon_id", marathonId);
      if (!error) {
        setIsLiked(false);
        toast.success("좋아요를 취소했습니다.");
      }
    } else {
      const { error } = await supabase
        .from("marathon_likes")
        .insert({ user_id: session.user.id, marathon_id: marathonId });
      if (!error) {
        setIsLiked(true);
        toast.success("좋아요를 눌렀습니다.");
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
          aria-label="좋아요"
          onClick={handleClick}
          className={`h-9 w-9 shrink-0 border-slate-200 transition-colors hover:bg-red-50 hover:text-red-600 ${
            isLiked ? "text-red-500 bg-red-50 border-red-200" : "text-slate-600"
          }`}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-nanumNeo">{isLiked ? "좋아요 취소" : "좋아요"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
