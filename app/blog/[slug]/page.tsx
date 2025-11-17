import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { formatDate, getBlogPosts } from "app/blog/utils";
import { baseUrl } from "app/sitemap";
import { getUserLanguage } from "app/lib/language";
import { Comments } from "app/components/comments";
import { IpodContainer } from "app/components/ipod-container";

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
    <>
      <section className="pb-32">
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

        <IpodContainer>
          {/* 타이틀 영역 - 파란색 그라데이션 (3D 효과) */}
          <div className="bg-gradient-to-b from-[#6ba8e0] via-[#5e9ed6] to-[#3d7eb3] px-6 py-5 border-b border-[#2a2a2a] flex-shrink-0 ipod-title-3d">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight">
              {post.metadata.title}
            </h1>
          </div>

          {/* 본문 콘텐츠 (스크롤 가능) */}
          <article className="bg-[#f8f9fa] px-6 py-8 md:px-10 md:py-10 flex-1 overflow-auto">
            <div className="prose prose-neutral max-w-none prose-ipod">
              <CustomMDX source={post.content} />
            </div>

            {/* 댓글 섹션 */}
            <div className="mt-16 pt-8 border-t-2 border-[#e0e0e0]">
              <div className="flex items-center gap-2 mb-6">
                <svg
                  className="w-5 h-5 text-[#5e9ed6]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                <h2 className="text-xl font-bold text-[#1a1a1a]">
                  {lang === "ko" ? "댓글" : "Comments"}
                </h2>
              </div>
              <Comments lang={lang} />
            </div>
          </article>
        </IpodContainer>
      </section>
    </>
  );
}
