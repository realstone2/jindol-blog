# PRD-07: GitHub 댓글 기능 (Giscus)

## 📋 개요

GitHub Discussions 기반 댓글 시스템을 블로그에 통합하여 사용자와의 소통 및 피드백 수집 기능 제공

---

## 🎯 배경 및 필요성

### 목적
- 사용자와의 소통
- 피드백 수집

### 선택 기술: Giscus
- **장점**:
  - 무료
  - GitHub 계정으로 인증
  - Markdown 지원
  - 모더레이션 용이
  - 데이터 소유권 유지

---

## 📝 기능 요구사항

- **FR-7.1**: 각 블로그 포스트 하단에 댓글 섹션 표시
- **FR-7.2**: GitHub 계정으로 로그인 후 댓글 작성
- **FR-7.3**: 다국어 UI 지원 (한국어/영어)
- **FR-7.4**: 다크모드 지원
- **FR-7.5**: 댓글 알림 (GitHub Notifications 활용)

---

## 🔧 기술 요구사항

- **TR-7.1**: `@giscus/react` 패키지 사용
- **TR-7.2**: GitHub 저장소에 Discussions 활성화
- **TR-7.3**: Giscus App 설치 및 설정

---

## 🔧 설치 단계

### 1. GitHub 저장소 설정

```bash
# Repository Settings
1. Settings → General → Features
2. ✅ Discussions 체크
3. Discussions 탭 생성 확인
```

### 2. Giscus App 설치

```
1. https://github.com/apps/giscus 방문
2. Install → 저장소 선택
3. 권한 승인
```

### 3. Giscus 설정

```
1. https://giscus.app/ko 방문
2. 저장소 입력: username/repo-name
3. 매핑 방식 선택: pathname
4. 카테고리: Announcements
5. 테마: preferred_color_scheme
6. 생성된 스크립트 복사
```

---

## 💻 컴포넌트 구현

```tsx
// app/components/Comments.tsx
'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

export function Comments() {
  const { theme } = useTheme();
  
  return (
    <Giscus
      repo="username/repo-name"
      repoId="R_xxx"
      category="Announcements"
      categoryId="DIC_xxx"
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme === 'dark' ? 'dark' : 'light'}
      lang="ko"
      loading="lazy"
    />
  );
}
```

---

## 🔗 블로그 포스트 페이지 통합

```tsx
// app/[lang]/blog/[slug]/page.tsx
import { Comments } from '@/app/components/Comments';

export default async function BlogPost({ params }) {
  const { lang, slug } = await params;
  const post = await getPost(slug, lang);
  
  return (
    <article>
      <CustomMDX source={post.content} />
      
      <hr className="my-8" />
      
      <section>
        <h2>댓글</h2>
        <Comments />
      </section>
    </article>
  );
}
```

---

## 🌐 다국어 지원

```tsx
// 언어별 댓글 UI
const giscusLang = lang === 'ko' ? 'ko' : 'en';

<Giscus
  lang={giscusLang}
  // ... other props
/>
```

---

## ⚠️ 에러 처리

- **Giscus 로드 실패**: 폴백 UI 표시
  ```tsx
  <Suspense fallback={<div>댓글을 불러오는 중...</div>}>
    <Comments />
  </Suspense>
  ```

---

## 🔐 환경 변수

```env
# Giscus 설정 (선택사항, 컴포넌트에 직접 입력 가능)
GISCUS_REPO=username/repo
GISCUS_REPO_ID=R_xxx
GISCUS_CATEGORY=Announcements
GISCUS_CATEGORY_ID=DIC_xxx
```

---

## 📊 Giscus Props 설명

| Prop | 설명 | 예시 |
|------|------|------|
| `repo` | GitHub 저장소 (owner/repo) | `"username/repo-name"` |
| `repoId` | 저장소 ID (Giscus에서 제공) | `"R_xxx"` |
| `category` | Discussions 카테고리 | `"Announcements"` |
| `categoryId` | 카테고리 ID | `"DIC_xxx"` |
| `mapping` | 매핑 방식 | `"pathname"` |
| `reactionsEnabled` | 반응 버튼 활성화 | `"1"` |
| `theme` | 테마 | `"light"` / `"dark"` |
| `lang` | 언어 | `"ko"` / `"en"` |

---

## 🔗 관련 문서

- [다국어 지원](./PRD-04-i18n.md) - 언어별 댓글 UI
- [조회수 기록 시스템](./PRD-08-view-counter.md) - 사용자 인터랙션

---

**작성일**: 2025-11-16  
**버전**: 1.0



