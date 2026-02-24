"use client";

import { useState } from "react";
import Image from "next/image";
import { Castle } from "lucide-react";
import type { Marathon } from "@/lib/types";

type DetailOrganizerProps = {
  marathon: Marathon;
};

export default function DetailOrganizer({ marathon }: DetailOrganizerProps) {
  const [imageError, setImageError] = useState(false);

  if (!marathon.hosts) {
    return null;
  }

  const coverFile = marathon.images?.cover?.[0];
  const showCover = !!coverFile && !imageError;

  return (
    <div className="detail__block">
      <h3>
        <Castle className="w-5 h-5 text-brand" /> 주최
      </h3>
      <div>
        {/* 이미지: images.cover[0] → public/marathon/cover/ */}
        {showCover && coverFile && (
          <div className="w-full rounded-sm overflow-hidden mb-4">
            <Image
              src={`/marathon/cover/${coverFile}`}
              alt={marathon.name}
              width={600}
              height={400}
              loading="eager"
              className="w-full h-auto"
              onError={() => setImageError(true)}
            />
          </div>
        )}
        {/* 주최 */}
        <div className="space-y-3">
          {marathon.hosts.organizer && (
            <div>
              <p className="text-xs text-gray-500 mb-1">주최</p>
              <p className="text-sm text-gray-900">
                {marathon.hosts.organizer}
              </p>
            </div>
          )}
          {marathon.hosts.manage && (
            <div>
              <p className="text-xs text-gray-500 mb-1">주관</p>
              <p className="text-sm text-muted-foreground">
                {marathon.hosts.manage}
              </p>
            </div>
          )}
          {marathon.hosts.sponsor && (
            <div>
              <p className="text-xs text-gray-500 mb-1">후원</p>
              <p className="text-sm text-muted-foreground">
                {marathon.hosts.sponsor}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
