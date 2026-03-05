import { createClient } from "@/lib/supabase/server";
import PageLogin from "@/components/page/page-login";

interface AuthLoginProps {
  children: React.ReactNode;
}

// 인증이 필요한 페이지를 감싸는 컴포넌트
export default async function AuthLogin({ children }: AuthLoginProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <PageLogin />;
  }

  return <>{children}</>;
}
