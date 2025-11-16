# PRD: 블로그 고도화 프로젝트

## 📋 프로젝트 개요

### 목적

현재 로컬 MDX 파일 기반 블로그를 노션 기반 CMS로 전환하고, 다국어 지원, 이미지 최적화, 사용자 인터랙션 기능을 추가하여 프로덕션 레벨의 블로그 시스템 구축

### 배경

- 현재 시스템: 로컬 MDX 파일 기반 (app/blog/posts/\*.mdx)
- 문제점:
  - 콘텐츠 작성/관리가 코드 저장소에 의존적
  - 다국어 지원 부재
  - 이미지 관리의 한계
  - 사용자 인터랙션 기능 부족

### 목표

- 노션을 콘텐츠 관리 도구로 활용
- 빌드 타임 자동화로 성능 유지
- 다국어 지원으로 글로벌 사용자 경험 향상
- 조회수, 댓글 등 인터랙션 기능 추가

---

## 🎯 핵심 기능 목록

### 1. [노션 API 통합 (빌드 타임)](./PRD-01-notion-integration.md)

빌드 타임에 노션 API를 호출하여 콘텐츠를 가져오고 MDX 형식으로 변환

### 2. [GitHub 저장소 데이터 관리](./PRD-02-github-sync.md)

노션에서 가져온 데이터를 GitHub 저장소에 자동 커밋하여 버전 관리 및 백업

### 3. [Gemini API 자동 번역](./PRD-03-gemini-translation.md)

빌드 타임에 영어 번역이 없는 한국어 포스트를 자동으로 번역

### 4. [다국어 지원 (i18n)](./PRD-04-i18n.md)

사용자 언어에 따라 한국어/영어 콘텐츠 자동 표시

### 5. [노션 이미지 → S3 업로드](./PRD-05-s3-images.md)

노션 이미지 URL 만료 문제 해결을 위해 S3에 업로드하고 URL 교체

### 6. [노션 데이터 → Markdown 파싱](./PRD-06-notion-parsing.md)

노션의 다양한 블록 타입을 Markdown/MDX 형식으로 정확히 변환

### 7. [GitHub 댓글 기능 (Giscus)](./PRD-07-comments.md)

GitHub Discussions 기반 댓글 시스템 통합

### 8. [조회수 기록 시스템](./PRD-08-view-counter.md)

Upstash Redis를 사용한 실시간 조회수 집계 및 인기 포스트 추적

---

## 📐 시스템 아키텍처

### 전체 흐름도

```
┌─────────────────────────────────────────────────────────────┐
│                      빌드 타임 (CI/CD)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │   1. 노션 API 호출 (Published 페이지)      │
        └──────────────┬───────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────────┐
        │   2. 노션 블록 → Markdown 변환             │
        └──────────────┬───────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────────┐
        │   3. 이미지 추출 → S3 업로드 → URL 교체    │
        └──────────────┬───────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────────┐
        │   4. 영어 번역 필요 여부 확인              │
        └──────────────┬───────────────────────────┘
                       │
                       ▼ (if needed)
        ┌──────────────────────────────────────────┐
        │   5. Gemini API로 영어 번역               │
        └──────────────┬───────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────────┐
        │   6. MDX 파일 저장 (ko/ 및 en/)           │
        └──────────────┬───────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────────┐
        │   7. Git 커밋 & 푸시                      │
        └──────────────┬───────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────────┐
        │   8. Next.js 빌드 (Static Generation)    │
        └──────────────┬───────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────────┐
        │   9. Vercel 배포                          │
        └──────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      런타임 (사용자 요청)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │   사용자가 /blog/my-post 접속             │
        └──────────────┬───────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────────┐
        │   Middleware: 언어 감지                   │
        │   → /ko/ 또는 /en/ 리다이렉트             │
        └──────────────┬───────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────────┐
        │   정적 페이지 제공 (SSG)                  │
        └──────────────┬───────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────────┐
        │   클라이언트: ViewCounter 컴포넌트         │
        │   → /api/views/[slug] POST 호출           │
        └──────────────┬───────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────────┐
        │   Redis: 조회수 증가 (중복 체크)          │
        └──────────────┬───────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────────┐
        │   Giscus: 댓글 로드 (GitHub Discussions)  │
        └──────────────────────────────────────────┘
```

