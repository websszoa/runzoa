"use client";

import Link from "next/link";
import { Marathon } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ButtonShare from "./button-share";
import ButtonFavorite from "./button-favorite";
import ButtonHeart from "./button-heart";
import ButtonAlert from "./button-alert";
import {
  formatMonthDayAndWeekday,
  formatRegistrationDistances,
  formatRegistrationPriceRange,
  getMarathonEngagementMessage,
} from "@/lib/utils";
import {
  ChartNoAxesCombined,
  CircleDollarSign,
  Eye,
  MapPin,
  MessageSquareMore,
  UsersRound,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function MarathonListDate({
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
    <div className="marathon__list__date">
      {marathons.map((marathon) => {
        return (
          <div
            key={marathon.id}
            className="w-full flex flex-row items-center rounded border border-gray-200 p-3 gap-2 sm:gap-5 mb-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-200/50 max-[900px]:flex-wrap max-[900px]:items-start max-md:flex-col"
          >
            {/* 대회일 */}
            <div className="w-[160px] shrink-0 py-2 sm:py-3 rounded border border-gray-200 flex flex-col items-center justify-center max-md:w-full max-md:flex-row max-md:items-center max-md:justify-between max-md:px-3">
              <span
                className="font-paperlogy font-semibold text-xl sm:text-2xl pb-0 sm:pb-1 max-md:pb-0"
                suppressHydrationWarning
              >
                {formatMonthDayAndWeekday(marathon.event_start_at).monthDay}
                {formatMonthDayAndWeekday(marathon.event_start_at).weekday && (
                  <span className="text-sm px-1">
                    ({formatMonthDayAndWeekday(marathon.event_start_at).weekday}
                    )
                  </span>
                )}
              </span>
              <div className="flex items-center justify-center gap-1 max-md:justify-end">
                {marathon.registration_status === "접수대기" && (
                  <Badge variant="green">접수대기</Badge>
                )}
                {marathon.registration_status === "접수중" && (
                  <Badge variant="destructive">접수중</Badge>
                )}
                {marathon.registration_status === "접수마감" && (
                  <Badge variant="black">접수마감</Badge>
                )}
                {marathon.registration_status === "추가접수" && (
                  <Badge variant="outline">추가접수</Badge>
                )}
              </div>
            </div>

            {/* 대회명 */}
            <div className="min-w-0 flex-1 space-y-1 max-md:w-full max-md:text-center">
              <h3 className="font-paperlogy font-semibold text-slate-900 text-xl max-md:text-center">
                {marathon.name}
              </h3>
              <div className="flex gap-2 max-md:w-full max-md:flex-col max-md:items-center">
                <div className="space-y-1 min-w-[230px] max-md:w-full max-md:min-w-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground max-md:justify-center">
                    <MapPin className="h-4 w-4 shrink-0 text-pink-500" />
                    <span className="truncate font-anyvid">
                      {marathon.location?.region}, {marathon.location?.place}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground max-md:justify-center">
                    <ChartNoAxesCombined className="h-4 w-4 shrink-0 text-amber-500" />
                    <span
                      className="truncate font-anyvid"
                      suppressHydrationWarning
                    >
                      {formatRegistrationDistances(marathon.registration_price)}
                    </span>
                  </div>
                </div>
                <div className="hidden space-y-1 md:block">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UsersRound className="h-4 w-4 shrink-0 text-rose-500" />
                    <span
                      className="truncate font-anyvid"
                      suppressHydrationWarning
                    >
                      {marathon.event_scale}명
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CircleDollarSign className="h-4 w-4 shrink-0 text-green-500" />
                    <span
                      className="truncate font-anyvid"
                      suppressHydrationWarning
                    >
                      {formatRegistrationPriceRange(
                        marathon.registration_price,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="w-[212px] shrink-0 text-center max-[900px]:basis-full max-md:w-full max-md:flex max-md:justify-center mt-2 sm:mt-0">
              <div className="max-[900px]:w-[212px] max-[900px]:mx-auto">
                <div className="flex justify-between gap-2 mb-2">
                  <ButtonShare
                    marathon={marathon}
                    onShareSuccess={handleShareSuccess}
                    className="h-9 w-9 shrink-0 border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  />
                  <ButtonFavorite
                    marathonId={marathon.id}
                    className="h-9 w-9 shrink-0 border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  />
                  <ButtonHeart
                    marathonId={marathon.id}
                    className="h-9 w-9 shrink-0 border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 shrink-0 border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        aria-label="댓글"
                      >
                        <MessageSquareMore className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-nanumNeo">댓글</p>
                    </TooltipContent>
                  </Tooltip>
                  <ButtonAlert
                    marathon={marathon}
                    className="h-9 w-9 shrink-0 border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
                  />
                </div>
                <div>
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
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
