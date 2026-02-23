import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Cable, Gamepad2, Helicopter } from "lucide-react";

export default async function AdminDashboardPage() {
  return (
    <div className="md:p-6 md:space-y-6 p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold font-paperlogy flex items-center gap-2">
          대시보드
        </h1>
        <p className="text-sm text-muted-foreground font-anyvid mt-1">
          회원, 문의사항, 마라톤 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 회원 */}
        <Card className="border rounded-lg overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-paperlogy text-muted-foreground">
                회원
              </span>
              <Cable className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold font-paperlogy text-brand">
                0
              </span>
              <span className="text-sm text-muted-foreground font-anyvid">
                전체
              </span>
            </div>
            <div className="text-sm text-muted-foreground font-anyvid">
              활성 회원 <span className="font-medium text-foreground">0</span>명
            </div>
            <Button
              variant="outline"
              size="lg"
              className="w-full font-anyvid"
              asChild
            >
              <Link href="/admin/member">회원 관리 →</Link>
            </Button>
          </CardContent>
        </Card>

        {/* 문의사항 */}
        <Card className="border rounded-lg overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-paperlogy text-muted-foreground">
                문의사항
              </span>
              <Gamepad2 className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold font-paperlogy text-brand">
                0
              </span>
              <span className="text-sm text-muted-foreground font-anyvid">
                전체
              </span>
            </div>
            <div className="text-sm text-muted-foreground font-anyvid">
              대기 중 <span className="font-medium text-yellow-600">0</span>건
            </div>
            <Button
              variant="outline"
              size="lg"
              className="w-full font-anyvid"
              asChild
            >
              <Link href="/admin/contact">문의 관리 →</Link>
            </Button>
          </CardContent>
        </Card>

        {/* 마라톤 */}
        <Card className="border rounded-lg overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-paperlogy text-muted-foreground">
                마라톤
              </span>
              <Helicopter className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold font-paperlogy text-brand">
                0
              </span>
              <span className="text-sm text-muted-foreground font-anyvid">
                전체
              </span>
            </div>
            <div className="text-sm text-muted-foreground font-anyvid">
              지역 수 <span className="font-medium text-foreground">0</span>곳
            </div>
            <Button
              variant="outline"
              size="lg"
              className="w-full font-anyvid"
              asChild
            >
              <Link href="/admin/marathon">마라톤 데이터 →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
