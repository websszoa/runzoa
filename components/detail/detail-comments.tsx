"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquareText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLogin } from "@/contexts/login-context";
import { formatCommentDate } from "@/lib/utils";

interface Comment {
  id: string;
  marathon_id: string;
  user_id: string | null;
  name: string;
  content: string;
  created_at: string;
}

export default function DetailComments({ marathonId }: { marathonId: string }) {
  const { openLogin } = useLogin();
  const supabase = createClient();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("id, marathon_id, user_id, name, content, created_at")
      .eq("marathon_id", marathonId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("댓글 목록 조회 실패:", error);
      return;
    }
    setComments((data as Comment[]) ?? []);
  }, [marathonId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user);
    });
  }, []);

  const handleSubmit = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      openLogin();
      toast.info("댓글을 작성하려면 로그인해 주세요.");
      return;
    }

    const trimmed = content.trim();
    if (!trimmed) {
      toast.error("댓글 내용을 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .single();

      const name = profile?.full_name?.trim() || "익명";

      const { error } = await supabase.from("comments").insert({
        marathon_id: marathonId,
        user_id: session.user.id,
        name,
        content: trimmed,
      });

      if (error) throw error;

      setContent("");
      await fetchComments();
      toast.success("댓글이 등록되었습니다.");
    } catch (err) {
      console.error(err);
      toast.error("댓글 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="detail__block mt-4" data-comments-section>
      <h3>
        <MessageSquareText className="w-5 h-5 text-brand" /> 댓글
      </h3>

      <div className="space-y-3">
        {/* 댓글 목록 */}
        <div className="space-y-4 mb-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 border-b border-dashed pb-4 last:border-b-0"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-red-50 p-1">
                  <Image
                    src="/face/face01.png"
                    alt=""
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-sm font-anyvid">
                        {comment.name}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatCommentDate(comment.created_at)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground font-anyvid">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm font-nanumNeo border border-dashed rounded">
              아직 댓글이 없습니다. <br />첫 번째 리뷰를 남겨주세요! 💬
            </div>
          )}
        </div>

        {/* 댓글 입력 */}
        <div className="relative">
          <Textarea
            placeholder={
              isLoggedIn
                ? "100자 이내로 댓글을 작성할 수 있습니다."
                : "로그인 후 댓글을 작성할 수 있습니다."
            }
            rows={3}
            maxLength={100}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none font-nanumNeo h-20"
          />
          <div className="flex items-start justify-between mt-2">
            <div className="text-xs text-gray-500 font-nanumNeo">
              {content.length}/100
            </div>
            <Button
              size="sm"
              className="bg-brand text-white border-0 hover:bg-brand/90 font-nanumNeo"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "등록 중…" : "등록"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
