"use client";

import { useMemo } from "react";
import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { Eye, LucideMessageSquareCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Contact } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminContact({ contacts }: { contacts: Contact[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactRows, setContactRows] = useState<Contact[]>(contacts);

  // 통계 (대기중, 처리중, 해결됨, 종료됨)
  const { pending, progress, resolved, closed } = useMemo(() => {
    const pending = contactRows.filter((c) => c.status === "pending").length;
    const progress = contactRows.filter((c) => c.status === "progress").length;
    const resolved = contactRows.filter((c) => c.status === "resolved").length;
    const closed = contactRows.filter((c) => c.status === "closed").length;
    return { pending, progress, resolved, closed };
  }, [contactRows]);
  return (
    <div className="md:p-6 md:space-y-6 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold font-paperlogy flex items-center gap-2">
            문의 관리
          </h2>
          <p className="text-sm text-muted-foreground font-anyvid mt-1">
            사용자 문의를 확인하고 답변할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">
            전체 문의
          </p>
          <p className="text-2xl font-semibold font-paperlogy">
            {contactRows.length}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">대기중</p>
          <p className="text-2xl font-semibold font-paperlogy text-red-600">
            {pending}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">처리중</p>
          <p className="text-2xl font-semibold font-paperlogy text-yellow-600">
            {progress}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">해결됨</p>
          <p className="text-2xl font-semibold font-paperlogy text-green-600">
            {resolved}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">종료됨</p>
          <p className="text-2xl font-semibold font-paperlogy text-muted-foreground">
            {closed}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-hidden font-anyvid">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[50px] text-center">No</TableHead>
              <TableHead className="">문의 내용</TableHead>
              <TableHead className="w-[75px] text-center">상태</TableHead>
              <TableHead className="w-[75px] text-center">답변</TableHead>
              <TableHead className="w-[110px] text-center">문의일</TableHead>
              <TableHead className="w-[60px] text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex flex-col items-center gap-2">
                    <LucideMessageSquareCode className="w-8 h-8 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      등록된 문의가 없습니다.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              contactRows.map((contact, index) => (
                <TableRow key={contact.id} className="hover:bg-gray-50">
                  <TableCell className="text-center text-muted-foreground">
                    {contactRows.length - index}
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-muted-foreground">
                    {contact.message}
                  </TableCell>
                  <TableCell className="text-center">
                    {contact.status === "pending" && (
                      <Badge variant="destructive">대기중</Badge>
                    )}
                    {contact.status === "progress" && (
                      <Badge variant="outline">처리중</Badge>
                    )}
                    {contact.status === "resolved" && (
                      <Badge variant="outline">해결됨</Badge>
                    )}
                    {contact.status === "closed" && (
                      <Badge variant="outline">종료됨</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {contact.admin_reply ? (
                      <Badge variant="destructive">완료</Badge>
                    ) : (
                      <Badge variant="outline">미답변</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(contact.created_at) || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 font-anyvid bg-gray-100"
                      onClick={() => {
                        setSelectedContact(contact);
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
    </div>
  );
}
