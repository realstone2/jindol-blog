import { Link } from "react-router";
import type { Lang, SerializedPostSummary } from "~/lib/types";
import { getMessages } from "~/lib/messages";
import { formatDate } from "~/lib/format";
import { localePath } from "~/lib/locale";

export function PostThumbnail({
  title,
  thumbnail,
  className,
}: {
  title: string;
  thumbnail: string | null;
  className: string;
}) {
  if (thumbnail) {
    return (
      <img
        src={thumbnail}
        alt=""
        loading="lazy"
        className={`${className} rounded-xl object-cover`}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={`${className} flex items-center justify-center rounded-xl bg-sub`}
    >
      <span className="text-4xl font-extrabold text-wood/25">
        {title.trim().charAt(0).toUpperCase() || "J"}
      </span>
    </div>
  );
}

export function PostRow({
  post,
  lang,
}: {
  post: SerializedPostSummary;
  lang: Lang;
}) {
  const t = getMessages(lang);

  return (
    <Link
      to={localePath(lang, `/blog/${post.slug}`)}
      className="group flex flex-col gap-4 border-t border-line py-6 transition-colors hover:bg-page-alt sm:flex-row sm:gap-[26px]"
    >
      <PostThumbnail
        title={post.metadata.title}
        thumbnail={post.thumbnail}
        className="h-44 w-full shrink-0 sm:h-32 sm:w-[196px]"
      />
      <div className="flex-1">
        <div className="mb-[9px] flex flex-wrap items-center gap-2.5">
          {post.metadata.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-badge px-[11px] py-1 text-[12.5px] font-bold text-wood-strong"
            >
              {tag}
            </span>
          ))}
          <span className="text-[13px] text-faint-3">
            {formatDate(post.metadata.publishedAt, lang)} ·{" "}
            {t.post.min(post.readingMinutes)}
          </span>
        </div>
        <h2 className="mb-2 text-[21px] font-bold tracking-[-0.01em] text-ink transition-colors group-hover:text-wood-strong">
          {post.metadata.title}
        </h2>
        {post.excerpt && (
          <p className="text-[15px] leading-[1.65] text-faint">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
