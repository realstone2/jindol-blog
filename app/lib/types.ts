export type Lang = "ko" | "en";

export type PostMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  tags: string[];
};

/** loader → 컴포넌트로 내려오는 목록용 포스트 (본문 제외) */
export type SerializedPostSummary = {
  slug: string;
  lang: Lang;
  metadata: PostMetadata;
  excerpt: string;
  thumbnail: string | null;
  readingMinutes: number;
  /** 목록 검색용 본문 평문 (홈 라우트에서만 포함) */
  searchText?: string;
};
