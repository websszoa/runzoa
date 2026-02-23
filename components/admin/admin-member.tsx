"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Profile } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { MessageSquareCode, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DialogMemberEdit from "@/components/dialog/dialog-member-edit";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminMember({ members }: { members: Profile[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);
  const [memberRows, setMemberRows] = useState<Profile[]>(members);

  // 통계
  const stats = useMemo(() => {
    const total = memberRows.length;
    const active = memberRows.filter((m) => !m.is_deleted).length;
    const deleted = memberRows.filter((m) => m.is_deleted).length;
    const admins = memberRows?.filter((m) => m.role === "admin").length || 0;
    return { total, active, deleted, admins };
  }, [memberRows]);

  const handleUpdated = (updated: Profile) => {
    setMemberRows((prev) =>
      prev.map((member) => (member.id === updated.id ? updated : member)),
    );
    setSelectedMember(updated);
  };

  return (
    <div className="md:p-6 md:space-y-6 p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold font-paperlogy flex items-center gap-2">
          회원 관리
        </h1>
        <p className="text-sm text-muted-foreground font-anyvid mt-1">
          전체 회원 목록을 확인하고 관리할 수 있습니다.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">
            전체 회원
          </p>
          <p className="text-2xl font-semibold font-paperlogy">{stats.total}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">
            활성 회원
          </p>
          <p className="text-2xl font-semibold font-paperlogy text-green-600">
            {stats.active}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">
            탈퇴 회원
          </p>
          <p className="text-2xl font-semibold font-paperlogy text-red-600">
            {stats.deleted}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">관리자</p>
          <p className="text-2xl font-semibold font-paperlogy text-blue-600">
            {stats.admins}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-hidden font-anyvid">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[50px] text-center">No</TableHead>
              <TableHead className="w-[60px] text-center">이미지</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead className="text-center">역할</TableHead>
              <TableHead className="w-[50px] text-center">방문</TableHead>
              <TableHead className="text-center">상태</TableHead>
              <TableHead>가입일</TableHead>
              <TableHead className="w-[60px] text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex flex-col items-center gap-2">
                    <MessageSquareCode className="w-8 h-8 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      등록된 회원이 없습니다.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              memberRows.map((member, index) => (
                <TableRow key={member.id} className="hover:bg-gray-50">
                  <TableCell className="text-center">
                    {memberRows.length - index}
                  </TableCell>
                  <TableCell>
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 mx-auto">
                      <Image
                        src={member.avatar_url || "/face/face01.png"}
                        alt={member.full_name || "프로필"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{member.full_name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell className="text-center">
                    {member.role === "admin" && (
                      <Badge variant="destructive">관리자</Badge>
                    )}
                    {member.role !== "admin" && (
                      <Badge variant="outline">회원</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {member.visit_count}회
                  </TableCell>
                  <TableCell className="text-center">
                    {member.is_deleted && (
                      <Badge variant="destructive">탈퇴</Badge>
                    )}
                    {!member.is_deleted && (
                      <Badge variant="outline">활성</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(member.created_at)}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 font-anyvid bg-gray-100"
                      onClick={() => {
                        setSelectedMember(member);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DialogMemberEdit
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        member={selectedMember}
        onUpdated={handleUpdated}
      />
    </div>
  );
}
