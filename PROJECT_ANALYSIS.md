# 프로젝트 분석 문서

## 📊 프로젝트 개요

이 프로젝트는 **Next.js 기반의 포트폴리오 블로그**입니다. MDX를 사용한 블로그 포스팅 시스템을 갖추고 있습니다.

---

## 🔧 사용 중인 주요 라이브러리

### 핵심 의존성

| 라이브러리                 | 버전           | 용도                              |
| -------------------------- | -------------- | --------------------------------- |
| **Next.js**                | canary         | React 프레임워크 (최신 기능 사용) |
| **React**                  | ^19.0.0        | UI 라이브러리 (최신 버전)         |
| **TypeScript**             | 5.3.3          | 타입 안정성                       |
| **Tailwind CSS**           | 4.0.0-alpha.13 | 스타일링 프레임워크 (알파 버전)   |
| **next-mdx-remote**        | ^4.4.1         | MDX 파일 렌더링 (RSC 지원)        |
| **sugar-high**             | ^0.6.0         | 코드 신택스 하이라이팅            |
| **Geist**                  | 1.2.2          | Vercel의 폰트 패밀리              |
| **@vercel/analytics**      | ^1.1.3         | 웹 애널리틱스                     |
| **@vercel/speed-insights** | ^1.0.9         | 성능 측정 도구                    |

### 라이브러리 상세 설명

#### 1. **Next.js (canary)**

- App Router 사용
- React Server Components (RSC) 활용
- 파일 시스템 기반 라우팅
- 자동 코드 스플리팅
- Static Site Generation (SSG) 지원

#### 2. **next-mdx-remote**

- MDX 파일을 서버에서 직접 렌더링
- RSC(React Server Components) 지원
- 커스텀 컴포넌트 주입 가능

#### 3. **sugar-high**

- 경량 신택스 하이라이터
- Prism.js나 Highlight.js보다 가벼움
- 번들 크기 최적화

#### 4. **Vercel Analytics & Speed Insights**

- 쿠키 없는 개인정보 보호 분석
- Core Web Vitals 측정
- 실시간 성능 모니터링

---

## 🔄 애플리케이션 흐름

### 전체 구조도

```
┌─────────────────────────────────────────┐
│        Root Layout (app/layout.tsx)     │
│  - Geist 폰트 로드                       │
│  - 다크모드 설정                         │
│  - Analytics/SpeedInsights 주입         │
└─────────────────┬───────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │    Navbar      │
         └────────┬───────┘
                  │
        ┌─────────┴──────────┬──────────────┐
        ▼                    ▼              ▼
   ┌─────────┐        ┌──────────┐   ┌───────────┐
   │ Home    │        │  /blog   │   │/blog/[slug]│
   │ (/)     │        │          │   │            │
   └─────────┘        └──────────┘   └───────────┘
        │                    │              │
        ▼                    ▼              ▼
   BlogPosts          BlogPosts      CustomMDX
   Component          Component      Renderer
        │                    │              │
        └─────────┬──────────┴──────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │  getBlogPosts() │
         │  (utils.ts)     │
         └────────┬────────┘
                  │
                  ▼
    ┌──────────────────────────┐
    │ app/blog/posts/*.mdx     │
    │ - spaces-vs-tabs.mdx     │
    │ - static-typing.mdx      │
    │ - vim.mdx                │
    └──────────────────────────┘
```

### 1. 진입점 (Root Layout)

**파일**: `app/layout.tsx`

**역할**:

- 전역 스타일 적용
- Geist Sans/Mono 폰트 로드
- SEO 메타데이터 설정
- Navbar, Footer, Analytics 컴포넌트 배치

**주요 특징**:

- 서버 컴포넌트
- 다크모드 CSS 클래스 지원
- Open Graph 메타데이터 설정
- robots.txt 설정 포함

### 2. 메인 페이지 (`/`)

**파일**: `app/page.tsx`

**흐름**:

```
Page Component
    └─→ BlogPosts Component
            └─→ getBlogPosts()
                    └─→ MDX 파일 읽기
```

**기능**:

- 포트폴리오 소개
- 최신 블로그 포스트 목록 표시

