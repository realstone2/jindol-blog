import { BlogPosts } from "app/components/posts";
import { getUserLanguage } from "app/lib/language";

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

  return (
    <section>
      <h1 className="font-bold text-3xl mb-12 tracking-tight bg-gradient-to-r from-[#3E3028] to-[#6B5D52] bg-clip-text text-transparent">
        {lang === "ko" ? "블로그" : "My Blog"}
      </h1>
      <BlogPosts lang={lang} />
    </section>
  );
}
