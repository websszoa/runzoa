import type { MetadataRoute } from "next";
import { APP_SITE_URL } from "@/lib/constants";
import { getAllNewsPosts } from "@/lib/news";

const staticRoutes = [
  "",
  "/news",
  "/intro",
  "/contact",
  "/terms",
  "/privacy",
  "/notice",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${APP_SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/news" ? 0.9 : 0.7,
  }));

  const newsUrls: MetadataRoute.Sitemap = getAllNewsPosts().map((post) => ({
    url: `${APP_SITE_URL}/news/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticUrls, ...newsUrls];
}
