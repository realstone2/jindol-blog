"use server";

import { cookies } from "next/headers";

/**
 * 언어 설정을 Cookie에 저장하는 Server Action
 * @param lang - 'ko' 또는 'en'
 */
export async function setLanguageCookie(lang: "ko" | "en") {
  const cookieStore = await cookies();

  // NEXT_LOCALE 쿠키에 언어 설정 저장
  cookieStore.set("NEXT_LOCALE", lang, {
    maxAge: 31536000, // 1년 (60 * 60 * 24 * 365)
    path: "/",
    sameSite: "lax",
  });
}

