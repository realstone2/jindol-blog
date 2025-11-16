import { headers, cookies } from "next/headers";

/**
 * 사용자 언어 감지
 * 1. Cookie에 저장된 언어 확인 (우선순위 최상)
 * 2. URL 쿼리 파라미터 확인
 * 3. Accept-Language 헤더 확인 (q-factor 고려)
 * 4. 기본값: 'en'
 */
export async function getUserLanguage(searchParams?: {
  lang?: string;
}): Promise<"ko" | "en"> {
  // 1. Cookie에 저장된 언어 확인
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("NEXT_LOCALE")?.value;

  if (cookieLang === "ko" || cookieLang === "en") {
    console.log("🍪 Language from cookie:", cookieLang);
    return cookieLang;
  }

  // 2. URL 쿼리 파라미터 확인
  if (searchParams?.lang === "en" || searchParams?.lang === "ko") {
    console.log("🔗 Language from searchParams:", searchParams.lang);
    return searchParams.lang;
  }

  // 3. Accept-Language 헤더 확인
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
      console.log("🌐 Language from Accept-Language:", "ko");
      return "ko";
    }
  }

  // 4. 기본값: 영어
  console.log("🔤 Language fallback:", "en");
  return "en";
}
