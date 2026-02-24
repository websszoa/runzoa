import Link from "next/link";
import Image from "next/image";
import { MARATHON_IMAGE_BASE_URL } from "@/lib/constants";
import { Marathon } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Eye,
  Heart,
  Medal,
  MessageSquareMore,
  BookHeart,
} from "lucide-react";

export default function MarathonListImage({
  marathons,
}: {
  marathons: Marathon[];
}) {
  return (
    <div className="marathon__list__image grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
      {marathons.map((marathon, index) => (
        <Link
          key={marathon.id}
          href={`/marathon/${marathon.slug || marathon.id}`}
          className="block"
        >
          <article className="group relative overflow-hidden rounded-sm border border-slate-100 transition-all duration-500 hover:shadow-xl">
            <div className="relative aspect-4/5 overflow-hidden bg-slate-50">
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500 font-anyvid flex-col gap-2 text-sm">
                <BookHeart className="h-8 w-8" aria-hidden="true" />
                이미지 준비중!
              </div>
              <Image
                src={`${MARATHON_IMAGE_BASE_URL}/cover/${marathon.slug}.jpg`}
                alt={marathon.name || "마라톤 이미지"}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                loading={index === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-103 group-hover:brightness-[0.92]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-70 transition duration-300 group-hover:opacity-0" />

              <div className="absolute right-0 top-0 flex items-center gap-1 px-3 py-3 text-xs text-white transition duration-300 group-hover:translate-y-[-6px] group-hover:opacity-0">
                {(marathon.view_count || 0) > 0 && (
                  <Badge className="flex items-center gap-1 font-paperlogy font-light text-[10px] px-2">
                    <Eye className="w-3 h-3" /> {marathon.view_count}
                  </Badge>
                )}
                {(marathon.comment_count || 0) > 0 && (
                  <Badge className="flex items-center gap-1 font-paperlogy font-light text-[10px] px-2">
                    <MessageSquareMore className="w-3 h-3" />
                    {marathon.comment_count}
                  </Badge>
                )}
                {(marathon.heart_count || 0) > 0 && (
                  <Badge className="flex items-center gap-1 font-paperlogy font-light text-[10px] px-2">
                    <Heart className="w-3 h-3" />
                    {marathon.heart_count}
                  </Badge>
                )}
                {(marathon.favorite_count || 0) > 0 && (
                  <Badge className="flex items-center gap-1 font-paperlogy font-light text-[10px] px-2">
                    <Award className="w-3 h-3" />
                    {marathon.favorite_count}
                  </Badge>
                )}
              </div>

              <div className="absolute inset-x-0 top-0 -translate-y-full px-5 pt-4 pb-8 transition duration-400 ease-out group-hover:translate-y-0">
                <div className="w-10 h-10 mx-auto bg-brand hover:bg-brand/90 flex items-center justify-center rounded-full">
                  <Medal className="h-4 w-4 text-white cursor-pointer" />
                </div>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
