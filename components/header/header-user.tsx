"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Profile } from "@/lib/types";

interface HeaderUserProps {
  userId?: string;
}

export default function HeaderUser({ userId }: HeaderUserProps) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }

    const supabase = createClient();

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      setProfile(data);
    };

    fetchProfile();
  }, [userId]);

  return (
    <div className="p-4 border-b border-brand/5 bg-brand/5 mt-[-16px]">
      <div className="text-center py-2">
        <div className="flex justify-center mb-2">
          <Avatar className="w-16 h-16 border-2 border-brand/10">
            {profile?.avatar_url ? (
              <AvatarImage
                src={profile.avatar_url}
                alt={profile.full_name ?? "프로필"}
                referrerPolicy="no-referrer"
                className="bg-brand/10"
              />
            ) : null}
            <AvatarFallback className="bg-brand/10 text-brand text-3xl font-paperlogy pt-1">
              {(
                profile?.full_name?.charAt(0) ??
                profile?.email?.charAt(0) ??
                "R"
              ).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <h3 className="font-paperlogy font-normal text-lg text-gray-900 mb-1">
          {profile?.full_name
            ? `${profile.full_name}님, 환영합니다!`
            : "환영합니다!"}
        </h3>
        <p className="font-nanumNeo text-sm text-muted-foreground truncate mb-2">
          {profile?.email || "로그인하여 더 많은 기능을 사용해보세요."}
        </p>
      </div>
    </div>
  );
}
