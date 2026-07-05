import { data, Link } from "react-router";
import type { Route } from "./+types/post";
import { langFromParam, localePath } from "~/lib/locale";
import { getAdjacentPosts, getBlogPost } from "~/lib/posts.server";
import { renderMarkdown } from "~/lib/markdown.server";
import { getMessages } from "~/lib/messages";
import { formatDate } from "~/lib/format";
import { siteConfig } from "~/config/site";
import { ReadingProgress } from "~/components/reading-progress";
import { Comments } from "~/components/comments";

export async function loader({ params }: Route.LoaderArgs) {
  const lang = langFromParam(params.lang);
  const result = getBlogPost(params.slug, lang);
  if (!result) {
    throw data(null, { status: 404 });
  }

  const { post, usedLang } = result;
  const html = await renderMarkdown(post.content);
  const { prev, next } = getAdjacentPosts(post.slug, usedLang);

  return {
    lang,
    usedLang,
    html,
    prev,
    next,
    post: {
      slug: post.slug,
      metadata: post.metadata,
      excerpt: post.excerpt,
      thumbnail: post.thumbnail,
      readingMinutes: post.readingMinutes,
    },
  };
}

export function meta({ data: loaderData }: Route.MetaArgs) {
  if (!loaderData) return [{ title: siteConfig.title.ko }];
  const { post, lang } = loaderData;
  const url = `${siteConfig.baseUrl}${localePath(lang, `/blog/${post.slug}`)}`;
  const description = post.metadata.summary || post.excerpt;
  const ogImage =
    post.thumbnail ?? `${siteConfig.baseUrl}/og/${post.slug}.png`;

  return [
    { title: `${post.metadata.title} · ${siteConfig.title[lang]}` },
    { name: "description", content: description },
    { property: "og:title", content: post.metadata.title },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:url", content: url },
    { property: "og:image", content: ogImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: post.metadata.title },
    { name: "twitter:description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "ko",
      href: `${siteConfig.baseUrl}/blog/${post.slug}`,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "en",
      href: `${siteConfig.baseUrl}/en/blog/${post.slug}`,
    },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.metadata.title,
        datePublished: post.metadata.publishedAt,
        dateModified: post.metadata.publishedAt,
        description,
        url,
        author: { "@type": "Person", name: siteConfig.author.name.ko },
        ...(post.thumbnail ? { image: post.thumbnail } : {}),
      },
    },
  ];
}

function AdjacentCard({
  label,
  title,
  to,
  align,
}: {
  label: string;
  title: string;
  to: string;
  align: "left" | "right";
}) {
  return (
    <Link
      to={to}
      className={`flex-1 rounded-xl border border-line-soft bg-page px-[22px] py-[18px] transition-colors hover:bg-page-alt ${
        align === "right" ? "text-right" : ""
      }`}
    >
      <div className="mb-1.5 text-[12px] text-faint-3">{label}</div>
      <div className="text-[15.5px] font-bold text-ink">{title}</div>
    </Link>
  );
}

export default function Post({ loaderData }: Route.ComponentProps) {
  const { lang, post, html, prev, next } = loaderData;
  const t = getMessages(lang);
  const authorName = siteConfig.author.name[lang];

  return (
    <>
      <ReadingProgress />
      <main className="mx-auto max-w-[780px] px-6 pt-12 pb-[60px] sm:px-11 lg:px-0">
        <div className="mb-[18px] flex flex-wrap items-center gap-2.5">
          {post.metadata.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-badge px-[11px] py-1 text-[12.5px] font-bold text-wood-strong"
            >
              {tag}
            </span>
          ))}
          <span className="text-[13.5px] text-faint-3">
            {formatDate(post.metadata.publishedAt, lang)} ·{" "}
            {t.post.minRead(post.readingMinutes)}
          </span>
        </div>

        <h1 className="mb-[22px] text-[30px] leading-[1.28] font-extrabold tracking-[-0.03em] sm:text-[38px]">
          {post.metadata.title}
        </h1>

        <div className="mb-[34px] flex items-center gap-3">
          {siteConfig.author.avatar ? (
            <img
              src={siteConfig.author.avatar}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sub text-[15px] font-extrabold text-wood">
              {authorName.charAt(0)}
            </div>
          )}
          <div className="text-[14.5px] font-bold">{authorName}</div>
        </div>

        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt=""
            className="mb-10 h-[220px] w-full rounded-[14px] object-cover sm:h-[340px]"
          />
        )}

        <article
          className="prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {post.metadata.tags.length > 0 && (
          <div className="mt-10 mb-11 flex flex-wrap gap-2">
            {post.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-sub px-3.5 py-[7px] text-[13.5px] text-chip-text"
              >
                # {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-11 mb-10 flex items-center gap-[18px] rounded-2xl bg-sub px-7 py-6">
          {siteConfig.author.avatar ? (
            <img
              src={siteConfig.author.avatar}
              alt=""
              className="h-[60px] w-[60px] shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-page text-[22px] font-extrabold text-wood">
              {authorName.charAt(0)}
            </div>
          )}
          <div>
            <div className="mb-[3px] text-[17px] font-extrabold">
              {authorName}
            </div>
            <p className="text-[14px] leading-[1.6] text-faint">
              {siteConfig.author.bio[lang]}
            </p>
          </div>
        </div>

        {(prev || next) && (
          <div className="mb-14 flex flex-col gap-4 sm:flex-row">
            {prev && (
              <AdjacentCard
                label={t.post.prev}
                title={prev.metadata.title}
                to={localePath(lang, `/blog/${prev.slug}`)}
                align="left"
              />
            )}
            {next && (
              <AdjacentCard
                label={t.post.next}
                title={next.metadata.title}
                to={localePath(lang, `/blog/${next.slug}`)}
                align="right"
              />
            )}
          </div>
        )}

        <section aria-label={t.post.comments}>
          <Comments lang={lang} term={`blog/${post.slug}`} />
        </section>
      </main>
    </>
  );
}
