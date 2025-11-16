import { BlogPosts } from "app/components/posts";
import { getUserLanguage } from "app/lib/language";
import { getTranslations } from "next-intl/server";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const lang = await getUserLanguage(params);

  // next-intl의 getTranslations 사용 - 매번 import할 필요 없음!
  // locale을 전달하면 i18n.ts 설정을 기반으로 자동으로 messages를 가져옴
  const t = await getTranslations({ locale: lang, namespace: "home" });

  return (
    <section>
      <h1 className="mb-8 text-3xl font-bold tracking-tight bg-gradient-to-r from-[#3E3028] to-[#6B5D52] bg-clip-text text-transparent">
        {t("title")}
      </h1>
      <p className="mb-4 text-base leading-relaxed text-[#6B5D52]">
        {t("description")}
      </p>
      <div className="my-12">
        <BlogPosts lang={lang} />
      </div>
    </section>
  );
}
