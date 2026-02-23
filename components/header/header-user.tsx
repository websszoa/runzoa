"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HeaderUser() {
  const profile = null;

  return (
    <div className="p-4 border-b border-brand/5 bg-brand/5 mt-[-16px]">
      <div className="text-center py-2">
        <div className="flex justify-center mb-2">
          <Avatar className="w-16 h-16 border-2 border-brand/10">
            <AvatarImage
              src="/face/face01.png"
              alt="프로필"
              referrerPolicy="no-referrer"
              className="bg-brand/10"
            />
            <AvatarFallback className="bg-brand/10 text-brand text-3xl font-paperlogy pt-1">
              R
            </AvatarFallback>
          </Avatar>
        </div>
        <h3 className="font-paperlogy font-normal text-lg text-gray-900 mb-1">
          환영합니다영합니다!
        </h3>
        <p className="font-nanumNeo text-sm text-muted-foreground truncate mb-2">
          로그인하여 더 많은 기능을 사용해보세요.
        </p>
      </div>
    </div>
  );
}
