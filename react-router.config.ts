import fs from "node:fs";
import path from "node:path";
import type { Config } from "@react-router/dev/config";

function slugsIn(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export default {
  // 완전 SSG — 두 언어(ko: /, en: /en) 콘텐츠를 전부 정적으로 빌드
  ssr: false,
  async prerender() {
    const postsDir = path.join(process.cwd(), "content", "posts");
    const slugs = [
      ...new Set([
        ...slugsIn(path.join(postsDir, "ko")),
        ...slugsIn(path.join(postsDir, "en")),
      ]),
    ];

    const pages = ["/", "/about", "/tags"];
    const koPaths = [...pages, ...slugs.map((slug) => `/blog/${slug}`)];
    const enPaths = koPaths.map((p) => (p === "/" ? "/en" : `/en${p}`));
    const ogPaths = ["/og/home.png", ...slugs.map((slug) => `/og/${slug}.png`)];

    return [
      ...koPaths,
      ...enPaths,
      ...ogPaths,
      "/rss",
      "/sitemap.xml",
      "/robots.txt",
    ];
  },
} satisfies Config;
