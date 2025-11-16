# PRD-02: GitHub 저장소 데이터 관리

## 📋 개요

노션에서 가져온 데이터를 GitHub 저장소에 자동 커밋하여 버전 관리 및 백업을 수행하는 기능. GitHub Actions 워크플로우 또는 로컬에서 실행 가능.

---

## 🎯 배경 및 필요성

### 목적

- 노션이 단일 장애점(SPOF)이 되는 것 방지
- Git 기반 버전 관리 유지
- 빌드 성능 향상 (로컬 캐시)
- 오프라인 빌드 가능

---

## 📝 기능 요구사항

- **FR-2.1**: 노션 동기화 후 변경 사항을 GitHub 저장소에 커밋
- **FR-2.2**: 변경 사항이 있는 파일만 커밋 (diff 체크)
- **FR-2.3**: 자동 커밋 메시지 생성 (예: `chore: sync blog posts from Notion [2024-01-01]`)
- **FR-2.4**: GitHub Actions 워크플로우로 자동 실행 (6시간마다)
- **FR-2.5**: 로컬에서 수동 실행 가능

---

## 🔧 기술 요구사항

- **TR-2.1**: GitHub Actions 워크플로우 구성
- **TR-2.2**: 자동 커밋을 위한 Bot 계정 또는 GitHub App 토큰 사용
- **TR-2.3**: Git diff로 변경 사항 감지

---

## 🔄 GitHub Actions 워크플로우

```yaml
name: Sync Notion to GitHub

on:
  schedule:
    - cron: "0 */6 * * *" # 6시간마다 실행
  workflow_dispatch: # 수동 트리거 가능

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: pnpm install

      - name: Sync from Notion
        env:
          NOTION_API_KEY: ${{ secrets.NOTION_API_KEY }}
          NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID }}
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: pnpm sync-notion

      - name: Commit changes
        run: |
          git config user.name "notion-sync-bot"
          git config user.email "bot@example.com"
          git add app/blog/posts/
          git diff --staged --quiet || git commit -m "chore: sync blog posts from Notion [$(date +'%Y-%m-%d %H:%M')]"
          git push
```

---

## 📁 파일 구조

```
app/blog/posts/
├── my-post.ko.mdx        # 한국어 포스트
├── my-post.en.mdx        # 영어 포스트
├── another-post.ko.mdx
└── another-post.en.mdx

.translation-cache.json   # 번역 캐시
```

---

## 🔄 커밋 전략

- **변경 사항만 커밋**: Git diff로 실제 변경된 파일만 커밋
- **Batch 커밋**: 여러 포스트 변경을 하나의 커밋으로
- **메타데이터**: 커밋 메시지에 동기화 시간 및 변경 파일 수 포함

---

## 💻 구현 예시

### 동기화 캐시 구조

```json
{
  "lastSync": "2024-01-01T00:00:00Z",
  "pages": {
    "my-post": {
      "notionId": "abc123",
      "lastEdited": "2024-01-01T00:00:00Z",
      "slug": "my-post"
    }
  }
}
```

## 🚀 사용 방법

### 로컬에서 실행

```bash
# 1. 노션 동기화만
pnpm sync-notion

# 2. 커밋만 (동기화 후)
pnpm commit-notion

# 3. 동기화 + 커밋 한 번에
pnpm sync-and-commit
```

### GitHub Actions 워크플로우

1. **자동 실행**: 6시간마다 자동으로 실행
2. **수동 실행**: GitHub Actions 탭에서 "Sync Notion to GitHub" 워크플로우 선택 → "Run workflow" 클릭

### 환경 변수 설정

**로컬**:

```bash
# .env.local
NOTION_API_KEY=...
NOTION_DATABASE_ID=...
GEMINI_API_KEY=...  # 선택

# 자동 푸시 활성화 (선택)
GIT_PUSH=true
```

**GitHub Secrets**:

- `NOTION_API_KEY`
- `NOTION_DATABASE_ID`
- `GEMINI_API_KEY` (선택)

### 변경 감지 로직

```typescript
// scripts/git-commit.ts
// 1. app/blog/posts/ 디렉토리 스테이징
// 2. .translation-cache.json 스테이징
// 3. git diff --staged로 변경 사항 확인
// 4. 변경 사항이 있으면 커밋
// 5. GIT_PUSH=true 또는 CI 환경이면 자동 푸시
```

---

## ⚠️ 주의사항

- **GitHub Token**: GitHub Actions에서는 `GITHUB_TOKEN` 자동 사용 (추가 설정 불필요)
- **권한**: 워크플로우에 `contents: write` 권한 필요 (이미 설정됨)
- **보안**: API 키는 GitHub Secrets에 저장
- **로컬 푸시**: 로컬에서는 기본적으로 푸시하지 않음 (`GIT_PUSH=true` 설정 시에만)

---

## 🔗 관련 문서

- [노션 API 통합](./PRD-01-notion-integration.md) - 노션 동기화
- [Gemini API 자동 번역](./PRD-03-gemini-translation.md) - 번역 후 커밋

---

**작성일**: 2025-11-16  
**버전**: 1.0
