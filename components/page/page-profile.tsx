"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Profile, Contact } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProfileRow } from "@/components/page/page-profile-row";
import {
  Calendar,
  Camera,
  Eye,
  LogOut,
  Mail,
  Baby,
  Pencil,
  Shield,
  Trash2,
  UserIcon,
} from "lucide-react";

import DialogProfileImage from "@/components/dialog/dialog-profile-image";
import DialogProfileName from "@/components/dialog/dialog-profile-name";
import DialogProfileDelete from "@/components/dialog/dialog-profile-delete";

const statusConfig: Record<
  Contact["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "접수",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  progress: {
    label: "처리중",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  resolved: {
    label: "완료",
    className: "bg-green-50 text-green-700 border border-green-200",
  },
  closed: {
    label: "종료",
    className: "bg-gray-50 text-gray-500 border border-gray-200",
  },
};

interface PageProfileProps {
  profile: Profile | null;
  contacts: Contact[];
}

export default function PageProfile({ profile, contacts }: PageProfileProps) {
  const router = useRouter();
  const name = profile?.full_name ?? "-";
  const email = profile?.email ?? "-";
  const role = profile?.role === "admin" ? "관리자" : "일반회원";
  const createdAt = formatDate(profile?.created_at);
  const visitCount = profile?.visit_count ?? 0;
  const avatarUrl = profile?.avatar_url || "/face/face01.png";

  const [avatar, setAvatar] = useState(avatarUrl);
  const [displayName, setDisplayName] = useState(name);

  const [profileImageOpen, setProfileImageOpen] = useState(false);
  const [profileNameOpen, setProfileNameOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("로그아웃 되었습니다.");
    router.refresh();
    router.push("/");
  };

  return (
    <div className="rounded-lg border border-dashed border-gray-200 p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        {/* 왼쪽: 프로필 정보 */}
        <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center gap-2 mb-6">
            <button
              type="button"
              onClick={() => setProfileImageOpen(true)}
              className="relative w-20 h-20 rounded-full bg-green-100 flex items-center justify-center overflow-hidden cursor-pointer group"
            >
              <Image
                src={avatar}
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
              {displayName}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 rounded-full p-0 bg-gray-100 hover:bg-gray-200"
                onClick={() => setProfileNameOpen(true)}
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
              value={displayName}
            />
            <Separator />
            <ProfileRow
              icon={<Mail className="w-5 h-5 text-red-600" />}
              iconBg="bg-red-50"
              label="이메일"
              value={email}
              breakAll
            />
            <Separator />
            <ProfileRow
              icon={<Shield className="w-5 h-5 text-green-600" />}
              iconBg="bg-green-50"
              label="역할"
              value={role}
            />
            <Separator />
            <ProfileRow
              icon={<Calendar className="w-5 h-5 text-blue-600" />}
              iconBg="bg-blue-50"
              label="가입일"
              value={createdAt}
            />
            <Separator />
            <ProfileRow
              icon={<Eye className="w-5 h-5 text-purple-600" />}
              iconBg="bg-purple-50"
              label="방문횟수"
              value={`${visitCount}회`}
            />
            <Separator />

            <div className="md:pt-2 flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                className="text-sm font-normal text-muted-foreground hover:bg-green-50 hover:border-green-600 hover:text-green-700 font-anyvid transition-colors flex items-center gap-1"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-sm font-normal text-muted-foreground hover:bg-red-50 hover:border-red-300 hover:text-red-600 font-anyvid transition-colors flex items-center gap-1"
                onClick={() => setDeleteAccountOpen(true)}
              >
                <Trash2 className="w-4 h-4" />
                탈퇴하기
              </Button>
            </div>
          </div>
        </div>

        {/* 오른쪽: 내 문의사항 */}
        <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
          {contacts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 py-6 px-6 text-center">
              <Baby className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-700 font-nanumNeo mb-1">문의하기</h3>
              <p className="text-sm text-muted-foreground font-anyvid mb-4">
                문의하기를 통해 남겨주신 문의 내용이 이곳에 표시됩니다.
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-paperlogy mb-2">내 문의사항</h3>
              <div className="space-y-3 overflow-y-auto max-h-[480px] pr-1">
                {contacts.map((contact) => {
                  const status = statusConfig[contact.status];
                  return (
                    <div
                      key={contact.id}
                      className="rounded-lg border border-gray-200 px-4 py-3 hover:shadow-sm transition-all duration-200 hover:border-brand/50"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-anyvid shrink-0 ${status.className}`}
                        >
                          {status.label}
                        </span>
                        <span className="text-xs text-muted-foreground font-anyvid">
                          {formatDate(contact.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 font-anyvid line-clamp-2 leading-relaxed">
                        {contact.message}
                      </p>
                      {contact.admin_reply && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-sm text-muted-foreground font-anyvid leading-relaxed">
                            <span className="text-brand font-medium mr-1">
                              답변:
                            </span>
                            {contact.admin_reply}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <DialogProfileImage
        open={profileImageOpen}
        onOpenChange={setProfileImageOpen}
        currentImage={avatar}
        onUpdated={setAvatar}
      />
      <DialogProfileName
        open={profileNameOpen}
        onOpenChange={setProfileNameOpen}
        currentName={displayName}
        onUpdated={setDisplayName}
      />
      <DialogProfileDelete
        open={deleteAccountOpen}
        onOpenChange={setDeleteAccountOpen}
      />
    </div>
  );
}
