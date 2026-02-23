"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";
import type { Profile } from "@/lib/types";
import { toast } from "sonner";
import { updateMemberByAdmin } from "@/lib/actions/member";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface DialogMemberEditProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Profile | null;
  onUpdated?: (updated: Profile) => void;
}

export default function DialogMemberEdit({
  open,
  onOpenChange,
  member,
  onUpdated,
}: DialogMemberEditProps) {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("user");
  const [visitCount, setVisitCount] = useState(0);
  const [isDeleted, setIsDeleted] = useState(false);
  const [createdAt, setCreatedAt] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open || !member) return;
    setFullName(member.full_name ?? "");
    setRole(member.role);
    setVisitCount(member.visit_count);
    setIsDeleted(member.is_deleted);
    setCreatedAt(
      member.created_at
        ? new Date(member.created_at).toISOString().slice(0, 10)
        : "",
    );
  }, [open, member]);

  const memberCreatedAtYmd = useMemo(
    () =>
      member?.created_at
        ? new Date(member.created_at).toISOString().slice(0, 10)
        : "",
    [member?.created_at],
  );

  const isChanged = useMemo(() => {
    if (!member) return false;
    return (
      (fullName ?? "") !== (member.full_name ?? "") ||
      role !== member.role ||
      visitCount !== member.visit_count ||
      isDeleted !== member.is_deleted ||
      createdAt !== memberCreatedAtYmd
    );
  }, [createdAt, fullName, isDeleted, member, memberCreatedAtYmd, role, visitCount]);

  const handleSave = () => {
    if (!member || !isChanged) return;

    startTransition(async () => {
      try {
        const created_at_iso = createdAt
          ? new Date(createdAt + "T00:00:00.000Z").toISOString()
          : member.created_at;

        const result = await updateMemberByAdmin({
          id: member.id,
          full_name: fullName.trim() || undefined,
          role,
          visit_count: visitCount,
          is_deleted: isDeleted,
          created_at: created_at_iso,
        });

        onUpdated?.({
          ...member,
          full_name: result.full_name ?? member.full_name,
          role: result.role,
          visit_count: result.visit_count,
          is_deleted: result.is_deleted,
          created_at: result.created_at,
        });

        toast.success("회원 정보가 저장되었습니다.");
        onOpenChange(false);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "회원 정보 업데이트 중 오류가 발생했습니다.";
        toast.error(message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-brand">회원 상세/수정</DialogTitle>
          <DialogDescription>
            가입일, 역할, 방문, 상태를 수정한 뒤 저장할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        {/* 사진 | 이름, 이메일 (표시만) */}
        <div className="flex items-center gap-4 font-anyvid">
          <div className="shrink-0 w-16 h-16 rounded-full overflow-hidden bg-gray-100">
            <Image
              src={member?.avatar_url || "/face/face01.png"}
              alt={member?.full_name || "프로필"}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl text-slate-900 font-medium">
              {member?.full_name ?? "-"}
            </p>
            <p className="text-sm text-muted-foreground">
              {member?.email ?? "-"}
            </p>
          </div>
        </div>

        {/* 수정 영역: 이름 / 가입일 / 역할 / 방문 / 상태 */}
        <div className="space-y-3 font-anyvid text-muted-foreground border-t pt-4">
          <div className="space-y-2">
            <p className="text-sm text-slate-900">이름</p>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="이름 입력"
              disabled={!member || isPending}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-900">가입일</p>
            <Input
              type="date"
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)}
              disabled={!member || isPending}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-900">역할</p>
            <Select
              value={role}
              onValueChange={setRole}
              disabled={!member || isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="역할 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">회원</SelectItem>
                <SelectItem value="admin">관리자</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-900">방문</p>
            <Input
              type="number"
              min={0}
              value={visitCount}
              onChange={(e) =>
                setVisitCount(Math.max(0, Number(e.target.value)))
              }
              disabled={!member || isPending}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-900">상태</p>
            <Select
              value={isDeleted ? "deleted" : "active"}
              onValueChange={(value) => setIsDeleted(value === "deleted")}
              disabled={!member || isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="deleted">탈퇴</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
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
            disabled={!member || !isChanged || isPending}
          >
            {isPending ? "저장 중..." : "저장"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
