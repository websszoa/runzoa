import Link from "next/link";
import Image from "next/image";
import { MARATHON_IMAGE_BASE_URL } from "@/lib/constants";
import { Marathon } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Baby,
  Eye,
  Heart,
  Medal,
  MessageSquareMore,
} from "lucide-react";

export default function MarathonListMedal({
  marathons,
}: {
  marathons: Marathon[];
}) {
  const marathonsWithMedal = marathons.filter((marathon) =>
    Boolean(marathon.images?.medal?.[0]),
  );

  if (marathonsWithMedal.length === 0) {
    return (
      <div className="border border-dashed rounded text-center py-24 text-muted-foreground">
        <Baby className="mx-auto mb-3 w-24 h-24" />
        <h3 className="font-paperlogy text-xl mb-1 font-semibold text-gray-700">
          데이터가 없습니다.!
        </h3>
        <p className="font-anyvid text-sm text-muted-foreground">
          현재 준비중입니다.
        </p>
      </div>
    );
  }

  return (
    <div className="marathon__list__medal grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
      {marathonsWithMedal.map((marathon, index) => {
        const medalImage = marathon.images?.medal?.[0] as string;

        const medalImageSrc =
          medalImage.startsWith("http") || medalImage.startsWith("/")
            ? medalImage
            : `${MARATHON_IMAGE_BASE_URL}/${medalImage.replace(/^\//, "")}`;

        return (
          <Link
            key={marathon.id}
            href={`/marathon/${marathon.slug}`}
            className="block"
          >
            <article className="group relative overflow-hidden rounded-sm border border-slate-100 transition-all duration-500 hover:shadow-xl">
              <div className="relative aspect-4/5 overflow-hidden bg-slate-100">
                <Image
                  src={medalImageSrc}
                  alt={`${marathon.name || "마라톤"} 메달 이미지`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  loading={index === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-103 group-hover:brightness-[0.92]"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/25 opacity-70 transition duration-300 group-hover:opacity-0" />

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
        );
      })}
    </div>
  );
}
