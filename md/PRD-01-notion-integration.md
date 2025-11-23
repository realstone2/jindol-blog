# PRD-01: 노션 API 통합 + 자동 번역 (빌드 타임)

## 📋 개요

빌드 타임에 노션 API를 호출하여 데이터베이스의 Published 페이지를 가져오고, MDX/Markdown 형식으로 변환하여 로컬 파일로 저장하는 기능. Gemini API를 사용하여 자동으로 영어 번역 버전도 생성.

---

## 🎯 배경 및 필요성

### 현재 상황

- 로컬 MDX 파일 직접 편집 → Git 커밋 필요
- 문제점:
  - 비개발자 기여 어려움
  - 콘텐츠 작성과 코드 변경이 혼재
  - 버전 관리의 복잡성

### 개선 방향

노션에서 콘텐츠 작성 → 빌드 시 자동 동기화

---

## 📝 기능 요구사항

- **FR-1.1**: 빌드 타임에 노션 API 호출하여 데이터베이스의 모든 페이지 가져오기
- **FR-1.2**: 노션 블록을 MDX/Markdown 형식으로 변환 (content 컬럼의 본문)
- **FR-1.3**: 변환된 데이터를 `app/blog/posts/` 디렉토리에 자동 저장
- **FR-1.4**: 노션 페이지의 속성(title, createDate, tag)을 Frontmatter로 변환
- **FR-1.5**: 한국어 포스트를 Gemini API로 자동 영어 번역 (선택 기능)
- **FR-1.6**: 각 포스트는 `{slug}.ko.mdx`와 `{slug}.en.mdx` 두 버전 생성

---

## 🔧 기술 요구사항

- **TR-1.1**: `@notionhq/client` 패키지 사용
- **TR-1.2**: `@google/generative-ai` 패키지 사용 (자동 번역용)
- **TR-1.3**: 노션 데이터베이스 ID 환경 변수 관리
- **TR-1.4**: 노션 API 토큰 보안 처리 (빌드 환경 변수)
- **TR-1.5**: Gemini API 키 환경 변수 관리 (선택)
- **TR-1.6**: 빌드 스크립트에 `prebuild` 훅 추가
- **TR-1.7**: 번역 캐싱으로 중복 번역 방지

---

## 📊 데이터 매핑

### 노션 데이터베이스 스키마

```
Properties:
- title (제목) → title
- content (본문) → 페이지 블록에서 가져옴
- tag (태그) → tags
- createDate (생성일) → publishedAt
```

**참고**:

- `content` 컬럼은 페이지 본문 블록에서 직접 가져옵니다
- `slug`는 제목에서 자동 생성됩니다
- `summary`는 빈 문자열로 설정됩니다 (필요시 추가 가능)
- `language`는 기본값 "ko"로 설정되며, 자동 번역으로 영어 버전이 생성됩니다

### 변환 결과 (MDX)

```yaml
---
title: "블로그 제목"
publishedAt: "2024-01-01"
summary: ""
tags: ["React", "Next.js"]
language: "ko"
---
# 본문 내용
```

---

## 🔄 노션 블록 타입 변환 매핑

| 노션 블록 타입 | Markdown 변환            |
| -------------- | ------------------------ |
| Paragraph      | 일반 텍스트              |
| Heading 1      | `# 제목`                 |
| Heading 2      | `## 제목`                |
| Heading 3      | `### 제목`               |
| Bulleted List  | `- 항목`                 |
| Numbered List  | `1. 항목`                |
| Code           | ` ```언어\n코드\n``` `   |
| Quote          | `> 인용`                 |
| Image          | `![alt](url)`            |
| Toggle         | Collapse 컴포넌트로 변환 |
| Callout        | Alert 컴포넌트로 변환    |

---

## 🔄 구현 흐름

```
빌드 시작 (pnpm build)
    ↓
prebuild 스크립트 실행
    ↓
1. 노션 API 호출 (모든 페이지, createDate 기준 정렬)
    ↓
2. 각 페이지의 블록 데이터 가져오기 (content 컬럼의 본문)
    ↓
3. 노션 블록 → Markdown 변환
    ↓
4. 메타데이터 추출 (title, tag, createDate)
    ↓
5. 한국어 버전 생성: app/blog/posts/{slug}.ko.mdx
    ↓
6. Gemini API로 영어 번역 (GEMINI_API_KEY 있는 경우)
    ↓
7. 영어 버전 생성: app/blog/posts/{slug}.en.mdx
    ↓
8. 번역 캐시 업데이트 (.translation-cache.json)
    ↓
Next.js 빌드 진행
```

---

## 💻 구현 예시

### 스크립트 구조

```typescript
// scripts/sync-notion.ts
import { Client } from "@notionhq/client";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function syncNotion() {
  // 1. 데이터베이스에서 Published 페이지만 가져오기
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Status",
      select: {
        equals: "Published",
      },
    },
  });

  // 2. 각 페이지 처리
  for (const page of response.results) {
    const slug = getSlug(page);
    const blocks = await getPageBlocks(page.id);
    const markdown = convertToMarkdown(blocks);
    const frontmatter = extractFrontmatter(page);

    // 3. MDX 파일 저장
    const content = `---\n${frontmatter}\n---\n\n${markdown}`;
    const filePath = join(process.cwd(), "app", "blog", "posts", `${slug}.mdx`);
    await writeFile(filePath, content, "utf-8");
  }
}

syncNotion().catch(console.error);
```

---

## ⚠️ 에러 처리

- **노션 API 호출 실패**: 기존 로컬 파일 사용 (fallback)
- **변환 실패**: 에러 로그 출력 및 해당 포스트 스킵
- **Rate Limit**: 재시도 로직 (exponential backoff)

---

## 🔗 관련 문서

- [노션 데이터 → Markdown 파싱](./PRD-06-notion-parsing.md) - 상세 파싱 로직
- [GitHub 저장소 데이터 관리](./PRD-02-github-sync.md) - 자동 커밋
- [노션 이미지 → S3 업로드](./PRD-05-s3-images.md) - 이미지 처리

---

**작성일**: 2025-11-16  
**버전**: 2.0 (자동 번역 기능 추가)
