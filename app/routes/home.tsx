import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import type { Route } from "./+types/home";
import { langFromParam, localePath } from "~/lib/locale";
import { getAllTags, getBlogPosts, toSummary } from "~/lib/posts.server";
import { getMessages } from "~/lib/messages";
import { siteConfig } from "~/config/site";
import { PostRow } from "~/components/post-row";

const PAGE_SIZE = 10;

export async function loader({ params }: Route.LoaderArgs) {
  const lang = langFromParam(params.lang);
  const posts = getBlogPosts(lang).map((post) =>
    toSummary(post, { withSearchText: true }),
  );
  const tags = getAllTags(lang).map(({ tag }) => tag);
  return { lang, posts, tags };
}

export function meta({ data }: Route.MetaArgs) {
  const lang = data?.lang ?? "ko";
  return [
    { title: siteConfig.title[lang] },
    { name: "description", content: siteConfig.description[lang] },
    { property: "og:title", content: siteConfig.title[lang] },
    { property: "og:description", content: siteConfig.description[lang] },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: `${siteConfig.baseUrl}${localePath(lang, "/")}`,
    },
    { property: "og:image", content: `${siteConfig.baseUrl}/og/home.png` },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { lang, posts, tags } = loaderData;
  const t = getMessages(lang);

  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  // 태그 페이지에서 /?tag=… 로 진입한 경우 해당 태그를 초기 선택
  const [activeTag, setActiveTag] = useState<string | null>(
    searchParams.get("tag"),
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (activeTag && !post.metadata.tags.includes(activeTag)) return false;
      if (!q) return true;
      return (
        post.metadata.title.toLowerCase().includes(q) ||
        (post.searchText ?? "").includes(q)
      );
    });
  }, [posts, query, activeTag]);

  const visible = filtered.slice(0, visibleCount);

  const chipClass = (active: boolean) =>
    `cursor-pointer rounded-full px-4 py-2 text-[14px] transition-colors ${
      active
        ? "bg-wood-strong font-bold text-cream"
        : "bg-sub font-semibold text-muted hover:bg-badge"
    }`;

  return (
    <main className="mx-auto max-w-[940px] px-6 pt-11 pb-14 sm:px-11">
      <h1 className="mb-1.5 text-[34px] font-extrabold tracking-[-0.03em]">
        {t.list.title}
      </h1>
      <p className="mb-[26px] text-[15px] text-faint-2">{t.list.description}</p>

      <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-sub px-[18px] py-[13px]">
        <span aria-hidden className="text-[16px] text-wood-strong">
          🔍
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          placeholder={t.list.searchPlaceholder}
          className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-faint-3"
        />
      </div>

      {tags.length > 0 && (
        <div className="mb-[34px] flex flex-wrap gap-[9px]">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={chipClass(activeTag === null)}
          >
            {t.list.all}
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setActiveTag(activeTag === tag ? null : tag);
                setVisibleCount(PAGE_SIZE);
              }}
              className={chipClass(activeTag === tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className={`flex flex-col ${tags.length === 0 ? "mt-2" : ""}`}>
        {visible.map((post) => (
          <PostRow key={post.slug} post={post} lang={lang} />
        ))}
        {filtered.length === 0 && (
          <p className="border-t border-line py-16 text-center text-[15px] text-faint-2">
            {t.list.empty}
          </p>
        )}
      </div>

      {filtered.length > visibleCount && (
        <div className="mt-[34px] flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="cursor-pointer rounded-full border border-line-btn px-7 py-3 text-[14.5px] font-semibold text-chip-text transition-colors hover:bg-sub"
          >
            {t.list.loadMore}
          </button>
        </div>
      )}
    </main>
  );
}
