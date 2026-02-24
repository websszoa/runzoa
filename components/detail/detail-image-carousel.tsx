"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Medal } from "lucide-react";
import type { Marathon } from "@/lib/types";
import { MARATHON_IMAGE_BASE_URL } from "@/lib/constants";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function ImageItem({ marathon }: { marathon: Marathon }) {
  const coverSrc = marathon.slug
    ? `${MARATHON_IMAGE_BASE_URL}/cover/${marathon.slug}.jpg`
    : `${MARATHON_IMAGE_BASE_URL}/no-image.jpg`;

  return (
    <Link href={`/marathon/${marathon.slug ?? marathon.id}`} className="block">
      <article className="group relative overflow-hidden rounded-sm border border-slate-100 transition-all duration-500 hover:shadow-xl">
        <div className="relative aspect-4/5 overflow-hidden bg-slate-100">
          <img
            src={coverSrc}
            alt={marathon.name ?? "마라톤"}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-103 group-hover:brightness-[0.92]"
          />
          <div className="pointer-events-none absolute inset-0 bg-black/25 opacity-70 transition duration-300 group-hover:opacity-0" />

          <div className="absolute inset-x-0 top-0 -translate-y-full px-5 pt-4 pb-8 transition duration-400 ease-out group-hover:translate-y-0">
            <div className="w-10 h-10 mx-auto bg-brand hover:bg-brand/90 flex items-center justify-center rounded-full">
              <Medal className="h-4 w-4 text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

type DetailImageCarouselProps = {
  marathons: Marathon[];
  /** 제목 영역 (더 보기). 버튼은 이 제목 오른쪽 끝에 배치됨 */
  title?: ReactNode;
};

export default function DetailImageCarousel({
  marathons,
  title,
}: DetailImageCarouselProps) {
  return (
    <Carousel
      opts={{ slidesToScroll: 1, align: "start" }}
      className="relative w-full"
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="min-w-0">{title}</div>
        <div className="flex shrink-0 gap-1 mt-[-10px]">
          <CarouselPrevious className="static translate-y-0 size-8" />
          <CarouselNext className="static translate-y-0 size-8" />
        </div>
      </div>
      <CarouselContent className="-ml-1 md:-ml-2">
        {marathons.map((marathon) => (
          <CarouselItem
            key={marathon.id}
            className="pl-1 md:pl-2 basis-1/2 sm:basis-1/3 md:basis-1/4"
          >
            <ImageItem marathon={marathon} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
