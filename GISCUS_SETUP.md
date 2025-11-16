# Giscus 댓글 설정 가이드

이 문서는 jindol-blog에 Giscus 댓글 시스템을 설정하는 방법을 안내합니다.

## 📋 사전 준비

1. GitHub 저장소가 **Public**이어야 합니다
2. GitHub 저장소에 **Discussions** 기능이 활성화되어야 합니다

---

## 🔧 1단계: GitHub Discussions 활성화

1. GitHub 저장소 페이지로 이동
2. **Settings** → **General** → **Features**
3. **Discussions** 체크박스 활성화
4. **Discussions** 탭이 생성되었는지 확인

---

## 🔧 2단계: Giscus App 설치

1. https://github.com/apps/giscus 방문
2. **Install** 버튼 클릭
3. 블로그 저장소 선택
4. 권한 승인

---

## 🔧 3단계: Giscus 설정값 생성

1. https://giscus.app/ko 방문
2. 아래 정보를 입력:

### 저장소 정보
```
username/repository-name
예: yeojinseok/jindol-blog
```

### 매핑 방식
- **pathname** 선택 (권장)
  - 각 페이지 URL 경로에 따라 댓글이 매핑됩니다

### Discussion 카테고리
- **Announcements** 선택 (권장)
  - 새 댓글이 자동으로 Discussion으로 생성됩니다

### 테마
- **light** 선택
  - Apple Glass UI 디자인과 조화를 이룹니다

### 언어
- 한국어(ko) 또는 영어(en)
  - 블로그에서 자동으로 언어를 전환합니다

---

## 🔧 4단계: 환경변수 설정

Giscus 설정 페이지에서 생성된 값들을 확인하고 환경변수에 추가합니다.

### `.env.local` 파일 생성

```bash
# Giscus 댓글 설정
NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDOxxxxxxx
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOxxxxxxx
```

### 값 찾는 방법

1. **repo**: GitHub 저장소 이름 (`username/repo`)
2. **repoId**: Giscus 설정 페이지에서 자동 생성
3. **category**: Discussion 카테고리 이름 (보통 "Announcements")
4. **categoryId**: Giscus 설정 페이지에서 자동 생성

---

## 📝 Giscus 설정 페이지 예시

Giscus 설정을 완료하면 아래와 같은 스크립트가 생성됩니다:

```html
<script src="https://giscus.app/client.js"
        data-repo="your-username/your-repo"
        data-repo-id="R_kgDOxxxxxxx"
        data-category="Announcements"
        data-category-id="DIC_kwDOxxxxxxx"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="light"
        data-lang="ko"
        crossorigin="anonymous"
        async>
</script>
```

이 값들을 환경변수에 입력하면 됩니다.

---

## ✅ 테스트

1. 환경변수 설정 후 개발 서버 재시작:
   ```bash
   pnpm dev
   ```

2. 블로그 포스트 페이지로 이동

3. 페이지 하단에 댓글 섹션이 표시되는지 확인

4. GitHub 계정으로 로그인하여 댓글 작성 테스트

---

## 🌐 다국어 지원

블로그는 자동으로 언어에 따라 댓글 UI를 전환합니다:

- 한국어 사용자: "💬 댓글" + 한국어 Giscus UI
- 영어 사용자: "💬 Comments" + 영어 Giscus UI

언어는 Cookie 기반으로 관리되며, 네비게이션의 언어 스위처로 변경할 수 있습니다.

---

## 🎨 디자인 특징

댓글 섹션은 블로그의 Apple Glass UI 디자인 시스템을 따릅니다:

- **Glassmorphism**: backdrop-blur와 반투명 배경
- **웜톤 베이지 색상**: 블로그 전체 테마와 일치
- **라운딩**: 24px (rounded-3xl)
- **그림자**: 웜톤 다층 그림자
- **넉넉한 여백**: 16px ~ 48px

---

## 🔔 알림 설정

GitHub Discussions에 새 댓글이 작성되면:

1. GitHub Notifications에 알림이 도착합니다
2. Repository의 Discussions 탭에서 확인 가능
3. 이메일 알림 설정 가능 (GitHub Settings)

---

## ⚠️ 문제 해결

### 댓글이 표시되지 않는 경우

1. **저장소가 Public인지 확인**
2. **Discussions가 활성화되었는지 확인**
3. **Giscus App이 설치되었는지 확인**
4. **환경변수가 올바른지 확인** (.env.local)
5. **개발 서버를 재시작** (`pnpm dev`)

### "Error: Bad credentials" 오류

- repoId 또는 categoryId가 잘못되었을 가능성
- Giscus 설정 페이지에서 값을 다시 확인

### 댓글이 다른 페이지와 섞이는 경우

- mapping을 "pathname"으로 설정했는지 확인
- 각 페이지의 URL이 고유한지 확인

---

## 📚 관련 문서

- [PRD-07: GitHub 댓글 기능](./PRD-07-comments.md)
- [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) - Apple Glass UI 디자인 시스템
- [Giscus 공식 문서](https://giscus.app)

---

**작성일**: 2025-11-16  
**최종 수정**: 2025-11-16

