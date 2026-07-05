import { NavLink, useLocation } from "react-router";
import { siteConfig } from "~/config/site";
import type { Lang } from "~/lib/types";
import { getMessages } from "~/lib/messages";
import {
  localePath,
  setLocaleCookie,
  switchLocalePath,
} from "~/lib/locale";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-colors hover:text-ink ${isActive ? "text-ink" : "text-muted"}`;

export function Nav({ lang }: { lang: Lang }) {
  const t = getMessages(lang);
  const location = useLocation();
  const nextLang: Lang = lang === "ko" ? "en" : "ko";

  const toggleLanguage = () => {
    setLocaleCookie(nextLang);
    // SPA 내비게이션은 :lang? 경계에서 프리렌더 loader 데이터를 갱신하지 못함 —
    // 언어별 프리렌더 HTML을 새로 읽도록 전체 로드로 전환
    window.location.assign(switchLocalePath(location.pathname, nextLang));
  };

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-page">
      <div className="mx-auto flex max-w-[1040px] items-center justify-between px-6 py-[18px] sm:px-11 sm:py-[22px]">
        <NavLink
          to={localePath(lang, "/")}
          className="text-[19px] font-extrabold tracking-[-0.02em] text-ink"
        >
          {siteConfig.logo.name}
          <span className="text-wood-strong">{siteConfig.logo.suffix}</span>
        </NavLink>
        <nav className="flex items-center gap-5 text-[15px] font-semibold sm:gap-7">
          <NavLink to={localePath(lang, "/")} end className={linkClass}>
            {t.nav.posts}
          </NavLink>
          <NavLink to={localePath(lang, "/about")} className={linkClass}>
            {t.nav.about}
          </NavLink>
          <NavLink to={localePath(lang, "/tags")} className={linkClass}>
            {t.nav.tags}
          </NavLink>
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={nextLang === "ko" ? "한국어로 보기" : "View in English"}
            className="cursor-pointer rounded-full bg-sub px-3 py-1.5 text-[12.5px] font-bold tracking-wide text-wood-strong transition-colors hover:bg-badge"
          >
            {nextLang.toUpperCase()}
          </button>
        </nav>
      </div>
    </header>
  );
}
