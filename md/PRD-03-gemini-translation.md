# PRD-03: Gemini API 자동 번역 (빌드 타임)

## 📋 개요

빌드 타임에 한국어 포스트 중 영어 번역이 없는 포스트를 감지하고, Gemini API를 사용하여 자동으로 영어 버전을 생성하는 기능

---

## 🎯 배경 및 필요성

### 현재 상황

- 한국어 콘텐츠만 존재
- 문제점: 글로벌 사용자 접근성 부족

### 개선 방향

AI 번역으로 영어 버전 자동 생성

---

## 📝 기능 요구사항

- **FR-3.1**: 한국어 포스트 중 영어 번역이 없는 포스트 감지
- **FR-3.2**: Gemini API를 사용하여 Markdown 형식 유지하며 번역
- **FR-3.3**: 번역된 내용을 `app/blog/posts/en/{slug}.mdx`에 저장
- **FR-3.4**: Frontmatter도 함께 번역 (title, summary)
- **FR-3.5**: 코드 블록, 이미지 URL, 링크는 번역하지 않음

---

## 🔧 기술 요구사항

- **TR-3.1**: `@google/generative-ai` 패키지 사용
- **TR-3.2**: Gemini API 키 환경 변수 관리
- **TR-3.3**: 번역 캐싱으로 중복 번역 방지
- **TR-3.4**: Rate limit 처리 (최대 60 RPM)

---

## 📝 번역 프롬프트

````
You are a professional technical translator.

Task: Translate the following Korean blog post to English.

Requirements:
1. Keep all Markdown syntax intact (##, -, `, etc.)
2. Do NOT translate:
   - Code blocks (content inside ``` ```)
   - URLs and links
   - Image alt text
   - Technical terms (keep original or use standard English terms)
3. Maintain the same tone and style
4. Translate frontmatter fields: title, summary
5. Keep tags in English if they're already in English

Original Content (Korean):
---
{content}
---

Translated Content (English):
````

---

## 🔄 번역 흐름

```
빌드 시작
    ↓
1. app/blog/posts/ko/ 디렉토리 스캔
    ↓
2. 각 포스트의 slug 추출
    ↓
3. app/blog/posts/en/{slug}.mdx 존재 여부 확인
    ↓
4. 없으면 번역 대상에 추가
    ↓
5. Gemini API로 배치 번역 (병렬 처리)
    ↓
6. 번역 결과 검증 (Markdown 문법 체크)
    ↓
7. app/blog/posts/en/{slug}.mdx 저장
    ↓
8. .translation-cache.json 업데이트
```

---

## 💾 번역 캐시 구조

```json
{
  "cache": {
    "my-post": {
      "sourceHash": "abc123...",
      "translatedAt": "2024-01-01T00:00:00Z",
      "translatedBy": "gemini-pro"
    }
  }
}
```

---

## 💻 구현 예시

```typescript
// scripts/translate.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { createHash } from "crypto";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function translatePosts() {
  const koDir = join(process.cwd(), "app", "blog", "posts", "ko");
  const enDir = join(process.cwd(), "app", "blog", "posts", "en");

  const koFiles = await readdir(koDir);

  for (const file of koFiles) {
    if (!file.endsWith(".mdx")) continue;

    const slug = file.replace(".mdx", "");
    const enPath = join(enDir, file);

    // 영어 버전이 이미 있으면 스킵
    try {
      await readFile(enPath);
      continue;
    } catch {
      // 파일이 없으면 번역 진행
    }

    // 한국어 포스트 읽기
    const koContent = await readFile(join(koDir, file), "utf-8");

    // Gemini API로 번역
    const prompt = `Translate the following Korean blog post to English...\n\n${koContent}`;
    const result = await model.generateContent(prompt);
    const translated = result.response.text();

    // 영어 버전 저장
    await writeFile(enPath, translated, "utf-8");
  }
}

translatePosts().catch(console.error);
```

---

## ⚠️ 에러 처리

- **API 호출 실패**: 재시도 3회, 실패 시 스킵 및 로그
- **번역 결과 오류**: Markdown 문법 검증 실패 시 원본 유지
- **Rate Limit**: 대기 후 재시도

---

## 🔗 관련 문서

- [다국어 지원](./PRD-04-i18n.md) - 번역된 콘텐츠 표시
- [GitHub 저장소 데이터 관리](./PRD-02-github-sync.md) - 번역 파일 커밋

---

**작성일**: 2025-11-16  
**버전**: 2.0 (구현 완료)

---

## ✅ 구현 상태

- ✅ **FR-3.1**: 한국어 포스트 중 영어 번역이 없는 포스트 감지
- ✅ **FR-3.2**: Gemini API를 사용하여 Markdown 형식 유지하며 번역
- ✅ **FR-3.3**: 번역된 내용을 `app/blog/posts/en/{slug}.mdx`에 저장
- ✅ **FR-3.4**: Frontmatter도 함께 번역 (title, summary)
- ✅ **FR-3.5**: 코드 블록, 이미지 URL, 링크는 번역하지 않음

### 구현 파일

- `scripts/translate.ts` - Gemini API 번역 유틸리티
- `scripts/sync-notion.ts` - 노션 동기화 + 자동 번역 통합
- `.translation-cache.json` - 번역 캐시 (Git ignore)

### 사용 방법

```bash
# 노션 동기화 + 자동 번역
pnpm sync-notion

# 환경 변수
GEMINI_API_KEY=your_key_here  # 선택사항
```
