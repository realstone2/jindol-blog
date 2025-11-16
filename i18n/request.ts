import { getRequestConfig } from "next-intl/server";
import { headers, cookies } from "next/headers";

/**
 * next-intl 설정
 * fallback 언어: 영어 (en)
 * 
 * Cookie 기반으로 언어를 관리합니다.
 * 우선순위: Cookie > requestLocale > Accept-Language
 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = "en"; // 기본값: 영어 (fallback)

  // 1. Cookie에서 언어 확인 (최우선)
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("NEXT_LOCALE")?.value;
  
  if (cookieLang === "ko" || cookieLang === "en") {
    locale = cookieLang;
  } else {
    // 2. requestLocale이 있으면 사용 (next-intl의 표준 방식)
    const resolvedLocale = await requestLocale;
    if (resolvedLocale && (resolvedLocale === "ko" || resolvedLocale === "en")) {
      locale = resolvedLocale;
    }
  }
  
  // 3. Accept-Language 헤더 확인
  if (locale === "en" && !cookieLang) {
    const headersList = await headers();
    const acceptLanguage = headersList.get("accept-language") || "";

    if (acceptLanguage) {
      // Accept-Language 헤더 파싱 (q-factor 고려)
      const languages = acceptLanguage.split(",").map((lang) => {
        const [language, qValue] = lang.trim().split(";");
        const q = qValue ? parseFloat(qValue.split("=")[1]) : 1.0;
        return { language: language.toLowerCase(), q };
      });

      // 우선순위 정렬 (q 값이 높은 순)
      languages.sort((a, b) => b.q - a.q);

      // 첫 번째(가장 선호하는) 언어 확인
      const primaryLang = languages[0]?.language || "";
      if (primaryLang.startsWith("ko")) {
        locale = "ko";
      }
    }
  }

  // 메시지 파일 로드 (fallback: 영어)
  let messages;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    // 언어 파일이 없으면 영어로 fallback
    messages = (await import(`../messages/en.json`)).default;
    locale = "en";
  }

  return {
    locale,
    messages,
  };
});