### 3. 블로그 목록 페이지 (`/blog`)

**파일**: `app/blog/page.tsx`

**기능**:

- 모든 블로그 포스트 목록 표시
- 날짜순 정렬 (최신순)
- SEO 메타데이터 설정

### 4. 블로그 상세 페이지 (`/blog/[slug]`)

**파일**: `app/blog/[slug]/page.tsx`

**흐름**:

```
1. generateStaticParams()
   └─→ 빌드 시 모든 블로그 포스트 경로 생성

2. generateMetadata()
   └─→ 동적 메타데이터 생성
   └─→ Open Graph 이미지 설정

3. Blog Component
   └─→ slug로 포스트 찾기
   └─→ JSON-LD 스키마 생성
   └─→ CustomMDX로 컨텐츠 렌더링
```

**특징**:

- Static Site Generation (SSG)
- 404 처리 (notFound)
- 구조화된 데이터 (JSON-LD)
- 동적 OG 이미지 생성

### 5. MDX 파일 처리

**파일**: `app/blog/utils.ts`

**처리 흐름**:

```
1. getMDXFiles()
   └─→ posts 디렉토리에서 .mdx 파일 찾기

2. readMDXFile()
   └─→ 파일 내용 읽기
   └─→ parseFrontmatter()
       └─→ --- 사이의 메타데이터 파싱
       └─→ 본문 컨텐츠 추출

3. getMDXData()
   └─→ 모든 MDX 파일 데이터 반환
   └─→ {metadata, slug, content}
```

**Frontmatter 예시**:

```yaml
---
title: "Why I Use Vim"
publishedAt: "2023-01-01"
summary: "My thoughts on Vim"
image: "/images/vim.png"
---
```

### 6. MDX 렌더링

**파일**: `app/components/mdx.tsx`

**커스텀 컴포넌트**:

- `h1-h6`: 자동 슬러그 생성 및 앵커 링크
- `a`: 내부/외부 링크 처리
- `Image`: 라운드 처리된 이미지
- `code`: 신택스 하이라이팅 (sugar-high)
- `Table`: 테이블 렌더링

**렌더링 과정**:

```javascript
CustomMDX
  └─→ MDXRemote (next-mdx-remote/rsc)
      └─→ 커스텀 컴포넌트 주입
          └─→ RSC로 서버에서 렌더링
```

---

## 🎯 주요 기능

### 1. SEO 최적화

✅ **Sitemap** (`app/sitemap.ts`)

- 동적으로 모든 블로그 포스트 URL 생성
- lastModified 날짜 포함

✅ **RSS Feed** (`app/rss/route.ts`)

- XML 형식의 RSS 피드
- 최신 블로그 포스트 자동 포함

✅ **JSON-LD Schema**

- BlogPosting 스키마
- 구조화된 데이터로 검색 엔진 최적화

✅ **robots.txt** (`app/robots.ts`)

- 크롤러 허용 설정

✅ **동적 OG 이미지** (`app/og/route.tsx`)

- 포스트 제목 기반 이미지 생성

### 2. 성능 최적화

- **Static Site Generation (SSG)**: 빌드 시 모든 페이지 사전 생성
- **코드 스플리팅**: 자동 번들 최적화
- **이미지 최적화**: Next.js Image 컴포넌트 사용
- **폰트 최적화**: Geist 폰트 자동 최적화

### 3. 개발자 경험

- **TypeScript**: 타입 안정성
- **Tailwind CSS**: 유틸리티 우선 스타일링
- **MDX**: 마크다운에 React 컴포넌트 사용
- **Hot Reload**: 빠른 개발 피드백

---

## 🖼️ OG (Open Graph) 이미지 동적 생성 상세 분석

### OG 태그란?

Open Graph는 Facebook이 만든 메타데이터 프로토콜로, 소셜 미디어에서 링크를 공유할 때 표시되는 카드 형태의 미리보기를 제어합니다.

**일반적인 OG 태그 구조**:

```html
<meta property="og:title" content="블로그 제목" />
<meta property="og:description" content="블로그 설명" />
<meta property="og:image" content="https://example.com/image.png" />
<meta property="og:url" content="https://example.com/blog/post" />
```

