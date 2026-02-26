import "server-only";

import fs from "node:fs";
import path from "node:path";

export interface NewsPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
  source: string;
  tags: string[];
}

export interface NewsPost extends NewsPostMeta {
  content: string;
}

const NEWS_CONTENT_DIR = path.join(process.cwd(), "content/news");

function splitFrontmatter(raw: string): { frontmatter: string; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: "", content: raw.trim() };
  return { frontmatter: match[1], content: match[2].trim() };
}

function parseValue(value: string): string | string[] {
  const trimmed = value.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const body = trimmed.slice(1, -1).trim();
    if (!body) return [];
    return body
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }
  return trimmed.replace(/^["']|["']$/g, "");
}

function parseFrontmatter(frontmatter: string): Record<string, string | string[]> {
  const parsed: Record<string, string | string[]> = {};
  for (const line of frontmatter.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1);
    parsed[key] = parseValue(value);
  }
  return parsed;
}

function toNewsMeta(slug: string, raw: string): NewsPostMeta | null {
  const { frontmatter, content } = splitFrontmatter(raw);
  const meta = parseFrontmatter(frontmatter);

  const title = typeof meta.title === "string" ? meta.title : "";
  if (!title) return null;

  const description =
    typeof meta.description === "string" && meta.description
      ? meta.description
      : content.split("\n").find((line) => line.trim() && !line.startsWith("#")) ??
        "마라톤 소식";

  const tags = Array.isArray(meta.tags) ? meta.tags : [];

  return {
    slug,
    title,
    description,
    date: typeof meta.date === "string" ? meta.date : "",
    category: typeof meta.category === "string" ? meta.category : "소식",
    image:
      typeof meta.image === "string" && meta.image
        ? meta.image
        : "/marathon/cover/no-image.jpg",
    source: typeof meta.source === "string" ? meta.source : "RUNZOA 편집팀",
    tags,
  };
}

function getNewsFiles(): string[] {
  if (!fs.existsSync(NEWS_CONTENT_DIR)) return [];
  return fs
    .readdirSync(NEWS_CONTENT_DIR)
    .filter((name) => name.endsWith(".mdx"))
    .sort((a, b) => a.localeCompare(b));
}

export function getAllNewsPosts(): NewsPostMeta[] {
  const posts = getNewsFiles()
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const fullPath = path.join(NEWS_CONTENT_DIR, filename);
      const raw = fs.readFileSync(fullPath, "utf8");
      return toNewsMeta(slug, raw);
    })
    .filter((post): post is NewsPostMeta => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date));

  return posts;
}

export function getNewsPostBySlug(slug: string): NewsPost | null {
  const fullPath = path.join(NEWS_CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { content } = splitFrontmatter(raw);
  const meta = toNewsMeta(slug, raw);

  if (!meta) return null;
  return { ...meta, content };
}
