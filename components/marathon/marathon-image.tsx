"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MARATHON_IMAGE_BASE_URL } from "@/lib/constants";
import { Medal } from "lucide-react";

export default function MarathonImage({
  src,
  name,
  index,
  slug,
}: {
  src: string | null | undefined;
  name: string;
  index: number;
  slug: string;
}) {
  const [hasError, setHasError] = useState(false);
  const normalizedSrc = src
    ? src.startsWith("http") || src.startsWith("/")
      ? src
      : `${MARATHON_IMAGE_BASE_URL}/${src.replace(/^\//, "")}`
    : null;

  return (
    <Link
      href={`/marathon/${slug}`}
      className="relative flex h-[160px] w-[120px] overflow-hidden rounded shrink-0 bg-gray-100"
    >
      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        <Medal className="h-6 w-6" aria-hidden="true" />
      </div>
      {normalizedSrc && !hasError && (
        <Image
          src={normalizedSrc}
          alt={name || "대회 이미지"}
          fill
          sizes="120px"
          priority={index < 2}
          className="object-cover"
          onError={() => setHasError(true)}
        />
      )}
    </Link>
  );
}
