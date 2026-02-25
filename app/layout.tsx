import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SheetProvider } from "@/contexts/sheet-context";
import { LoginProvider } from "@/contexts/login-context";
import {
  APP_DESCRIPTION,
  APP_KEYWORDS,
  APP_NAME,
  APP_SITE_URL,
  APP_SLOGAN,
} from "@/lib/constants";

import AuthToast from "@/components/auth/auth-toast";
import NaverCalendarToast from "@/components/auth/naver-calendar-toast";
import SplashScreen from "@/components/splash/splash-screen";

const anyvid = localFont({
  variable: "--font-anyvid",
  display: "swap",
  preload: true,
  src: [
    { path: "../public/fonts/anyvid.woff", weight: "400", style: "normal" },
  ],
});

const nanumSquare = localFont({
  variable: "--font-nanumNeo",
  display: "swap",
  preload: false,
  src: [
    {
      path: "../public/fonts/NanumSquareNeo-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

const paperlogy = localFont({
  variable: "--font-paperlogy",
  display: "swap",
  preload: false,
  src: [
    {
      path: "../public/fonts/Paperlogy-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Paperlogy-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Paperlogy-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: `${APP_NAME} | ${APP_SLOGAN}`,
  },
  description: APP_DESCRIPTION,
  keywords: APP_KEYWORDS,
  authors: [{ name: "webstoryboy", url: "https://webstoryboy.com" }],
  metadataBase: new URL(APP_SITE_URL),
  alternates: { canonical: APP_SITE_URL },
  icons: {
    icon: [
      { url: "/icons/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon96.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon96.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon96.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: APP_SITE_URL,
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [
      {
        url: `${APP_SITE_URL}/runzoa.webp`,
        width: 1200,
        height: 800,
        alt: `${APP_NAME}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@runzoa",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [`${APP_SITE_URL}/runzoa.webp`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${anyvid.variable} ${nanumSquare.variable} ${paperlogy.variable}`}
      >
        <LoginProvider>
          <SheetProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                classNames: {
                  title: "font-anyvid",
                  description: "font-anyvid",
                },
              }}
            />
            <Suspense fallback={null}>
              <AuthToast />
              <NaverCalendarToast />
            </Suspense>
            <TooltipProvider>
              <SplashScreen />
              {children}
            </TooltipProvider>
          </SheetProvider>
        </LoginProvider>
      </body>
    </html>
  );
}
