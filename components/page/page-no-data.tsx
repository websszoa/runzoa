"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import type { PageNoDataProps } from "@/lib/types";

export default function PageNoData({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonHref,
}: PageNoDataProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 py-10 md:py-16 px-6 text-center">
      <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-gray-700 font-nanumNeo text-xl mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground font-anyvid mb-4">
        {description}
      </p>
      <Button variant="destructive" className="font-anyvid" asChild>
        <Link href={buttonHref}>{buttonText}</Link>
      </Button>
    </div>
  );
}
