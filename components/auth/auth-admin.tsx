"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import AdminAccessDenied from "@/components/admin/admin-access-denied";

interface AuthAdminProps {
  children: React.ReactNode;
}

const ADMIN_AUTH_KEY = "admin_authenticated";

export default function AuthAdmin({ children }: AuthAdminProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      const supabase = createClient();

      // 로그인 상태 확인
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      // profiles 테이블에서 role 확인
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        setIsAdmin(true);
        // 세션 스토리지에서 인증 상태 확인
        const authStatus = sessionStorage.getItem(ADMIN_AUTH_KEY);
        setIsAuthenticated(authStatus === "true");
      } else {
        setIsAdmin(false);
      }

      setIsLoading(false);
    };

    checkAdminRole();
  }, []);

  const handleLoginSuccess = () => {
    sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  // 관리자가 아니면 접근 거부
  if (!isAdmin) {
    return <AdminAccessDenied />;
  }

  // 관리자이지만 비밀번호 인증 안 됨
  if (!isAuthenticated) {
    return <AdminLoginForm onSuccess={handleLoginSuccess} />;
  }

  return <>{children}</>;
}
