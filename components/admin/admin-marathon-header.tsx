"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { Marathon } from "@/lib/types";

import DialogMarathonAdd from "@/components/dialog/dialog-marathon-add";

type AdminMarathonHeaderProps = {
  onMarathonAdded: (addedMarathon: Marathon) => void;
};

export default function AdminMarathonHeader({
  onMarathonAdded,
}: AdminMarathonHeaderProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold font-paperlogy flex items-center gap-2">
            마라톤
          </h2>
          <p className="text-sm text-muted-foreground font-anyvid mt-1">
            전체 회원 목록을 확인하고 관리할 수 있습니다.
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={() => setIsAddDialogOpen(true)}
          className="font-anyvid"
        >
          <CirclePlus />
          마라톤 추가
        </Button>
      </div>

      <DialogMarathonAdd
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onMarathonAdded={onMarathonAdded}
      />
    </>
  );
}
