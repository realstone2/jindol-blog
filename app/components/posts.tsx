import Link from "next/link";
import { formatDate, getBlogPosts } from "app/blog/utils";

export function BlogPosts({ lang = "ko" }: { lang?: "ko" | "en" }) {
  let allBlogs = getBlogPosts(lang);

  return (
    <div className="space-y-4">
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="group block p-6 rounded-2xl backdrop-blur-2xl bg-white/25 border border-white/20 hover:bg-white/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out"
            style={{
              boxShadow:
                "0 8px 32px 0 rgba(139, 99, 76, 0.12), inset 0 1px 0 0 rgba(255, 248, 240, 0.6)",
            }}
            href={`/blog/${post.slug}?lang=${lang}`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <p className="text-sm font-medium text-[#8E8276] tabular-nums">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <p className="text-lg font-semibold text-[#3E3028] tracking-tight group-hover:text-[#8B7355] transition-colors">
                {post.metadata.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
}
