import { siteConfig } from "~/config/site";

export async function loader() {
  const body = `User-agent: *
Allow: /

Sitemap: ${siteConfig.baseUrl}/sitemap.xml`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
