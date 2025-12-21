import { BlogPosts } from "app/components/posts";
import { getUserLanguage } from "app/lib/language";
import { getTranslations } from "next-intl/server";
import { IpodContainer } from "app/components/ipod-container";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const lang = await getUserLanguage(params);

  const t = await getTranslations({ locale: lang, namespace: "home" });

  return (
    <IpodContainer>
      {/* 타이틀 영역 - 파란색 그라데이션 (3D 효과) */}
      <div className="bg-gradient-to-b from-[#6ba8e0] via-[#5e9ed6] to-[#3d7eb3] px-6 py-4 border-b border-[#2a2a2a] flex-shrink-0 ipod-title-3d">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            📝 {lang === "ko" ? "게시글" : "Posts"}
          </h1>
          <span className="text-xs text-white/80 font-medium">Playlist</span>
        </div>
      </div>

      {/* 플레이리스트 - 게시글 목록 (스크롤 가능) */}
      <div className="bg-[#f8f9fa] flex-1 overflow-auto">
        <BlogPosts lang={lang} />
      </div>

      {/* 설명 영역 */}
      <div className="bg-[#f8f9fa] px-6 py-4 border-t border-[#e0e0e0] text-sm text-[#666] flex-shrink-0">
        {t("description")}
      </div>
    </IpodContainer>
  );
}
