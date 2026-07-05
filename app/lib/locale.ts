import type { Lang } from "./types";

export const LOCALE_COOKIE = "NEXT_LOCALE";

/** URL 경로에서 언어 판별: /en, /en/... → en, 그 외 ko */
export function langFromPath(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ko";
}

/** 라우트 param(:lang?)에서 언어 판별 */
export function langFromParam(param: string | undefined): Lang {
  return param === "en" ? "en" : "ko";
}

/** ko 기준 경로에 언어 프리픽스 적용 */
export function localePath(lang: Lang, path: string): string {
  if (lang === "ko") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

/** 현재 경로를 반대 언어의 동일 페이지 경로로 변환 */
export function switchLocalePath(pathname: string, to: Lang): string {
  const stripped =
    pathname === "/en" ? "/" : pathname.replace(/^\/en(?=\/)/, "");
  return localePath(to, stripped);
}

/** 클라이언트에서 언어 쿠키 저장 (1년) */
export function setLocaleCookie(lang: Lang) {
  document.cookie = `${LOCALE_COOKIE}=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

/**
 * 첫 페인트 전 언어 리다이렉트 (root <head> inline script).
 * 쿠키 > navigator.language 순으로 선호 언어를 정하고, 현재 경로와 다르면 교체.
 */
export const LOCALE_REDIRECT_SCRIPT = `(function(){
  var m = document.cookie.match(/(?:^|; )${LOCALE_COOKIE}=(ko|en)/);
  var pref = m ? m[1] : ((navigator.language || "").toLowerCase().indexOf("ko") === 0 ? "ko" : "en");
  var p = location.pathname;
  var isEn = p === "/en" || p.indexOf("/en/") === 0;
  if (pref === "en" && !isEn) {
    location.replace("/en" + (p === "/" ? "" : p) + location.search + location.hash);
  } else if (pref === "ko" && isEn) {
    var stripped = p === "/en" ? "/" : p.slice(3);
    location.replace(stripped + location.search + location.hash);
  }
})();`;
