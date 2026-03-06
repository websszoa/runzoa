"use client";

import { useEffect, useState } from "react";

export default function BodyFadeIn({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("splash_shown");
    if (hasVisited) {
      // 재방문: 바로 표시
      setVisible(true);
    } else {
      // 첫 방문: 스플래시 페이드 아웃 타이밍에 맞춰 페이드 인
      const timer = setTimeout(() => setVisible(true), 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div
      style={{ transition: "opacity 0.8s ease-in-out" }}
      className={visible ? "opacity-100" : "opacity-0"}
    >
      {children}
    </div>
  );
}
