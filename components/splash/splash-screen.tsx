"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { APP_ENG_NAME } from "@/lib/constants";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("splash_shown");

    if (!hasVisited) {
      setIsVisible(true);

      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, 1500);

      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem("splash_shown", "true");
      }, 2000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${
        isFading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/icons/favicon.svg"
          alt="webstoryboy"
          width={72}
          height={78}
          style={{ width: "72px", height: "78px" }}
          priority
        />
        <span className="font-paperlogy uppercase font-black text-xl text-brand tracking-widest">
          {APP_ENG_NAME}
        </span>
      </div>
    </div>
  );
}
