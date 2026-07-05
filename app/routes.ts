import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // :lang? — ko는 프리픽스 없음(/...), en은 /en/... (lang-layout에서 검증)
  route(":lang?", "routes/lang-layout.tsx", [
    index("routes/home.tsx"),
    route("blog/:slug", "routes/post.tsx"),
    route("about", "routes/about.tsx"),
    route("tags", "routes/tags.tsx"),
  ]),
  route("rss", "routes/rss.tsx"),
  route("sitemap.xml", "routes/sitemap.tsx"),
  route("robots.txt", "routes/robots.tsx"),
  route("og/:file", "routes/og.tsx"),
] satisfies RouteConfig;
