import { BlogPosts } from "app/components/posts";
import { getUserLanguage } from "app/lib/language";
import { getTranslations } from "next-intl/server";
import { IpodContainer } from "app/components/ipod-container";

export const metadata = {
  title: "Blog",
  description: "Read my blog.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const lang = await getUserLanguage(params);

  const t = await getTranslations({ locale: lang, namespace: "blog" });

  return (
    <IpodContainer>
      {/* 타이틀 영역 - 파란색 그라데이션 (3D 효과) */}
      <div className="bg-gradient-to-b from-[#6ba8e0] via-[#5e9ed6] to-[#3d7eb3] px-6 py-4 border-b border-[#2a2a2a] flex-shrink-0 ipod-title-3d">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            🎵 {t("title")}
          </h1>
          <span className="text-xs text-white/80 font-medium">Library</span>
        </div>
      </div>

      {/* 플레이리스트 - 게시글 목록 (스크롤 가능) */}
      <div className="bg-[#f8f9fa] flex-1 overflow-auto">
        <BlogPosts lang={lang} />
      </div>
    </IpodContainer>
  );
}