### 외부 서비스 의존성

| 서비스            | 목적             | 필수 여부 | 무료 플랜 제한             |
| ----------------- | ---------------- | --------- | -------------------------- |
| **Notion API**    | 콘텐츠 소스      | ✅ 필수   | 무제한 (개인 워크스페이스) |
| **AWS S3**        | 이미지 저장      | ✅ 필수   | 5GB 스토리지 (12개월)      |
| **Gemini API**    | 번역             | ✅ 필수   | 60 RPM (무료)              |
| **Upstash Redis** | 조회수 저장      | ✅ 필수   | 10K commands/day           |
| **GitHub**        | 코드 저장 + 댓글 | ✅ 필수   | 무제한 (public repo)       |
| **Vercel**        | 호스팅 + 빌드    | ✅ 필수   | 100GB bandwidth/month      |
| **CloudFront**    | CDN (이미지)     | ❌ 선택   | 1TB 전송/month (12개월)    |

---

## 📊 데이터 흐름

### 1. 콘텐츠 작성 → 배포 흐름

```
노션에서 블로그 포스트 작성
    ↓
Status를 "Published"로 변경
    ↓
GitHub Actions (6시간마다 또는 수동 트리거)
    ↓
노션 API로 변경된 페이지 감지
    ↓
변경된 페이지만 Markdown 변환
    ↓
이미지 S3 업로드
    ↓
번역 필요 시 Gemini API 호출
    ↓
Git 커밋 & 푸시
    ↓
Vercel 자동 빌드 & 배포 (3-5분)
    ↓
사용자에게 새 포스트 노출
```

### 2. 사용자 요청 흐름

```
사용자가 example.com/blog/my-post 접속
    ↓
Vercel Edge Middleware 실행
    ↓
Accept-Language 헤더 확인
    ↓
한국어 사용자 → /ko/blog/my-post
기타 사용자 → /en/blog/my-post
    ↓
정적 페이지 반환 (CDN 캐싱)
    ↓
ViewCounter 컴포넌트 hydration
    ↓
/api/views/my-post POST 요청
    ↓
Redis에 조회수 증가
    ↓
Giscus 스크립트 로드
    ↓
GitHub Discussions에서 댓글 가져오기
```

---

## 🗂️ 파일 구조 (변경 후)

```
jindol-blog/
├── app/
│   ├── [lang]/                        # 다국어 라우팅
│   │   ├── blog/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   └── views/
│   │       └── [slug]/
│   │           └── route.ts           # 조회수 API
│   ├── blog/
│   │   ├── posts/
│   │   │   ├── ko/                    # 한국어 포스트
│   │   │   │   ├── my-post.mdx
│   │   │   │   └── another-post.mdx
│   │   │   └── en/                    # 영어 포스트
│   │   │       ├── my-post.mdx
│   │   │       └── another-post.mdx
│   │   └── utils.ts                   # 다국어 버전 포함
│   ├── components/
│   │   ├── Comments.tsx               # Giscus 댓글
│   │   ├── ViewCounter.tsx            # 조회수
│   │   ├── LanguageSwitcher.tsx       # 언어 전환
│   │   ├── mdx.tsx                    # MDX 컴포넌트 (Callout, Details 추가)
│   │   └── ...
│   ├── middleware.ts                  # 언어 감지 미들웨어
│   └── ...
├── scripts/
│   ├── sync-notion.ts                 # 노션 동기화 스크립트
│   ├── translate.ts                   # Gemini 번역 스크립트
│   ├── upload-images.ts               # S3 이미지 업로드
│   └── notion-to-markdown.ts          # 노션 파서
├── lib/
│   ├── notion.ts                      # 노션 클라이언트
│   ├── s3.ts                          # S3 클라이언트
│   ├── gemini.ts                      # Gemini 클라이언트
│   └── redis.ts                       # Redis 클라이언트
├── .github/
│   └── workflows/
│       └── sync-notion.yml            # GitHub Actions
├── .env.local
├── package.json
└── README.md
```

