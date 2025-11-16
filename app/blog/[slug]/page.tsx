import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { formatDate, getBlogPosts } from "app/blog/utils";
import { baseUrl } from "app/sitemap";
import { getUserLanguage } from "app/lib/language";
import { Comments } from "app/components/comments";

export async function generateStaticParams() {
  // 모든 언어의 포스트 생성
  let koPosts = getBlogPosts("ko");
  let enPosts = getBlogPosts("en");

  // 중복 제거 (slug만 필요)
  let allSlugs = new Set([
    ...koPosts.map((post) => post.slug),
    ...enPosts.map((post) => post.slug),
  ]);

  return Array.from(allSlugs).map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const queryParams = await searchParams;
  const lang = await getUserLanguage(queryParams);

  let post = getBlogPosts(lang).find((post) => post.slug === slug);

  // 해당 언어 버전이 없으면 다른 언어로 fallback
  if (!post) {
    const fallbackLang = lang === "ko" ? "en" : "ko";
    post = getBlogPosts(fallbackLang).find((post) => post.slug === slug);
  }

  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: {
      languages: {
        ko: `${baseUrl}/blog/${post.slug}?lang=ko`,
        en: `${baseUrl}/blog/${post.slug}?lang=en`,
        "x-default": `${baseUrl}/blog/${post.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      locale: lang === "ko" ? "ko_KR" : "en_US",
      alternateLocale: lang === "ko" ? ["en_US"] : ["ko_KR"],
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const queryParams = await searchParams;
  const lang = await getUserLanguage(queryParams);

  let post = getBlogPosts(lang).find((post) => post.slug === slug);

  // 해당 언어 버전이 없으면 다른 언어로 fallback
  if (!post) {
    const fallbackLang = lang === "ko" ? "en" : "ko";
    post = getBlogPosts(fallbackLang).find((post) => post.slug === slug);
  }

  if (!post) {
    notFound();
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: "My Portfolio",
            },
          }),
        }}
      />
      <div
        className="backdrop-blur-2xl bg-white/30 rounded-3xl p-8 md:p-12 border border-white/20 mb-12"
        style={{
          boxShadow:
            "0 8px 32px 0 rgba(139, 99, 76, 0.15), inset 0 1px 0 0 rgba(255, 248, 240, 0.6)",
        }}
      >
        <h1 className="title font-bold text-4xl tracking-tight mb-4 bg-gradient-to-r from-[#3E3028] to-[#6B5D52] bg-clip-text text-transparent">
          {post.metadata.title}
        </h1>
        <div className="flex justify-between items-center text-sm">
          <p className="text-sm font-medium text-[#8E8276]">
            {formatDate(post.metadata.publishedAt)}
          </p>
        </div>
      </div>
      <article className="prose prose-neutral max-w-none">
        <CustomMDX source={post.content} />
      </article>

      {/* 댓글 섹션 */}
      <div className="mt-16">
        <Comments lang={lang} />
      </div>
    </section>
  );
}
