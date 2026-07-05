import Giscus from "@giscus/react";
import { siteConfig } from "~/config/site";
import type { Lang } from "~/lib/types";

/**
 * GitHub Discussions 기반 댓글 (Giscus)
 * mapping은 slug 기반 term 사용 — ko(/blog/x)와 en(/en/blog/x)이 같은 스레드를 공유
 */
export function Comments({ lang, term }: { lang: Lang; term: string }) {
  if (!siteConfig.giscus.repo || !siteConfig.giscus.repoId) {
    return null;
  }

  return (
    <Giscus
      repo={siteConfig.giscus.repo}
      repoId={siteConfig.giscus.repoId}
      category={siteConfig.giscus.category}
      categoryId={siteConfig.giscus.categoryId}
      mapping="specific"
      term={term}
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="light"
      lang={lang}
      loading="lazy"
    />
  );
}