---

## 🛠️ 기술 스택

### 기존

- Next.js (canary)
- React 19
- TypeScript
- Tailwind CSS 4
- next-mdx-remote
- Vercel (호스팅)

### 추가

- **CMS**: Notion API (`@notionhq/client`)
- **번역**: Gemini API (`@google/generative-ai`)
- **이미지**: AWS S3 (`@aws-sdk/client-s3`), Sharp (최적화)
- **조회수**: Upstash Redis (`@upstash/redis`)
- **댓글**: Giscus (`@giscus/react`)
- **i18n**: next-intl 또는 커스텀 미들웨어
- **CI/CD**: GitHub Actions

---

## 📦 새로운 패키지

```json
{
  "dependencies": {
    "@notionhq/client": "^2.2.15",
    "@google/generative-ai": "^0.2.1",
    "@aws-sdk/client-s3": "^3.478.0",
    "@upstash/redis": "^1.28.0",
    "@giscus/react": "^3.0.0",
    "notion-to-md": "^3.1.1",
    "sharp": "^0.33.1",
    "crypto": "^1.0.1"
  },
  "scripts": {
    "sync:notion": "tsx scripts/sync-notion.ts",
    "translate": "tsx scripts/translate.ts",
    "upload:images": "tsx scripts/upload-images.ts",
    "prebuild": "pnpm sync:notion && pnpm translate && pnpm upload:images"
  }
}
```

---

## 🔐 환경 변수

