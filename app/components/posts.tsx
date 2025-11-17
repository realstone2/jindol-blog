import Link from "next/link";
import { formatDate, getBlogPosts } from "app/blog/utils";

export function BlogPosts({ lang = "ko" }: { lang?: "ko" | "en" }) {
  let allBlogs = getBlogPosts(lang);

  return (
    <div>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post, index) => (
          <Link
            key={post.slug}
            className="group flex items-center gap-4 px-5 py-3.5 border-b border-[#e8e8e8] last:border-b-0 hover:bg-gradient-to-b hover:from-[#6ba8e0] hover:via-[#5e9ed6] hover:to-[#3d7eb3] transition-all ipod-3d-hover"
            href={`/blog/${post.slug}?lang=${lang}`}
          >
            {/* 트랙 번호 */}
            <span className="text-xs font-bold text-[#999] group-hover:text-white w-6 text-right tabular-nums flex-shrink-0">
              {(index + 1).toString().padStart(2, "0")}
            </span>

            {/* 재생 아이콘 */}
            <span className="text-[#5e9ed6] group-hover:text-white font-bold text-sm flex-shrink-0">
              ▶
            </span>

            {/* 제목 */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#1a1a1a] group-hover:text-white text-sm tracking-tight truncate">
                {post.metadata.title}
              </p>
            </div>

            {/* 재생시간 (날짜) */}
            <time className="text-xs font-medium text-[#666] group-hover:text-white/80 tabular-nums flex-shrink-0">
              {formatDate(post.metadata.publishedAt, false)}
            </time>

            {/* 화살표 */}
            <svg
              className="w-4 h-4 text-[#999] group-hover:text-white flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ))}
    </div>
  );
}
