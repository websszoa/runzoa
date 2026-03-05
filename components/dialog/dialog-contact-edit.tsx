"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { Contact } from "@/lib/types";
import { toast } from "sonner";
import { updateContactByAdmin } from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DialogContactEditProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onUpdated?: (updated: Contact) => void;
}

export default function DialogContactEdit({
  open,
  onOpenChange,
  contact,
  onUpdated,
}: DialogContactEditProps) {
  const [status, setStatus] = useState<Contact["status"]>("pending");
  const [adminReply, setAdminReply] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open || !contact) return;
    setStatus(contact.status);
    setAdminReply(contact.admin_reply ?? "");
  }, [open, contact]);

  const isChanged = useMemo(() => {
    if (!contact) return false;
    return (
      status !== contact.status ||
      adminReply.trim() !== (contact.admin_reply ?? "")
    );
  }, [adminReply, contact, status]);

  const handleSave = () => {
    if (!contact || !isChanged) return;

    startTransition(async () => {
      try {
        const result = await updateContactByAdmin({
          id: contact.id,
          status,
          adminReply,
        });

        onUpdated?.({
          ...contact,
          status: result.status,
          admin_reply: result.admin_reply,
          admin_id: result.admin_id,
          resolved_at: result.resolved_at,
        });

        toast.success("문의 상태/답변이 저장되었습니다.");
        onOpenChange(false);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "문의 업데이트 중 오류가 발생했습니다.";
        toast.error(message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-brand">문의 상세/수정</DialogTitle>
          <DialogDescription>
            상태와 답변을 수정한 뒤 저장할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 font-anyvid text-muted-foreground">
          <div className="space-y-2">
            <p className="text-sm text-slate-900">문의자 이메일</p>
            <div className="rounded-md border p-3 flex justify-center items-center bg-red-50 border-red-200">
              {contact?.user_email ? (
                <a
                  href={`mailto:${contact.user_email}`}
                  className="inline-flex items-center gap-1 text-sm text-brand underline underline-offset-4 hover:text-brand/80"
                >
                  {contact.user_email}
                </a>
              ) : (
                <p className="text-sm">이메일 정보가 없습니다.</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-900">문의 내용</p>
            <div className="rounded-md border p-3">
              <p className="text-sm whitespace-pre-wrap break-keep">
                {contact?.message ?? "문의 내용이 없습니다."}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-900">상태</p>
            <Select
              value={status}
              onValueChange={(value: Contact["status"]) => setStatus(value)}
              disabled={!contact || isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">대기중</SelectItem>
                <SelectItem value="progress">처리중</SelectItem>
                <SelectItem value="resolved">해결됨</SelectItem>
                <SelectItem value="closed">종료됨</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-900">관리자 답변</p>
            <Textarea
              value={adminReply}
              onChange={(e) => setAdminReply(e.target.value)}
              placeholder="답변 내용을 입력해주세요."
              rows={8}
              className="h-30"
              disabled={!contact || isPending}
            />
          </div>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            닫기
          </Button>
          <Button
            onClick={handleSave}
            className="bg-brand text-white hover:bg-brand/90"
            disabled={!contact || !isChanged || isPending}
          >
            {isPending ? "저장 중..." : "저장"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
