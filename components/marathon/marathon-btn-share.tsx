"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLogin } from "@/contexts/login-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MarathonBtnShareProps = {
  marathonId: string;
  slug?: string;
};

export default function MarathonBtnShare({
  marathonId,
  slug,
}: MarathonBtnShareProps) {
  const { openLogin } = useLogin();
  const supabase = createClient();
  const [isShared, setIsShared] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const { data, error } = await supabase
        .from("marathon_shares")
        .select("marathon_id")
        .eq("user_id", session.user.id)
        .eq("marathon_id", marathonId)
        .maybeSingle();
      if (!error) setIsShared(!!data);
    });
  }, [marathonId]);

  const handleClick = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      openLogin();
      toast.info("공유는 로그인 후 이용할 수 있습니다.");
      return;
    }

    setIsLoading(true);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = slug ? `${origin}/marathon/${slug}` : window.location.href;

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "마라톤 대회 정보",
          url,
        });
        toast.success("공유되었습니다.");
        setIsShared(true);
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("링크가 복사되었습니다.");
        setIsShared(true);
      }
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(url);
          toast.success("링크가 복사되었습니다.");
          setIsShared(true);
        } catch {
          toast.error("공유에 실패했습니다.");
        }
      }
    }

    await supabase.rpc("add_marathon_share", { p_marathon_id: marathonId });
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
          aria-label="공유하기"
          onClick={handleClick}
          className={`h-9 w-9 shrink-0 border-slate-200 transition-colors hover:bg-red-50 hover:text-red-600 ${
            isShared
              ? "text-red-500 bg-red-50 border-red-200"
              : "text-slate-600"
          }`}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-nanumNeo">{isShared ? "공유됨" : "공유하기"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
