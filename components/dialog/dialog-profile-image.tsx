"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { APP_ENG_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { SquarePen, TentTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FACE_IMAGES = [
  "/face/face01.png",
  "/face/face02.png",
  "/face/face03.png",
  "/face/face04.png",
  "/face/face05.png",
  "/face/face06.png",
  "/face/face07.png",
  "/face/face08.png",
  "/face/face09.png",
  "/face/face10.png",
];

interface DialogProfileImageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentImage?: string | null;

  // ✅ 추가: 변경 성공 시 부모 UI 즉시 갱신
  onUpdated?: (newUrl: string) => void;
}

export default function DialogProfileImage({
  open,
  onOpenChange,
  currentImage,
  onUpdated,
}: DialogProfileImageProps) {
  const supabase = createClient();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 다이얼로그 열 때 현재 이미지가 기본 선택되게 (UX)
  useEffect(() => {
    if (open) setSelectedImage(currentImage ?? null);
  }, [open, currentImage]);

  const handleImageChange = async () => {
    if (!selectedImage) {
      toast.error("이미지를 선택해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("로그인이 필요합니다.");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: selectedImage })
        .eq("id", user.id);

      if (error) throw error;

      // ✅ 여기서 부모에 바로 알려서 깜박임 없이 UI만 바꿈
      onUpdated?.(selectedImage);

      toast.success("프로필 이미지가 변경되었습니다.");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("이미지 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 font-paperlogy font-extrabold uppercase text-brand text-xl">
                <TentTree className="size-9" />
                {APP_ENG_NAME}
              </div>
            </div>

            <DialogTitle className="text-xl mt-2 font-nanumNeo">
              이미지를 변경할 수 있습니다.
            </DialogTitle>
          </div>

          <DialogDescription className="text-sm text-center font-nanumNeo break-keep">
            원하는 이미지를 선택해주세요.
          </DialogDescription>
        </DialogHeader>

        {/* 이미지 목록 */}
        <div className="grid grid-cols-5 gap-2 py-4">
          {FACE_IMAGES.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={cn(
                "relative aspect-square rounded-full overflow-hidden border-2 transition-all",
                selectedImage === image
                  ? "border-brand ring-2 ring-brand/30"
                  : currentImage === image
                    ? "border-gray-300"
                    : "hover:border-brand",
              )}
            >
              <Image
                src={image}
                alt="프로필 이미지"
                fill
                sizes="(max-width: 384px) 20vw, 76px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* 하단 변경하기 버튼 */}
        <Button
          type="button"
          className="w-full bg-brand hover:bg-brand/90 font-nanumNeo"
          onClick={handleImageChange}
          disabled={isLoading || !selectedImage}
        >
          <SquarePen />
          {isLoading ? "변경 중..." : "변경하기"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