```env
# Notion
NOTION_API_KEY=secret_xxx
NOTION_DATABASE_ID=xxx

# AWS S3
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
S3_BUCKET_NAME=blog-images
CLOUDFRONT_DOMAIN=xxx.cloudfront.net  # 선택

# Gemini
GEMINI_API_KEY=xxx

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# Giscus (프론트엔드에서 사용, NEXT_PUBLIC_ 불필요)
GISCUS_REPO=username/repo
GISCUS_REPO_ID=R_xxx
GISCUS_CATEGORY=Announcements
GISCUS_CATEGORY_ID=DIC_xxx

# 기타
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

---

## 📅 개발 일정 (추정)

### Phase 1: 기반 구축 (2주)

- [ ] 노션 API 통합
- [ ] 노션 → Markdown 파서 구현
- [ ] 기본 빌드 스크립트 작성
- [ ] GitHub Actions 워크플로우 설정

### Phase 2: 이미지 & 번역 (1.5주)

- [ ] S3 이미지 업로드 구현
- [ ] 이미지 최적화 (Sharp)
- [ ] Gemini API 번역 구현
- [ ] 번역 캐싱 로직

### Phase 3: 다국어 지원 (1주)

- [ ] 라우팅 구조 변경 (`/[lang]/`)
- [ ] 언어 감지 미들웨어
- [ ] 언어 전환 UI
- [ ] SEO 메타데이터 (hreflang)

### Phase 4: 인터랙션 기능 (1주)

- [ ] Giscus 댓글 통합
- [ ] Upstash Redis 설정
- [ ] 조회수 API 구현
- [ ] ViewCounter 컴포넌트

### Phase 5: 테스트 & 배포 (1주)

- [ ] 단위 테스트 작성
- [ ] E2E 테스트 (Playwright)
- [ ] 성능 최적화
- [ ] 프로덕션 배포
- [ ] 모니터링 설정

**총 예상 기간**: **6.5주** (약 1.5개월)

---

## ✅ 성공 기준

### 기능적 기준

1. ✅ 노션에서 작성한 포스트가 6시간 내 블로그에 반영됨
2. ✅ 모든 노션 블록 타입이 정확히 렌더링됨
3. ✅ 한국어 포스트의 영어 번역이 자동 생성됨
4. ✅ 사용자 언어에 따라 올바른 버전 표시
5. ✅ 이미지가 만료되지 않고 정상 표시됨
6. ✅ 댓글 작성 및 알림 수신 가능
7. ✅ 조회수가 정확히 집계됨

### 비기능적 기준

1. ✅ Lighthouse 성능 점수 90+ 유지
2. ✅ 빌드 시간 5분 이내
3. ✅ 노션 API 호출 실패 시 기존 데이터 사용 (가용성 99%+)
4. ✅ S3 이미지 로딩 속도 < 1초
5. ✅ 조회수 API 응답 시간 < 200ms

---

## 🚨 위험 요소 및 대응 방안

### 1. 노션 API Rate Limit

- **위험**: 많은 페이지를 동시에 가져올 때 제한 초과
- **대응**:
  - 변경된 페이지만 동기화 (last_edited_time 체크)
  - 배치 처리 + 재시도 로직
  - 캐싱 전략

### 2. Gemini API 비용

- **위험**: 번역 요청이 많아지면 비용 발생
- **대응**:
  - 캐싱 (이미 번역된 콘텐츠는 재번역 안 함)
  - 변경 감지 (hash 기반)
  - 무료 플랜 한도 모니터링

### 3. S3 스토리지 비용

- **위험**: 이미지가 많아지면 비용 증가
- **대응**:
  - 이미지 최적화 (WebP, 압축)
  - 중복 이미지 제거 (hash 기반)
  - CloudFront 캐싱 활용

### 4. 빌드 시간 증가

- **위험**: 포스트가 많아지면 빌드 느려짐
- **대응**:
  - ISR (Incremental Static Regeneration) 고려
  - 변경된 페이지만 재빌드
  - 빌드 캐싱 최적화

### 5. 노션 장애

- **위험**: 노션 API 다운 시 빌드 실패
- **대응**:
  - 로컬 파일 Fallback
  - GitHub 저장소에 항상 최신 데이터 유지
  - 에러 알림 (Slack, Email)

---

## 📈 향후 확장 가능성

### 단기 (3개월)

- 검색 기능 (Algolia 또는 Pagefind)
- 태그 필터링 및 카테고리
- RSS 피드 다국어 지원
- 관련 포스트 추천

### 중기 (6개월)

- 뉴스레터 구독 (Resend 또는 Mailchimp)
- 다크모드 개선
- 읽기 시간 계산
- 목차(TOC) 자동 생성

### 장기 (1년)

- 풀텍스트 검색
- 사용자 커스텀 테마
- 포스트 북마크 기능
- PWA (Progressive Web App)

---

## 📝 참고 자료

### 공식 문서

- [Notion API](https://developers.notion.com/)
- [Gemini API](https://ai.google.dev/docs)
- [AWS S3 SDK](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)
- [Upstash Redis](https://upstash.com/docs/redis)
- [Giscus](https://giscus.app/)
- [Next.js i18n](https://nextjs.org/docs/app/building-your-application/routing/internationalization)

### 커뮤니티 리소스

- [Notion to Markdown Examples](https://github.com/souvikinator/notion-to-md)
- [Next.js + Notion Blog Template](https://github.com/transitive-bullshit/nextjs-notion-starter-kit)
- [Vercel KV Examples](https://vercel.com/docs/storage/vercel-kv)

---

## 🎯 결론

본 PRD는 기존 로컬 MDX 기반 블로그를 **노션 기반 CMS**, **다국어 지원**, **사용자 인터랙션 기능**을 갖춘 프로덕션 레벨 블로그로 전환하기 위한 상세 계획을 담고 있습니다.

### 핵심 가치

1. **편의성**: 노션에서 편하게 콘텐츠 작성
2. **글로벌화**: 자동 번역으로 영어권 사용자 확보
3. **안정성**: GitHub + S3로 데이터 이중화
4. **인터랙션**: 댓글, 조회수로 사용자 참여 유도
5. **성능**: 빌드 타임 처리로 런타임 성능 유지

### 다음 단계

1. 팀 리뷰 및 피드백 수집
2. Phase 1 개발 착수
3. 주간 진행 상황 체크인
4. 베타 배포 및 테스트

---

**작성일**: 2025-11-16  
**작성자**: AI Assistant  
**버전**: 1.0  
**상태**: Draft
