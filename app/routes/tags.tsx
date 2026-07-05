import { Link } from "react-router";
import type { Route } from "./+types/tags";
import { langFromParam, localePath } from "~/lib/locale";
import { getAllTags } from "~/lib/posts.server";
import { getMessages } from "~/lib/messages";
import { siteConfig } from "~/config/site";

export async function loader({ params }: Route.LoaderArgs) {
  const lang = langFromParam(params.lang);
  return { lang, tags: getAllTags(lang) };
}

export function meta({ data }: Route.MetaArgs) {
  const lang = data?.lang ?? "ko";
  const title =
    lang === "ko"
      ? `태그 · ${siteConfig.title.ko}`
      : `Tags · ${siteConfig.title.en}`;
  return [{ title }];
}

export default function Tags({ loaderData }: Route.ComponentProps) {
  const { lang, tags } = loaderData;
  const t = getMessages(lang);

  return (
    <main className="mx-auto max-w-[940px] px-6 pt-11 pb-14 sm:px-11">
      <h1 className="mb-1.5 text-[34px] font-extrabold tracking-[-0.03em]">
        {t.tags.title}
      </h1>
      <p className="mb-8 text-[15px] text-faint-2">{t.tags.description}</p>

      {tags.length === 0 ? (
        <p className="border-t border-line py-16 text-center text-[15px] text-faint-2">
          {t.list.empty}
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              to={`${localePath(lang, "/")}?tag=${encodeURIComponent(tag)}`}
              className="group flex items-center gap-2.5 rounded-full bg-sub px-5 py-3 transition-colors hover:bg-badge"
            >
              <span className="text-[15px] font-semibold text-chip-text group-hover:text-wood-strong">
                # {tag}
              </span>
              <span className="text-[13px] text-faint-3">
                {t.tags.count(count)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
