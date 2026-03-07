"use client";

import Link from "next/link";
import { Marathon } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatDateWithWeekday,
  getMarathonEngagementMessage,
  formatRegistrationDistances,
  formatRegistrationPriceRange,
  getDaysUntilRegistration,
} from "@/lib/utils";
import {
  Building2,
  Calendar,
  ChartNoAxesCombined,
  CircleDollarSign,
  Eye,
  MapPin,
  UsersRound,
} from "lucide-react";

import MarathonImage from "@/components/marathon/marathon-image";
import MarathonBtnFavorite from "@/components/marathon/marathon-btn-favorite";
import MarathonBtnShare from "@/components/marathon/marathon-btn-share";
import MarathonBtnLike from "@/components/marathon/marathon-btn-like";
import MarathonBtnAlert from "@/components/marathon/marathon-btn-alert";
import MarathonBtnComments from "@/components/marathon/marathon-btn-comments";

export default function MarathonListCard({
  marathons,
}: {
  marathons: Marathon[];
}) {
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
                <CardTitle className="flex flex-col gap-2 font-paperlogy font-semibold text-slate-900 text-lg md:text-2xl">
                  <Link
                    href={`/marathon/${marathon.slug}`}
                    className="flex-8 min-w-0 truncate text-left"
                  >
                    {marathon.name || "-"}
                  </Link>
                  <div className="flex items-center gap-1">
                    {marathon.registration_status === "접수대기" && (
                      <>
                        <Badge variant="red">접수대기</Badge>
                        <Badge className="rounded-full text-xs font-anyvid border border-red-500 bg-white text-red-500">
                          {(() => {
                            const days = getDaysUntilRegistration(
                              marathon.registration_start_at,
                            );
                            if (days === null) return "접수 예정";
                            if (days === 0) return "오늘 접수 시작!";
                            return `접수까지 ${days}일 남았습니다`;
                          })()}
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
                  <MarathonImage
                    src={marathon.images?.cover?.[0]}
                    name={marathon.name || ""}
                    index={index}
                    slug={marathon.slug}
                  />
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
                    {marathon.event_scale != null &&
                      marathon.event_scale > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <UsersRound className="h-4 w-4 shrink-0 text-rose-500" />
                          <span className="truncate font-anyvid">
                            {marathon.event_scale}명
                          </span>
                        </div>
                      )}
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
                  <MarathonBtnShare
                    marathonId={marathon.id}
                    slug={marathon.slug}
                  />
                  <MarathonBtnFavorite marathonId={marathon.id} />
                  <MarathonBtnLike marathonId={marathon.id} />
                  <MarathonBtnAlert
                    marathonId={marathon.id}
                    slug={marathon.slug}
                    name={marathon.name || ""}
                    description={marathon.description || ""}
                    eventStartAt={marathon.event_start_at}
                    registrationStartAt={marathon.registration_start_at}
                    registrationPrice={marathon.registration_price}
                    location={marathon.location}
                  />
                  <MarathonBtnComments slug={marathon.slug} />

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
