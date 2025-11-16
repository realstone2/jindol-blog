"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLanguageCookie } from "app/actions/language";

export function LanguageSwitcher({ lang }: { lang: "ko" | "en" }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentLang = lang;

  const handleLanguageChange = (newLang: "ko" | "en") => {
    if (newLang !== currentLang) {
      // Cookie에 언어 설정 저장
      setLanguageCookie(newLang).then(() => {
        startTransition(() => {
          // 페이지 새로고침하여 새 언어로 렌더링
          router.refresh();
        });
      });
    }
  };

  return (
    <div className="relative inline-block">
      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value as "ko" | "en")}
        disabled={isPending}
        className="px-3 py-1.5 pr-8 text-sm font-medium text-[#3E3028] bg-white/30 hover:bg-white/50 backdrop-blur-sm border border-white/20 rounded-lg transition-all duration-200 disabled:opacity-50 cursor-pointer appearance-none"
        style={{
          boxShadow: "0 2px 8px 0 rgba(139, 99, 76, 0.08)",
        }}
      >
        <option value="ko">한국어 (Korean)</option>
        <option value="en">English</option>
      </select>
      <div
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 0,
          height: 0,
          borderLeft: "4px solid transparent",
          borderRight: "4px solid transparent",
          borderTop: "5px solid #3E3028",
        }}
      />
    </div>
  );
}
