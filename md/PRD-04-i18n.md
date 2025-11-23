# PRD-04: 다국어 지원 (i18n)

## 📋 개요

사용자 브라우저 언어를 감지하여 한국어 사용자는 한국어 콘텐츠를, 그 외 사용자는 영어 콘텐츠를 자동으로 표시하는 기능

---

## 🎯 배경 및 필요성

### 목적

- 한국은 한국어, 그 외 국가는 영어로 자동 표시
- 전략: URL 기반 언어 구분 (`/ko/blog`, `/en/blog`)

---

## 📝 기능 요구사항

- **FR-4.1**: 사용자 브라우저 언어 감지 (Accept-Language 헤더)
- **FR-4.2**: 한국어(ko, ko-KR) → 한국어 콘텐츠, 그 외 → 영어 콘텐츠
- **FR-4.3**: 언어 전환 버튼 제공 (네비게이션 바)
- **FR-4.4**: URL에 언어 코드 포함 (`/blog/ko/slug`, `/blog/en/slug`)
- **FR-4.5**: SEO: hreflang 태그 자동 생성

---

## 🔧 기술 요구사항

- **TR-4.1**: Next.js의 i18n 라우팅 활용 또는 커스텀 미들웨어
- **TR-4.2**: `next-intl` 또는 `react-i18next` 패키지 사용 고려
- **TR-4.3**: 정적 생성 시 모든 언어 버전 사전 렌더링

---

## 🔄 라우팅 구조

```
현재: /blog/[slug]
변경: /[lang]/blog/[slug]

예시:
- /ko/blog/my-post → 한국어 버전
- /en/blog/my-post → 영어 버전
- /blog/my-post → 자동 리다이렉트 (언어 감지)
```

---

## 💻 언어 감지 로직

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 이미 언어 경로가 있으면 통과
  if (pathname.startsWith("/ko/") || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  // Accept-Language 헤더에서 언어 감지
  const acceptLanguage = request.headers.get("accept-language") || "";
  const isKorean = acceptLanguage.includes("ko");

  const locale = isKorean ? "ko" : "en";

  // 언어 경로로 리다이렉트
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
  matcher: ["/blog/:path*", "/"],
};
```

---

## 📊 SEO 메타데이터

```typescript
// app/[lang]/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const post = await getPost(slug, lang);

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      languages: {
        ko: `/ko/blog/${slug}`,
        en: `/en/blog/${slug}`,
        "x-default": `/en/blog/${slug}`,
      },
    },
  };
}
```

---

## 🎨 UI 컴포넌트

```tsx
// components/LanguageSwitcher.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const currentLang = pathname.startsWith("/ko/") ? "ko" : "en";

  const toggleLanguage = () => {
    const newLang = currentLang === "ko" ? "en" : "ko";
    const newPath = pathname.replace(`/${currentLang}/`, `/${newLang}/`);
    router.push(newPath);
  };

  return (
    <button onClick={toggleLanguage}>
      {currentLang === "ko" ? "English" : "한국어"}
    </button>
  );
}
```

---

## 🔄 파일 구조 변경

```
app/
├── [lang]/                    # 다국어 라우팅
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
└── middleware.ts              # 언어 감지
```

---

## 🔗 관련 문서

- [Gemini API 자동 번역](./PRD-03-gemini-translation.md) - 번역 생성
- [노션 API 통합](./PRD-01-notion-integration.md) - 다국어 콘텐츠 저장

---

**작성일**: 2025-11-16  
**버전**: 2.0 (구현 완료)

---

## ✅ 구현 상태

- ✅ **FR-4.1**: 사용자 브라우저 언어 감지 (Accept-Language 헤더)
- ✅ **FR-4.2**: 한국어(ko, ko-KR) → 한국어 콘텐츠, 그 외 → 영어 콘텐츠
- ✅ **FR-4.3**: 언어 전환 버튼 제공 (네비게이션 바)
- ✅ **FR-4.4**: URL 구조는 `/blog/{slug}` 유지 (언어는 `?lang=` 쿼리 파라미터로 처리)
- ✅ **FR-4.5**: SEO: hreflang 태그 자동 생성

### 구현 파일

- `app/lib/language.ts` - 언어 감지 (URL 파라미터 + Accept-Language 헤더)
- `app/components/language-switcher.tsx` - 언어 전환 버튼 (URL 파라미터 변경)
- `app/blog/utils.ts` - 언어별 파일 로드
- `app/blog/[slug]/page.tsx` - SEO 메타데이터 (hreflang, alternates)
- `app/blog/page.tsx` - 블로그 리스트 페이지 (언어별 제목)
- `app/page.tsx` - 홈페이지 (언어별 콘텐츠)
- `app/components/nav.tsx` - 네비게이션에 언어 버튼 통합
- `app/components/posts.tsx` - 블로그 포스트 링크에 언어 파라미터 추가

### 파일 구조

```
app/blog/posts/
├── ko/
│   └── {slug}.mdx  (한국어)
└── en/
    └── {slug}.mdx  (영어)
```

### 특징

- **URL**: `/blog/{slug}?lang=ko` 또는 `/blog/{slug}?lang=en` 형식
- **언어 자동 감지**:
  1. URL 쿼리 파라미터 (`?lang=ko` 또는 `?lang=en`) - 최우선
  2. Accept-Language 헤더 (브라우저 설정)
  3. 기본값: 한국어 (ko)
- **Fallback**: 해당 언어 없으면 다른 언어로 자동 전환
- **SEO**: hreflang 태그로 검색 엔진에 다국어 버전 알림
- **단순한 구조**: 쿠키 없이 URL 파라미터만으로 언어 관리
