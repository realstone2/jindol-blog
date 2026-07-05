import type { Route } from "./+types/about";
import { langFromParam } from "~/lib/locale";
import { getMessages } from "~/lib/messages";
import { siteConfig } from "~/config/site";

export async function loader({ params }: Route.LoaderArgs) {
  return { lang: langFromParam(params.lang) };
}

export function meta({ data }: Route.MetaArgs) {
  const lang = data?.lang ?? "ko";
  const title =
    lang === "ko"
      ? `소개 · ${siteConfig.title.ko}`
      : `About · ${siteConfig.title.en}`;
  return [
    { title },
    { name: "description", content: siteConfig.description[lang] },
  ];
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 text-[12.5px] font-bold tracking-[0.18em] text-wood-soft uppercase">
      {children}
    </div>
  );
}

export default function About({ loaderData }: Route.ComponentProps) {
  const { lang } = loaderData;
  const t = getMessages(lang);
  const { author, about } = siteConfig;
  const name = author.name[lang];

  const profileButtons = (
    <div className="flex gap-2.5 sm:flex-col">
      <a
        href={author.github}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 rounded-[10px] bg-highlight p-3 text-center text-[14.5px] font-bold text-ink transition-opacity hover:opacity-85"
      >
        {t.about.github}
      </a>
      <a
        href={`mailto:${author.email}`}
        className="flex-1 rounded-[10px] border border-line-btn p-3 text-center text-[14.5px] font-semibold text-chip-text transition-colors hover:bg-page"
      >
        {t.about.email}
      </a>
    </div>
  );

  return (
    <main className="mx-auto max-w-[1040px] px-6 py-11 sm:px-11">
      <div className="overflow-hidden rounded-[20px] bg-page-alt shadow-card-lg sm:flex sm:bg-page">
        {/* 좌측 프로필 카드 — 모바일에선 상단 스택(2b), 데스크톱에선 사이드(2a) */}
        <div className="bg-sub p-[30px_26px_34px] text-center sm:w-[340px] sm:shrink-0 sm:self-stretch sm:p-[56px_40px] sm:text-left">
          <div className="sm:sticky sm:top-[110px]">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={name}
                className="mx-auto mb-4 h-[108px] w-[108px] rounded-full object-cover sm:mx-0 sm:mb-6 sm:h-[130px] sm:w-[130px]"
              />
            ) : (
              <div className="mx-auto mb-4 flex h-[108px] w-[108px] items-center justify-center rounded-full bg-page text-[40px] font-extrabold text-wood sm:mx-0 sm:mb-6 sm:h-[130px] sm:w-[130px]"
              >
                {name.charAt(0)}
              </div>
            )}
            <div className="mb-1 text-[23px] font-extrabold tracking-[-0.02em] sm:text-[26px]">
              {name}
            </div>
            <div className="mb-3.5 text-[14px] font-semibold text-wood sm:mb-5 sm:text-[15px]">
              {author.role[lang]}
            </div>
            <div className="mb-5 flex justify-center gap-4 text-[13px] text-muted sm:mb-[26px] sm:flex-col sm:justify-start sm:gap-[9px] sm:text-[14.5px]">
              <span>{about.location[lang]}</span>
              <span>{about.years[lang]}</span>
            </div>
            <div className="mb-5 hidden h-px bg-line-strong sm:block sm:mb-[26px]" />
            <div className="hidden sm:block">
              <div className="mb-3.5 text-[12.5px] font-bold tracking-[0.15em] text-wood-soft">
                {t.about.stack}
              </div>
              <div className="mb-[30px] flex flex-wrap gap-2">
                {about.stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg bg-page px-[13px] py-[7px] text-[13.5px] font-semibold text-chip-text"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            {profileButtons}
          </div>
        </div>

        {/* 우측 본문 */}
        <div className="flex-1 p-[30px_26px_40px] sm:p-[60px_56px]">
          <section className="mb-8 sm:mb-11">
            <Kicker>{about.kicker[lang]}</Kicker>
            <h1 className="mb-4 text-[23px] leading-[1.35] font-extrabold tracking-[-0.02em] whitespace-pre-line sm:text-[32px]">
              {about.headline[lang]}
            </h1>
            <p className="text-[15px] leading-[1.8] text-muted sm:text-[16.5px]">
              {about.intro[lang]}
            </p>
          </section>

          {/* 모바일 전용 STACK 섹션 (2b) */}
          <section className="mb-7 sm:hidden">
            <div className="mb-6 h-px bg-line-faint" />
            <Kicker>{t.about.stack}</Kicker>
            <div className="flex flex-wrap gap-2">
              {about.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-lg bg-card-alt px-3.5 py-2 text-[13.5px] font-semibold text-chip-text"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          <div className="mb-7 h-px bg-line-faint sm:mb-10" />

          <section className="mb-8 sm:mb-10">
            <Kicker>{t.about.timeline}</Kicker>
            <div className="mt-1 flex flex-col gap-[18px] sm:gap-[22px]">
              {about.timeline.map((item) => (
                <div
                  key={item.period}
                  className="flex flex-col gap-1 sm:flex-row sm:gap-5"
                >
                  <div className="min-w-[60px] text-[13px] font-extrabold text-wood sm:text-[15px]">
                    {item.period}
                  </div>
                  <div>
                    <div className="text-[15.5px] font-bold sm:text-[17px]">
                      {item.title[lang]}
                    </div>
                    <p className="mt-1 text-[14px] leading-[1.7] text-faint sm:text-[15px]">
                      {item.description[lang]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mb-7 h-px bg-line-faint sm:mb-10" />

          <section>
            <Kicker>{t.about.interests}</Kicker>
            <div className="mt-1 flex flex-wrap gap-2.5">
              {about.interests[lang].map((interest) => (
                <span
                  key={interest}
                  className="rounded-full bg-card-alt px-4 py-[9px] text-[15px] text-chip-text"
                >
                  {interest}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
