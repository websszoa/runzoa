import Link from "next/link";
import type { ReactNode } from "react";

interface PageNewsContentProps {
  content: string;
}

function renderInline(text: string) {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let key = 0;

  for (const match of text.matchAll(regex)) {
    const idx = match.index ?? 0;
    if (idx > last) nodes.push(text.slice(last, idx));

    const value = match[0];
    if (value.startsWith("**") && value.endsWith("**")) {
      nodes.push(<strong key={`b-${key++}`}>{value.slice(2, -2)}</strong>);
    } else {
      const link = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        nodes.push(
          <Link
            key={`l-${key++}`}
            href={link[2]}
            target={link[2].startsWith("http") ? "_blank" : undefined}
            rel={link[2].startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-brand hover:underline"
          >
            {link[1]}
          </Link>,
        );
      } else {
        nodes.push(value);
      }
    }

    last = idx + value.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export default function PageNewsContent({ content }: PageNewsContentProps) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={`h2-${key++}`} className="font-nanumNeo mt-8 mb-3 text-xl text-slate-900">
          {line.replace(/^##\s+/, "")}
        </h2>,
      );
      i += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={`h3-${key++}`} className="font-nanumNeo mt-6 mb-2 text-lg text-slate-900">
          {line.replace(/^###\s+/, "")}
        </h3>,
      );
      i += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().replace(/^- /, ""));
        i += 1;
      }

      blocks.push(
        <ul key={`ul-${key++}`} className="mb-4 ml-4 list-disc space-y-1 text-sm text-muted-foreground">
          {items.map((item, idx) => (
            <li key={`${item}-${idx}`}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("## ") &&
      !lines[i].trim().startsWith("### ") &&
      !lines[i].trim().startsWith("- ")
    ) {
      paragraph.push(lines[i].trim());
      i += 1;
    }

    blocks.push(
      <p key={`p-${key++}`} className="font-anyvid mb-4 text-sm leading-relaxed text-muted-foreground break-keep">
        {renderInline(paragraph.join(" "))}
      </p>,
    );
  }

  return <div>{blocks}</div>;
}
