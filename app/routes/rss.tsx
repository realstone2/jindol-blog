import { getBlogPosts } from "~/lib/posts.server";
import { siteConfig } from "~/config/site";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function loader() {
  const posts = getBlogPosts("ko");

  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.metadata.title)}</title>
      <link>${siteConfig.baseUrl}/blog/${post.slug}</link>
      <guid>${siteConfig.baseUrl}/blog/${post.slug}</guid>
      <description>${escapeXml(post.metadata.summary || post.excerpt)}</description>
      <pubDate>${new Date(post.metadata.publishedAt).toUTCString()}</pubDate>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.title.ko)}</title>
    <link>${siteConfig.baseUrl}</link>
    <description>${escapeXml(siteConfig.description.ko)}</description>
    <language>ko</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
