import { getBlogPosts } from "~/lib/posts.server";
import { siteConfig } from "~/config/site";

export async function loader() {
  // ko/en 슬러그 합집합 (기존 앱과 동일)
  const slugs = new Set(
    [...getBlogPosts("ko"), ...getBlogPosts("en")].map((post) => post.slug),
  );
  const lastModBySlug = new Map<string, string>();
  for (const post of [...getBlogPosts("ko"), ...getBlogPosts("en")]) {
    const existing = lastModBySlug.get(post.slug);
    if (!existing || post.metadata.publishedAt > existing) {
      lastModBySlug.set(post.slug, post.metadata.publishedAt);
    }
  }

  const staticRoutes = ["", "/about", "/tags", "/en", "/en/about", "/en/tags"].map(
    (route) => `  <url>
    <loc>${siteConfig.baseUrl}${route}</loc>
  </url>`,
  );

  const postRoutes = [...slugs].flatMap((slug) =>
    ["", "/en"].map(
      (prefix) => `  <url>
    <loc>${siteConfig.baseUrl}${prefix}/blog/${slug}</loc>
    <lastmod>${lastModBySlug.get(slug) ?? ""}</lastmod>
  </url>`,
    ),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticRoutes, ...postRoutes].join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