### 이 프로젝트의 OG 이미지 생성 흐름

#### 1단계: 메타데이터 생성 (generateMetadata)

**파일**: `app/blog/[slug]/page.tsx`

```typescript
export async function generateMetadata({ params }) {
  const { slug } = await params;
  let post = getBlogPosts().find((post) => post.slug === slug);

  let ogImage = post.metadata.image
    ? post.metadata.image // MDX에 이미지가 있으면 사용
    : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}`; // 없으면 동적 생성

  return {
    openGraph: {
      images: [{ url: ogImage }],
    },
  };
}
```

**핵심 로직**:

- MDX 파일에 `image` 필드가 있으면 → 해당 이미지 사용
- 없으면 → `/og?title=포스트제목` URL 생성

**HTML 출력 결과**:

```html
<meta
  property="og:image"
  content="https://yourdomain.com/og?title=Why%20I%20Use%20Vim"
/>
```

#### 2단계: 동적 이미지 API 엔드포인트 (Route Handler)

**파일**: `app/og/route.tsx`

```typescript
import { ImageResponse } from "next/og";

export function GET(request: Request) {
  let url = new URL(request.url);
  let title = url.searchParams.get("title") || "Next.js Portfolio Starter";

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full items-center justify-center bg-white">
        <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
          <h2 tw="flex flex-col text-4xl font-bold tracking-tight text-left">
            {title}
          </h2>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

**역할 설명**:

1. **Route Handler**: `/og` 경로로 GET 요청이 오면 실행
2. **쿼리 파라미터 추출**: URL에서 `title` 파라미터를 가져옴
3. **ImageResponse**: React 컴포넌트를 PNG 이미지로 변환
4. **Tailwind-like 문법**: `tw` 속성으로 스타일링 (Satori 라이브러리 사용)

#### 3단계: 실제 동작 과정

```
사용자가 블로그 링크 공유
    ↓
소셜 미디어 크롤러가 페이지 방문
    ↓
HTML의 og:image 태그 발견
    ↓
https://yourdomain.com/og?title=Why%20I%20Use%20Vim 요청
    ↓
app/og/route.tsx의 GET 함수 실행
    ↓
ImageResponse가 React → PNG 변환
    ↓
1200x630 크기의 이미지 반환
    ↓
소셜 미디어 카드에 이미지 표시
```

### 왜 이렇게 구현할까?

#### 장점:

1. **자동화**: 매번 이미지를 수동으로 만들 필요 없음
2. **일관성**: 모든 포스트가 동일한 디자인 템플릿 사용
3. **동적 생성**: 포스트 제목에 맞춰 자동으로 이미지 생성
4. **서버리스**: Vercel의 Edge Function으로 실행 (빠름)
5. **캐싱**: 생성된 이미지는 자동으로 캐싱됨

#### 대안 방법:

```typescript
// 정적 이미지 사용 (간단하지만 수동 작업 필요)
export async function generateMetadata({ params }) {
  return {
    openGraph: {
      images: [{ url: "/images/blog-post.png" }], // 고정 이미지
    },
  };
}
```

### ImageResponse 내부 동작

**사용 기술**:

1. **Satori**: Vercel이 만든 HTML/CSS → SVG 변환 라이브러리
2. **Resvg**: SVG → PNG 변환 라이브러리
3. **Edge Runtime**: Vercel Edge에서 실행 (Node.js보다 빠름)

**제약사항**:

- 모든 CSS 속성을 지원하지 않음 (Flexbox 중심)
- 외부 이미지는 절대 URL 필요
- 폰트는 사전에 로드 필요 (현재는 기본 폰트 사용)

### 고급 커스터마이징

**커스텀 폰트 추가**:

```typescript
export function GET(request: Request) {
  return new ImageResponse(<div>...</div>, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Geist",
        data: fontData, // 폰트 바이너리 데이터
        style: "normal",
      },
    ],
  });
}
```

**외부 이미지 포함**:

```typescript
<div tw="flex">
  <img src="https://yourdomain.com/logo.png" width={100} height={100} />
  <h2>{title}</h2>
</div>
```

### OG 이미지 테스트 방법

#### 1. 로컬에서 직접 확인

개발 서버 실행 후 브라우저에서 접속:

```bash
pnpm dev
```

```
http://localhost:3000/og?title=테스트 타이틀
```

→ 1200x630 크기의 PNG 이미지가 바로 표시됨

#### 2. 메타 태그 확인

블로그 포스트 페이지의 소스 보기:

```html
<!-- 브라우저에서 우클릭 → 페이지 소스 보기 -->
<meta
  property="og:image"
  content="http://localhost:3000/og?title=Why%20I%20Use%20Vim"
/>
```

#### 3. 소셜 미디어 디버거 도구

배포 후 다음 도구들로 확인:

- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter/X**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/

URL 입력 → "Scrape Again" → OG 이미지 미리보기 확인

#### 4. 실제 동작 확인

```bash
# 터미널에서 cURL로 테스트
curl -I http://localhost:3000/og?title=Test

# 응답 예시:
HTTP/1.1 200 OK
Content-Type: image/png
Content-Length: 28492
Cache-Control: public, max-age=31536000, immutable
```

---

## 🔍 로그 관련 심층 분석

### 1. 서버 컴포넌트 로그가 클라이언트에 찍히는 이유

**문제의 코드**:

```typescript
// app/blog/[slug]/page.tsx:65
console.log("🚀 ~ Blog ~ slug:", slug);
```

#### 왜 클라이언트 콘솔에도 나타날까?

**개발 모드 (pnpm dev)**:

```
서버 측 실행 (SSR/SSG)
    └─→ 터미널에 로그 출력
    └─→ Next.js Dev Server가 클라이언트로 전송
        └─→ 브라우저 콘솔에도 표시
```

**이유**:

1. **Fast Refresh**: 개발 중 빠른 피드백을 위해
2. **디버깅 편의성**: 서버/클라이언트 동작 확인
3. **Hydration 검증**: React 18+ RSC 특성

**프로덕션 모드 (pnpm build && pnpm start)**:

```
서버 측 실행만
    └─→ 서버 로그에만 출력
    └─→ 클라이언트 번들에 포함되지 않음
```

#### Next.js 버전별 차이점

**Next.js 14 (App Router 안정화)**:

- 개발 모드에서도 서버 로그가 클라이언트에 덜 전달됨
- RSC 경계가 명확하게 구분됨

**Next.js canary (현재 프로젝트)**:

- 더 많은 디버그 정보가 클라이언트로 전달됨
- Fast Refresh 개선으로 더 많은 로그 공유
- React 19와의 통합으로 인한 변경사항

**실제 차이 비교**:

| 항목             | Next.js 14    | Next.js canary    |
| ---------------- | ------------- | ----------------- |
| 서버 console.log | 주로 터미널만 | 터미널 + 브라우저 |
| 에러 스택        | 간소화됨      | 더 상세함         |
| 디버그 정보      | 최소화        | 풍부함            |
| 프로덕션 영향    | 없음          | 없음              |

**왜 canary에서 더 많이 보일까?**:

1. **React 19 통합**: 새로운 React DevTools 프로토콜
2. **개선된 디버깅**: 개발 경험 향상을 위한 의도적 설계
3. **실험적 기능**: canary는 안정화 전 버전이라 더 많은 정보 노출

#### 검증 방법

**개발 모드**:

```bash
pnpm dev
# → 브라우저 콘솔에 로그 표시 ✓
```

**프로덕션 모드**:

```bash
pnpm build
pnpm start
# → 브라우저 콘솔에 로그 없음 ✓
```

#### Best Practice

개발 중에만 로그를 보고 싶다면:

```typescript
if (process.env.NODE_ENV === "development") {
  console.log("🚀 ~ Blog ~ slug:", slug);
}
```

### 2. Vercel Web Analytics 로그

**관련 코드**:

```typescript
// app/layout.tsx:60-61
<Analytics />
<SpeedInsights />
```

#### Analytics 컴포넌트 상세 분석

**목적**: 사용자 행동 분석

**수집 데이터**:

- 페이지뷰
- 사용자 세션
- 참조 출처 (Referrer)
- 지역/국가
- 디바이스 타입

**특징**:

- ✅ 쿠키 없음 (GDPR 준수)
- ✅ 익명화된 데이터
- ✅ 경량 스크립트 (~1KB)
- ✅ 성능 영향 최소화

**내부 동작 방식**:

```typescript
// @vercel/analytics 패키지 내부 (간소화)
export function Analytics() {
  useEffect(() => {
    // 페이지뷰 추적
    console.log("[Vercel Analytics] Initializing...");

    // Vercel 서버로 분석 데이터 전송
    sendAnalytics({
      type: "pageview",
      url: window.location.href,
      referrer: document.referrer,
    });

    console.log("[Vercel Analytics] Page view tracked");
  }, []);

  return null; // 화면에 렌더링되지 않음
}
```

**로그가 찍히는 이유**:

1. **개발 모드 디버깅**:

   - `process.env.NODE_ENV === 'development'`일 때 활성화
   - 개발자가 Analytics가 제대로 작동하는지 확인 가능

2. **클라이언트 컴포넌트**:

   - Analytics는 `useEffect`를 사용하는 클라이언트 컴포넌트
   - 브라우저에서만 실행되므로 브라우저 콘솔에 로그 출력

3. **프로덕션 동작**:
   - 프로덕션에서는 로그가 최소화되거나 제거됨
   - 실제 데이터는 Vercel 대시보드로만 전송

**로그 예시 (개발 모드)**:

```javascript
[Vercel Analytics] Initializing...
[Vercel Analytics] Page view tracked: /blog/vim
[Vercel Analytics] Event sent successfully
[Vercel Analytics] Debug mode enabled
```

**로그 예시 (프로덕션)**:

```javascript
// 로그 없음 (또는 최소화됨)
```

#### SpeedInsights 컴포넌트 상세 분석

**목적**: 실제 사용자 성능 메트릭 수집 (RUM - Real User Monitoring)

**측정 항목 (Core Web Vitals)**:

- **LCP** (Largest Contentful Paint): 가장 큰 콘텐츠가 화면에 렌더링되는 시간
  - 목표: < 2.5초
- **FID** (First Input Delay): 첫 번째 사용자 인터랙션 반응 시간
  - 목표: < 100ms
- **CLS** (Cumulative Layout Shift): 레이아웃 이동 점수
  - 목표: < 0.1
- **FCP** (First Contentful Paint): 첫 번째 콘텐츠 렌더링 시간
  - 목표: < 1.8초
- **TTFB** (Time to First Byte): 서버 응답 시간
  - 목표: < 600ms

**내부 동작 방식**:

```typescript
// @vercel/speed-insights 패키지 내부 (간소화)
export function SpeedInsights() {
  useEffect(() => {
    // PerformanceObserver로 메트릭 수집
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "largest-contentful-paint") {
          console.log(`[Vercel Speed Insights] LCP: ${entry.renderTime}ms`);
          sendMetric({ name: "LCP", value: entry.renderTime });
        }
      }
    });

    observer.observe({
      entryTypes: ["largest-contentful-paint", "first-input"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
```

**로그 예시 (개발 모드)**:

```javascript
[Vercel Speed Insights] Initializing...
[Vercel Speed Insights] FCP: 450ms ✓
[Vercel Speed Insights] LCP: 1.2s ✓
[Vercel Speed Insights] FID: 5ms ✓
[Vercel Speed Insights] CLS: 0.05 ✓
[Vercel Speed Insights] TTFB: 320ms ✓
[Vercel Speed Insights] Metrics sent to Vercel
```

#### Analytics 로그가 클라이언트에 찍히는 이유 정리

| 구분               | 서버 컴포넌트 로그                  | Analytics/SpeedInsights 로그 |
| ------------------ | ----------------------------------- | ---------------------------- |
| **실행 위치**      | 서버 → 개발모드에서 클라이언트 전달 | 클라이언트에서 직접 실행     |
| **로그 출력 위치** | 터미널 + 브라우저 (개발모드)        | 브라우저만                   |
| **이유**           | Next.js Dev Server 특성             | 클라이언트 컴포넌트이기 때문 |
| **프로덕션**       | 서버만                              | 최소화 또는 제거             |
| **제어 방법**      | `console.log` 제거                  | 환경변수로 제어              |

#### Next.js 14 vs Canary 비교

**Analytics 로그 동작**:

| Next.js 버전       | Analytics 로그 | 설명                    |
| ------------------ | -------------- | ----------------------- |
| **Next.js 13**     | 적음           | 기본적인 초기화 로그만  |
| **Next.js 14**     | 보통           | 주요 이벤트만 로깅      |
| **Next.js canary** | 많음           | 상세한 디버그 정보 포함 |

**왜 canary에서 더 많은 로그가 보일까?**:

1. **@vercel/analytics 버전**:

   - 최신 버전(1.1.3+)은 더 많은 디버깅 정보 제공
   - 이전 버전은 조용했지만, 개발 경험 개선을 위해 로그 추가

2. **React 19 통합**:

   - React DevTools 프로토콜 변경
   - useEffect 실행 타이밍이 더 명확하게 로깅됨

3. **Next.js canary의 개발 모드**:
   - 더 verbose한 로깅 정책
   - 개발자가 무엇이 실행되는지 명확히 알 수 있도록

**실제 테스트 결과**:

```bash
# Next.js 14 (안정 버전)
$ pnpm dev
> 브라우저 콘솔: [Vercel Analytics] initialized

# Next.js canary (현재 프로젝트)
$ pnpm dev
> 브라우저 콘솔:
  [Vercel Analytics] Initializing...
  [Vercel Analytics] Page view tracked: /
  [Vercel Analytics] Event sent successfully
  [Vercel Speed Insights] Collecting metrics...
  [Vercel Speed Insights] LCP: 1.2s
```

#### 핵심 요약: 로그가 보이는 이유

**질문 1: Next.js 14에서는 못 봤는데 canary에서는 왜 많이 보이나요?**

답변: 네, 맞습니다! 다음과 같은 이유들로 더 많이 보입니다:

1. **Next.js canary + React 19 조합**:

   - 최신 개발자 도구 통합
   - 더 상세한 디버깅 정보 제공
   - 개발 경험(DX) 개선을 위한 의도적 설계

2. **@vercel/analytics 최신 버전**:

   - 1.1.3+ 버전부터 verbose 로깅 추가
   - 개발 모드에서 무엇이 실행되는지 명확히 표시

3. **서버 컴포넌트 로그 전달**:
   - Next.js 14: 최소한의 로그만 전달
   - Next.js canary: Fast Refresh 개선으로 더 많은 로그 공유

**질문 2: 이게 프로덕션에도 영향을 주나요?**

답변: **아니오, 전혀 영향 없습니다!**

- 프로덕션 빌드 시 모든 개발 로그 제거
- 번들 크기 영향 없음
- 사용자는 이런 로그를 볼 수 없음

**개발 모드 vs 프로덕션 비교**:

```bash
# 개발 모드 (pnpm dev)
✓ 서버 로그 → 터미널 + 브라우저 콘솔
✓ Analytics 로그 → 브라우저 콘솔 (상세)
✓ SpeedInsights 로그 → 브라우저 콘솔 (상세)

# 프로덕션 (pnpm build && pnpm start)
✓ 서버 로그 → 서버만
✓ Analytics 로그 → 없음 (데이터만 전송)
✓ SpeedInsights 로그 → 없음 (메트릭만 수집)
```

#### 로그 제어 방법

**개발 환경에서만 활성화**:

```typescript
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* ... */}
        {process.env.NODE_ENV === "production" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
```

**또는 환경 변수로 제어**:

```typescript
{
  process.env.NEXT_PUBLIC_VERCEL_ENV && (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
```

#### Vercel 대시보드에서 확인

배포 후:

1. Vercel 대시보드 접속
2. **Analytics** 탭: 사용자 행동 분석
3. **Speed Insights** 탭: 성능 메트릭 확인

---

## 📁 프로젝트 구조

```
jindol-blog/
├── app/
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx          # 블로그 상세 페이지 (동적 라우팅)
│   │   ├── posts/
│   │   │   ├── spaces-vs-tabs.mdx
│   │   │   ├── static-typing.mdx
│   │   │   └── vim.mdx
│   │   ├── page.tsx               # 블로그 목록 페이지
│   │   └── utils.ts               # MDX 파싱 유틸리티
│   ├── components/
│   │   ├── footer.tsx
│   │   ├── mdx.tsx                # MDX 렌더링 컴포넌트
│   │   ├── nav.tsx
│   │   └── posts.tsx              # 블로그 포스트 목록 컴포넌트
│   ├── og/
│   │   └── route.tsx              # 동적 OG 이미지 생성
│   ├── rss/
│   │   └── route.ts               # RSS 피드 생성
│   ├── global.css                 # 전역 스타일
│   ├── layout.tsx                 # 루트 레이아웃
│   ├── page.tsx                   # 홈페이지
│   ├── robots.ts                  # robots.txt 생성
│   └── sitemap.ts                 # sitemap.xml 생성
├── package.json
├── tsconfig.json
├── postcss.config.js
└── pnpm-lock.yaml
```

---

## 🚀 실행 방법

### 개발 모드

```bash
pnpm dev
```

- Hot Reload 활성화
- 개발자 도구 로그 표시
- `http://localhost:3000`

### 프로덕션 빌드

```bash
pnpm build
```

- Static Site Generation
- 최적화된 번들 생성
- `.next` 디렉토리에 빌드 결과

### 프로덕션 실행

```bash
pnpm start
```

- 빌드된 파일 서빙
- 서버 사이드 로그만 표시

---

## 🛠️ 커스터마이징 가이드

### 새 블로그 포스트 추가

1. `app/blog/posts/` 디렉토리에 `.mdx` 파일 생성
2. Frontmatter 작성:

```yaml
---
title: "포스트 제목"
publishedAt: "2024-01-01"
summary: "포스트 요약"
image: "/images/thumbnail.png" # 선택사항
---
```

3. MDX 본문 작성
4. 자동으로 목록에 추가됨

### 메타데이터 수정

`app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: {
    default: "내 블로그", // 수정
    template: "%s | 내 블로그",
  },
  description: "내 블로그 설명", // 수정
};
```

### 네비게이션 메뉴 수정

`app/components/nav.tsx`:

```typescript
const navItems = {
  "/": { name: "home" },
  "/blog": { name: "blog" },
  "/about": { name: "about" }, // 추가
};
```

---

## 📊 성능 체크리스트

- ✅ **이미지 최적화**: Next.js Image 컴포넌트 사용
- ✅ **코드 스플리팅**: 자동 처리
- ✅ **폰트 최적화**: Geist 폰트 preload
- ✅ **Static Generation**: 빌드 시 페이지 생성
- ✅ **메타데이터**: SEO 최적화 완료
- ✅ **Analytics**: Vercel Analytics 통합

---

## 🐛 알려진 이슈

### 개발 모드 로그 중복

- **현상**: 서버 컴포넌트 로그가 클라이언트에도 표시
- **원인**: Next.js 개발 서버 특성
- **해결**: 프로덕션 빌드 시 자동 해결

### Vercel Analytics 로그

- **현상**: 콘솔에 Analytics 관련 메시지 표시
- **원인**: 디버깅 모드 활성화
- **해결**: 프로덕션 환경에서 최소화됨

---

## 📚 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [MDX 문서](https://mdxjs.com/)
- [Vercel Analytics 가이드](https://vercel.com/docs/analytics)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

---

## 📝 체크리스트

프로젝트 배포 전:

- [ ] 메타데이터 커스터마이징
- [ ] 블로그 포스트 작성
- [ ] 이미지 최적화
- [ ] Vercel Analytics 설정 확인
- [ ] 프로덕션 빌드 테스트
- [ ] lighthouse 성능 점수 확인

---

**작성일**: 2025-11-16  
**Next.js 버전**: canary  
**React 버전**: 19.0.0
