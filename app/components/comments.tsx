"use client";

import Giscus from "@giscus/react";

interface CommentsProps {
  lang: "ko" | "en";
}

/**
 * GitHub Discussions 기반 댓글 컴포넌트 (Giscus)
 *
 * PRD-07: GitHub 댓글 기능
 * - FR-7.1: 블로그 포스트 하단에 댓글 섹션 표시
 * - FR-7.2: GitHub 계정으로 로그인 후 댓글 작성
 * - FR-7.3: 다국어 UI 지원 (한국어/영어)
 * - FR-7.4: Glass UI 디자인 적용
 */
export function Comments({ lang }: CommentsProps) {
  const giscusLang = lang === "ko" ? "ko" : "en";

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#3E3028] to-[#6B5D52] bg-clip-text text-transparent">
        {/* {lang === "ko" ? "💬 댓글" : "💬 Comments"} */}
      </h2>
      <Giscus
        repo={process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`}
        repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID || ""}
        category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "Announcements"}
        categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || ""}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang={giscusLang}
        loading="eager"
      />
    </div>
  );
}
