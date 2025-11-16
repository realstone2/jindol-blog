# 노션 API 통합 + 자동 번역 설정 가이드

## 📋 개요

이 가이드는 노션 데이터베이스와 블로그를 연동하고, Gemini API를 사용한 자동 번역을 설정하는 방법을 안내합니다.

---

## 🔑 1단계: 노션 통합(Integration) 만들기

### 1.1 노션 통합 페이지 접속

1. [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations) 접속
2. **"+ New integration"** 버튼 클릭

### 1.2 통합 설정

- **Name**: `jindol-blog` (원하는 이름)
- **Associated workspace**: 블로그 데이터베이스가 있는 워크스페이스 선택
- **Type**: Internal Integration
- **Capabilities**:
  - ✅ Read content
  - ✅ Read user information (선택사항)
  - ⬜ Update content (필요 없음)
  - ⬜ Insert content (필요 없음)

### 1.3 API 키 복사

생성 후 나오는 **"Internal Integration Token"**을 복사합니다.
- 형식: `secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- ⚠️ **이 키는 절대 Git에 커밋하지 마세요!**

---

## 📊 2단계: 노션 데이터베이스 준비

### 2.1 데이터베이스 속성 설정

블로그 포스트를 관리할 노션 데이터베이스에 다음 속성을 추가하세요:

| 속성 이름 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| **title** | Title | ✅ | 블로그 제목 |
| **content** | Text | ✅ | 블로그 본문 (페이지 블록에서 가져옴) |
| **tag** | Multi-select | 선택 | 태그 (예: React, Next.js) |
| **createDate** | Date | 선택 | 생성 날짜 (없으면 자동 생성) |

**참고**:
- `content` 컬럼은 페이지 본문 블록에서 직접 가져오므로, 실제로는 페이지 내부에 콘텐츠를 작성하면 됩니다
- `slug`는 제목에서 자동 생성됩니다
- `language`는 기본값 "ko"로 설정되며, 자동 번역으로 영어 버전이 생성됩니다
- 모든 페이지가 자동으로 동기화됩니다 (Status 필터 없음)

### 2.2 데이터베이스 ID 확인

1. 노션에서 데이터베이스를 **전체 페이지로 열기**
2. 브라우저 URL 확인:
   ```
   https://www.notion.so/{workspace}/{database_id}?v={view_id}
   ```
3. `database_id` 부분을 복사 (32자리 영숫자)
   - 예: `a1b2c3d4e5f6789012345678901234ab`

### 2.3 데이터베이스에 통합 연결

1. 데이터베이스 페이지 우측 상단 **⋯ (더보기)** 클릭
2. **"Add connections"** 선택
3. 앞서 만든 통합 (`jindol-blog`) 선택
4. **"Confirm"** 클릭

---

## 🤖 3단계: Gemini API 설정 (선택 - 자동 번역용)

### 3.1 Google AI Studio에서 API 키 발급

1. **[Google AI Studio](https://aistudio.google.com/app/apikey) 접속**
2. **"Get API Key"** 또는 **"Create API Key"** 클릭
3. 프로젝트 선택 (없으면 새로 생성)
4. API 키 생성 및 복사
   - 형식: `AIzaSy...` (약 39자)

### 3.2 Gemini API 키 보안 주의사항

⚠️ **Gemini API는 선택 사항입니다**:
- API 키가 있으면: 한국어 → 영어 자동 번역 (`.ko.mdx`, `.en.mdx` 생성)
- API 키가 없으면: 한국어 버전만 생성 (`.ko.mdx`만 생성)

✅ **무료 할당량**:
- Gemini 2.0 Flash: 분당 15개 요청 (무료)
- 블로그 포스트 번역에 충분

### 3.3 번역 캐시 시스템

번역된 내용은 `.translation-cache.json`에 캐시됩니다:
- 같은 내용은 재번역하지 않음
- 비용 절감 및 빌드 시간 단축
- Git에 커밋되지 않음 (`.gitignore` 설정)

---

## 🔐 4단계: 환경 변수 설정

### 4.1 로컬 개발 환경

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# .env.local

# 노션 API (필수)
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=a1b2c3d4e5f6789012345678901234ab

# Gemini API (선택 - 자동 번역용)
GEMINI_API_KEY=AIzaSy...xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4.2 프로덕션 환경 (Vercel)

1. [Vercel Dashboard](https://vercel.com) 접속
2. 프로젝트 선택 → **Settings** → **Environment Variables**
3. 다음 변수 추가:

| Name | Value | Environment | 필수 여부 |
|------|-------|-------------|----------|
| `NOTION_API_KEY` | `secret_xxx...` | Production, Preview, Development | ✅ 필수 |
| `NOTION_DATABASE_ID` | `a1b2c3d4...` | Production, Preview, Development | ✅ 필수 |
| `GEMINI_API_KEY` | `AIzaSy...` | Production, Preview, Development | 선택 (번역용) |

### 4.3 보안 주의사항

✅ **안전한 관리 방법**:
- `.env.local` 파일은 Git에 커밋되지 않음 (`.gitignore` 설정됨)
- Vercel 환경 변수는 암호화되어 저장됨
- API 키는 팀원과 안전한 방법으로만 공유 (1Password, 슬랙 시크릿 메시지 등)

❌ **절대 하지 말아야 할 것**:
- API 키를 코드에 직접 작성
- `.env.local` 파일을 Git에 커밋
- API 키를 공개 채널에 공유

---

## 🚀 5단계: 패키지 설치 및 실행

### 5.1 패키지 설치

```bash
pnpm install
```

패키지 설치가 안 되는 경우:
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 5.2 노션 동기화 + 번역 테스트

```bash
# 노션 → MDX 동기화 + 자동 번역 실행
pnpm sync-notion
```

**성공 시 생성되는 파일**:
- `app/blog/posts/{slug}.ko.mdx` - 한국어 버전
- `app/blog/posts/{slug}.en.mdx` - 영어 버전 (GEMINI_API_KEY 설정 시)

**출력 예시**:
```
🚀 노션 동기화 시작

