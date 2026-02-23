"use client";

import { useState } from "react";
import { Marathon } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Eye, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AdminMarathonTableProps = {
  marathons: Marathon[];
  onMarathonUpdated: (updatedMarathon: Marathon) => void;
  onMarathonDeleted?: (deletedMarathon: Marathon) => void;
};

export default function AdminMarathonTable({
  marathons,
  onMarathonUpdated,
  onMarathonDeleted,
}: AdminMarathonTableProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMarathon, setSelectedMarathon] = useState<Marathon | null>(
    null,
  );

  return (
    <div className="bg-white border rounded-lg overflow-hidden font-anyvid">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[50px] text-center">No</TableHead>
            <TableHead>대회명</TableHead>
            <TableHead className="w-[80px]">국가</TableHead>
            <TableHead className="w-[80px]">지역</TableHead>
            <TableHead className="w-[100px] text-center">접수상태</TableHead>
            <TableHead className="w-[150px]">대회일</TableHead>
            <TableHead className="w-[150px]">접수 기간</TableHead>
            <TableHead className="w-[80px] text-center">관리</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {marathons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                <div className="flex flex-col items-center gap-2">
                  <Trophy className="w-8 h-8 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    등록된 마라톤 대회가 없습니다.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            marathons.map((marathon, index) => (
              <TableRow key={marathon.id} className="hover:bg-gray-50">
                <TableCell className="text-center text-muted-foreground">
                  {marathons.length - index}
                </TableCell>
                <TableCell>{marathon.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {marathon.country || "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {marathon.region || "-"}
                </TableCell>
                <TableCell className="text-center">
                  {marathon.registration_status === "접수대기" && (
                    <Badge variant="green">접수대기</Badge>
                  )}
                  {marathon.registration_status === "접수중" && (
                    <Badge variant="destructive">접수중</Badge>
                  )}
                  {marathon.registration_status === "접수마감" && (
                    <Badge variant="outline">접수마감</Badge>
                  )}
                  {marathon.registration_status === "추가접수" && (
                    <Badge variant="outline">추가접수</Badge>
                  )}
                </TableCell>
                <TableCell>{formatDate(marathon.event_start_at)}</TableCell>
                <TableCell>
                  {formatDate(marathon.registration_start_at)}
                </TableCell>
                <TableCell className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 font-anyvid bg-gray-100"
                    onClick={() => {
                      setSelectedMarathon(marathon);
                      setIsEditDialogOpen(true);
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
  );
}
