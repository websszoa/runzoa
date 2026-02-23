import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "k.kakaocdn.net",
      },
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
      },
      {
        protocol: "https",
        hostname: "img.imagezoa.com",
      },
      {
        protocol: "https",
        hostname: "ideogram.ai",
      },
      {
        protocol: "https",
        hostname: "websszoa.github.io",
      },
    ],
  },
};

export default nextConfig;