📥 노션에서 Published 페이지를 가져오는 중...
✅ 3개의 페이지를 가져왔습니다.

📝 페이지를 MDX로 변환하는 중...

  📝 처리 중: 첫 번째 블로그 포스트 (first-post)
  ✅ 한국어 저장: first-post.ko.mdx
  🌐 영어로 번역 중...
  ✅ 영어 저장: first-post.en.mdx

✨ 노션 동기화 완료!
📊 총 3개의 페이지를 동기화했습니다.
🌐 각 페이지는 한국어와 영어 버전으로 생성되었습니다.
```

### 5.3 빌드 (자동 동기화)

```bash
# 빌드 시 자동으로 노션 동기화 실행
pnpm build
```

`prebuild` 스크립트가 자동으로 노션을 동기화한 후 빌드를 진행합니다.

---

## 🌐 번역 동작 방식

### 자동 번역 프로세스

1. **노션에서 한국어로 작성**
2. **빌드 시 자동 처리**:
   - 한국어 포스트 생성 (`{slug}.ko.mdx`)
   - Gemini API로 영어 번역
   - 영어 포스트 생성 (`{slug}.en.mdx`)
3. **번역 캐시**:
   - `.translation-cache.json`에 저장
   - 내용 변경 시에만 재번역

### 번역 품질

Gemini API는 다음을 보존합니다:
- ✅ Markdown 문법 (제목, 리스트, 코드 블록 등)
- ✅ 코드 블록 내용 (번역 안 함)
- ✅ URL 및 링크
- ✅ 기술 용어

### 번역 비용

- **무료 할당량**: 월 60회 요청 (Gemini 2.0 Flash)
- **일반 블로그**: 월 5-10개 포스트 작성 시 무료 범위 내
- **캐시 활용**: 변경되지 않은 포스트는 재번역 안 함

---

## 🔍 트러블슈팅

### 에러: "object_not_found"

**원인**: 데이터베이스에 통합이 연결되지 않음

**해결**: 
1. 노션 데이터베이스 페이지에서 **⋯ → Add connections** 클릭
2. 통합 선택 후 연결

---

### 에러: "unauthorized"

**원인**: API 키가 잘못되었거나 만료됨

**해결**:
1. [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations) 에서 키 재확인
2. `.env.local` 파일의 `NOTION_API_KEY` 업데이트

---

### 에러: "validation_error"

**원인**: 데이터베이스 ID가 잘못됨

**해결**:
1. 데이터베이스를 **전체 페이지로 열기**
2. URL에서 32자리 ID 다시 확인 및 복사

---

### 동기화는 성공했는데 페이지가 없음

**원인**: 데이터베이스에 페이지가 없거나, 통합이 연결되지 않음

**해결**:
1. 노션 데이터베이스에 페이지가 있는지 확인
2. 데이터베이스에 통합이 연결되어 있는지 확인 (2.3 단계 참고)
3. `pnpm sync-notion` 다시 실행

---

### 번역이 안 되고 한국어 버전만 생성됨

**원인**: `GEMINI_API_KEY`가 설정되지 않음

**해결**:
1. [Google AI Studio](https://aistudio.google.com/app/apikey)에서 API 키 발급
2. `.env.local` 또는 Vercel 환경 변수에 추가
3. `pnpm sync-notion` 다시 실행

**참고**: 번역 없이 한국어만 사용해도 됩니다!

---

### 번역 에러: "Resource exhausted"

**원인**: Gemini API 할당량 초과

**해결**:
1. 잠시 기다렸다가 다시 실행 (분당 15회 제한)
2. 캐시 파일 확인: `.translation-cache.json` (이미 번역된 것은 스킵)
3. 필요 시 Google AI Studio에서 할당량 확인

---

### 번역된 내용이 이상함

**원인**: Gemini API 모델 응답 문제

**해결**:
1. `.translation-cache.json`에서 해당 포스트 삭제
2. `pnpm sync-notion` 재실행 (재번역됨)
3. 또는 `.en.mdx` 파일을 직접 수정

---

## 📝 워크플로우

### 개발 프로세스

```
1. 노션에서 블로그 작성
   ↓
2. Status를 "Published"로 변경
   ↓
3. 로컬에서 동기화 테스트
   $ pnpm sync-notion
   ↓
4. 로컬 서버에서 확인
   $ pnpm dev
   ↓
5. Git 커밋 & 푸시
   $ git add .
   $ git commit -m "feat: 새 블로그 포스트 추가"
   $ git push
   ↓
6. Vercel 자동 배포 (prebuild 실행)
```

### CI/CD (Vercel)

Vercel에 푸시하면 자동으로:
1. `prebuild` 스크립트 실행 → 노션 동기화
2. `build` 스크립트 실행 → Next.js 빌드
3. 배포 완료

---

## 🔗 관련 문서

- [Notion API 공식 문서](https://developers.notion.com/)
- [노션 통합 가이드](https://www.notion.so/help/create-integrations-with-the-notion-api)
- [PRD-01: 노션 API 통합](./PRD-01-notion-integration.md)

---

**작성일**: 2025-11-16

