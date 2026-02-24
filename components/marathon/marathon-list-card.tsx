"use client";

import Link from "next/link";
import Image from "next/image";
import { Marathon } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatDateWithWeekday,
  formatRegistrationDday,
  getMarathonEngagementMessage,
  formatRegistrationDistances,
  formatRegistrationPriceRange,
  shareMarathonLink,
} from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bell,
  Building2,
  Bookmark,
  Calendar,
  ChartNoAxesCombined,
  CircleDollarSign,
  Eye,
  Heart,
  MapPin,
  Medal,
  Share2,
  UsersRound,
} from "lucide-react";

export default function MarathonListCard({
  marathons,
}: {
  marathons: Marathon[];
}) {
  const supabase = createClient();

  const logEngagement = (
    marathonId: string,
    actionType: "share" | "favorite" | "heart" | "alert",
  ) => {
    supabase
      .from("marathon_engagement_log")
      .insert({ marathon_id: marathonId, action_type: actionType });
  };

  const handleShareSuccess = (marathonId: string) => {
    logEngagement(marathonId, "share");
  };

  return (
    <div className="marathon__list__card">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {marathons.map((marathon, index) => {
          return (
            <Card
              key={marathon.id}
              className="flex gap-2 h-full flex-col justify-between border-slate-200/80 bg-white/90 py-4 transition-all hover:-translate-y-0.5 hover:shadow-lg md:py-6"
            >
              <CardHeader className="px-4 md:px-6">
                <CardTitle className="flex min-w-0 flex-col gap-2 overflow-hidden font-paperlogy font-semibold text-slate-900 text-lg md:text-2xl">
                  <Link
                    href={`/marathon/${marathon.slug}`}
                    className="block min-w-0 truncate text-left"
                  >
                    <span className="block truncate">
                      {marathon.name || "-"}
                    </span>
                  </Link>
                  <div className="flex items-center gap-1">
                    {marathon.registration_status === "접수대기" && (
                      <>
                        <Badge variant="red">접수대기</Badge>
                        <Badge className="rounded-full text-xs font-anyvid border border-red-500 bg-white text-red-500">
                          {formatRegistrationDday(
                            marathon.registration_start_at,
                          )}
                        </Badge>
                      </>
                    )}
                    {marathon.registration_status === "접수중" && (
                      <>
                        <Badge variant="destructive">접수중</Badge>
                        <Badge className="rounded-full text-xs font-anyvid border border-red-500 bg-white text-red-500">
                          현재 접수하고 있어요!!👌🏻
                        </Badge>
                      </>
                    )}
                    {marathon.registration_status === "접수마감" && (
                      <Badge variant="black">접수마감</Badge>
                    )}
                    {marathon.registration_status === "추가접수" && (
                      <Badge variant="outline">추가접수</Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex h-full flex-col gap-4 px-4 md:px-6">
                <div className="flex gap-3">
                  <div className="relative flex h-[160px] w-[120px] overflow-hidden rounded shrink-0 bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <Medal className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <Image
                      src={
                        marathon.images?.cover?.[0]
                          ? `/marathon/cover/${marathon.images.cover[0]}`
                          : ""
                      }
                      alt={marathon.name || "대회 이미지"}
                      fill
                      sizes="120px"
                      loading={index === 0 ? "eager" : "lazy"}
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 shrink-0 text-blue-500" />
                      <span className="truncate font-anyvid">
                        {formatDateWithWeekday(marathon.event_start_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 text-pink-500" />
                      <span className="truncate font-anyvid">
                        {marathon.location?.region}, {marathon.location?.place}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UsersRound className="h-4 w-4 shrink-0 text-rose-500" />
                      <span className="truncate font-anyvid">
                        {marathon.event_scale
                          ? `${marathon.event_scale}명`
                          : "미정"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ChartNoAxesCombined className="h-4 w-4 shrink-0 text-amber-500" />
                      <span className="truncate font-anyvid">
                        {formatRegistrationDistances(
                          marathon.registration_price,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4 shrink-0 text-indigo-500" />
                      <span className="truncate font-anyvid">
                        {marathon.hosts?.organizer || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CircleDollarSign className="h-4 w-4 shrink-0 text-green-500" />
                      <span className="truncate font-anyvid">
                        {formatRegistrationPriceRange(
                          marathon.registration_price,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-wrap items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 shrink-0 border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        aria-label="공유하기"
                        onClick={() =>
                          shareMarathonLink(marathon, handleShareSuccess)
                        }
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-nanumNeo">공유하기</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 shrink-0 border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        aria-label="즐겨찾기"
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-nanumNeo">즐겨찾기</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 shrink-0 border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        aria-label="좋아요"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-nanumNeo">좋아요</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 shrink-0 border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        aria-label="알림설정"
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-nanumNeo">알림 설정</p>
                    </TooltipContent>
                  </Tooltip>
                  <Button
                    variant="outline"
                    className="group min-w-0 flex-1 text-muted-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    asChild
                  >
                    <Link
                      href={`/marathon/${marathon.slug}`}
                      className="flex w-full min-w-0 items-center justify-center"
                    >
                      <span className="block truncate group-hover:hidden">
                        {getMarathonEngagementMessage(
                          marathon.view_count,
                          marathon.id,
                        )}
                      </span>
                      <span className="hidden min-w-0 items-center gap-1 truncate group-hover:inline-flex">
                        <Eye className="h-4 w-4" />
                        자세히 보기
                      </span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
