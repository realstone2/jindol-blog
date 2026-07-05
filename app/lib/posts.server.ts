import type { Lang, PostMetadata, SerializedPostSummary } from "./types";

export type Post = {
  slug: string;
  lang: Lang;
  metadata: PostMetadata;
  content: string;
  plainText: string;
  excerpt: string;
  thumbnail: string | null;
  readingMinutes: number;
};

/**
 * 콘텐츠는 빌드 타임에 번들로 포함된다 (런타임 fs 접근 없음).
 * 새 포스트는 sync-notion 후 재빌드 시 반영 — dev에서는 glob이 자동 감지.
 */
const rawFiles = import.meta.glob("../../content/posts/*/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  const frontMatterBlock = match ? match[1] : "";
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const raw: Record<string, string> = {};

  for (const line of frontMatterBlock.trim().split("\n")) {
    const [key, ...valueArr] = line.split(": ");
    if (!key || valueArr.length === 0) continue;
    raw[key.trim()] = valueArr
      .join(": ")
      .trim()
      .replace(/^['"](.*)['"]$/, "$1");
  }

  let tags: string[] = [];
  if (raw.tags) {
    try {
      const parsed = JSON.parse(raw.tags);
      if (Array.isArray(parsed)) tags = parsed.map(String);
    } catch {
      // 배열 형식이 아니면 무시
    }
  }

  const metadata: PostMetadata = {
    title: raw.title ?? "",
    publishedAt: raw.publishedAt ?? "",
    summary: raw.summary ?? "",
    image: raw.image || undefined,
    tags,
  };

  return { metadata, content };
}

const IMAGE_PATTERN = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/;

function stripMarkdown(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildPost(slug: string, rawContent: string, lang: Lang): Post {
  const { metadata, content } = parseFrontmatter(rawContent);
  const plain = stripMarkdown(content);

  // 한국어 ~500자/분, 영어 ~200단어/분
  const readingMinutes =
    lang === "ko"
      ? Math.max(1, Math.round(plain.length / 500))
      : Math.max(1, Math.round(plain.split(/\s+/).length / 200));

  const excerpt =
    metadata.summary ||
    (plain.length > 120 ? `${plain.slice(0, 120)}…` : plain);

  const thumbnail =
    metadata.image ?? IMAGE_PATTERN.exec(content)?.[1] ?? null;

  return {
    slug,
    lang,
    metadata,
    content,
    plainText: plain,
    excerpt,
    thumbnail,
    readingMinutes,
  };
}

function buildIndex(): Record<Lang, Post[]> {
  const index: Record<Lang, Post[]> = { ko: [], en: [] };

  for (const [filePath, raw] of Object.entries(rawFiles)) {
    const match = /content\/posts\/(ko|en)\/([^/]+)\.mdx$/.exec(filePath);
    if (!match) continue;
    const lang: Lang = match[1] === "ko" ? "ko" : "en";
    index[lang].push(buildPost(match[2], raw, lang));
  }

  for (const lang of ["ko", "en"] as const) {
    index[lang].sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime(),
    );
  }

  return index;
}

const postsByLang = buildIndex();

export function getBlogPosts(lang: Lang = "ko"): Post[] {
  return postsByLang[lang];
}

/** 요청 언어에 글이 없으면 반대 언어로 폴백 (기존 앱 동작 유지) */
export function getBlogPost(
  slug: string,
  lang: Lang,
): { post: Post; usedLang: Lang } | null {
  const order: Lang[] = lang === "ko" ? ["ko", "en"] : ["en", "ko"];
  for (const tryLang of order) {
    const post = postsByLang[tryLang].find((entry) => entry.slug === slug);
    if (post) return { post, usedLang: tryLang };
  }
  return null;
}

export function toSummary(
  post: Post,
  options?: { withSearchText?: boolean },
): SerializedPostSummary {
  return {
    slug: post.slug,
    lang: post.lang,
    metadata: post.metadata,
    excerpt: post.excerpt,
    thumbnail: post.thumbnail,
    readingMinutes: post.readingMinutes,
    ...(options?.withSearchText
      ? { searchText: post.plainText.slice(0, 5000).toLowerCase() }
      : {}),
  };
}

export function getAllTags(lang: Lang): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getBlogPosts(lang)) {
    for (const tag of post.metadata.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAdjacentPosts(slug: string, lang: Lang) {
  const posts = getBlogPosts(lang);
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { prev: null, next: null };
  // 목록은 최신순: 이전 글 = 더 오래된 글(index + 1), 다음 글 = 더 최신 글(index - 1)
  return {
    prev: posts[index + 1] ? toSummary(posts[index + 1]) : null,
    next: posts[index - 1] ? toSummary(posts[index - 1]) : null,
  };
}
