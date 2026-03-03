"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProfileRow } from "@/components/page/page-profile-row";
import {
  Calendar,
  Camera,
  Eye,
  LogOut,
  Mail,
  Pencil,
  Shield,
  Trash2,
  UserIcon,
} from "lucide-react";

export default function PageProfile() {
  return (
    <div className="contact__container">
      <div className="flex flex-col items-center justify-center gap-2 mb-6">
        <button
          type="button"
          className="relative w-20 h-20 rounded-full bg-green-100 flex items-center justify-center overflow-hidden cursor-pointer group"
        >
          <Image
            src="/face/face01.png"
            alt="프로필"
            width={80}
            height={80}
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </button>

        <div className="font-paperlogy text-base md:text-xl text-gray-900 flex items-center gap-2">
          displayName
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 rounded-full p-0 bg-gray-100 hover:bg-gray-200"
          >
            <Pencil />
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-4 mt-4">
        <ProfileRow
          icon={<UserIcon className="w-5 h-5 text-orange-600" />}
          iconBg="bg-orange-50"
          label="이름"
          value="이름"
        />
        <Separator />
        <ProfileRow
          icon={<Mail className="w-5 h-5 text-red-600" />}
          iconBg="bg-red-50"
          label="이메일"
          value="이메일"
          breakAll
        />
        <Separator />
        <ProfileRow
          icon={<Shield className="w-5 h-5 text-green-600" />}
          iconBg="bg-green-50"
          label="역할"
          value="역할"
        />
        <Separator />
        <ProfileRow
          icon={<Calendar className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
          label="가입일"
          value="가입일"
        />
        <Separator />
        <ProfileRow
          icon={<Eye className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-50"
          label="방문횟수"
          value="방문횟수"
        />
        <Separator />

        <div className="md:pt-2 flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            className="text-sm font-normal text-muted-foreground hover:bg-green-50 hover:border-green-600 hover:text-green-700 font-anyvid transition-colors flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-sm font-normal text-muted-foreground hover:bg-red-50 hover:border-red-300 hover:text-red-600 font-anyvid transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            탈퇴하기
          </Button>
        </div>
      </div>
    </div>
  );
}
