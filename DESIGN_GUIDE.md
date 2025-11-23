# Design Guide - iPod Classic UI Style

이 문서는 jindol-blog의 디자인 시스템과 스타일 가이드를 정리한 문서입니다.

## 🎵 디자인 컨셉

**iPod Classic (5th Generation)** 의 아이코닉한 LCD 스크린 UI를 웹으로 재해석했습니다.  
2000년대 초반 Apple의 미니멀하고 직관적인 디자인 철학을 현대적으로 구현합니다.

### 핵심 특징

- **LCD 스크린 디스플레이**: 하얀 배경에 명확한 회색 테두리
- **헤더 통합 네비게이션**: 상단 헤더에 간략한 네비게이션 링크
- **블루 하이라이트**: 선택된 항목과 타이틀의 시그니처 블루 그라데이션
- **3D 볼록 효과**: 헤더와 선택된 항목의 입체적인 볼록 튀어나온 느낌
- **▶ 플레이 아이콘**: 게시글 리스트 항목의 마커
- **심플한 타이포그래피**: SF Pro Display 폰트를 사용한 깔끔한 텍스트
- **회색 톤 배경**: 아이팟 본체의 은색 메탈 느낌
- **스크롤 프로그래스바**: 하단 고정 재생 바 스타일

---

## 🎨 색상 시스템 (Color Palette)

### 아이팟 시그니처 블루

```css
--ipod-blue: #5e9ed6; /* 메인 블루 */
--ipod-blue-light: #6ba8e0; /* 밝은 블루 (그라데이션 시작) */
--ipod-blue-dark: #4a8ec4; /* 그라데이션 중간 */
--ipod-blue-darker: #3d7eb3; /* 어두운 블루 (그라데이션 끝) */
```

**그라데이션 적용:**
- 타이틀 영역: `from-[#6ba8e0] via-[#5e9ed6] to-[#3d7eb3]` (위아래 3단계)
- 선택된 메뉴 항목: 동일한 파란색 그라데이션
- 호버 효과: 동일한 파란색 그라데이션

### 그레이 스케일

```css
--ipod-text-primary: #1a1a1a; /* 메인 텍스트 */
--ipod-text-secondary: #333333; /* 보조 텍스트 */
--ipod-text-tertiary: #666666; /* 삼차 텍스트 */
--ipod-gray-light: #999999; /* 아이콘, 비활성 텍스트 */
```

### LCD 스크린 색상

```css
--lcd-bg: #ffffff; /* 하얀 배경 */
--lcd-content-bg: #f8f9fa; /* 콘텐츠 영역 */
--lcd-border: #d4d4d4; /* 메인 테두리 */
--lcd-border-dark: #b8b8b8; /* 진한 테두리 */
```

### 헤더 그라데이션

```css
--lcd-header: linear-gradient(to bottom, #f0f0f0, #e8e8e8, #d0d0d0);
/* 3단계 그라데이션으로 볼록 효과 */
```

### 배경 색상

```css
--ipod-bg: #e8e8e8 ~ #f0f0f0; /* 메인 배경 (메탈 실버) */
```

---

## 🪟 LCD Screen 컴포넌트 구조

### 기본 LCD 박스 구조

```tsx
<div className="bg-white rounded-2xl border-2 border-[#d4d4d4]">
  {/* 1. 상단 헤더 - 회색 그라데이션 (네비게이션 통합) */}
  <div className="bg-gradient-to-b from-[#f0f0f0] via-[#e8e8e8] to-[#d0d0d0] border-b border-[#b8b8b8] ipod-header-3d">
    <div className="px-5 py-1.5 flex items-center justify-between">
      {/* 왼쪽: 네비게이션 링크 */}
      <div className="flex items-center gap-3">
        <Link href="/">Home</Link>
        <Link href="/blog">Blog</Link>
      </div>
      {/* 오른쪽: 언어 변환 */}
      <LanguageSwitcher />
    </div>
  </div>

  {/* 2. 타이틀 - 파란색 그라데이션 (3D 효과) */}
  <div className="bg-gradient-to-b from-[#6ba8e0] via-[#5e9ed6] to-[#3d7eb3] px-6 py-4 border-b border-[#2a2a2a] ipod-title-3d">
    <h1 className="text-white">Title</h1>
  </div>

  {/* 3. 콘텐츠 - 밝은 회색 배경 */}
  <div className="bg-[#f8f9fa] px-6 py-5">Content</div>
</div>
```

### 그림자 효과

```css
/* LCD 박스 외부 그림자 */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8);

/* 헤더 3D 효과 */
box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.9),
  inset 0 -1px 0 rgba(0, 0, 0, 0.15), 0 2px 3px rgba(0, 0, 0, 0.12);

/* 타이틀 3D 효과 (어두운 배경용) */
box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.2),
  inset 0 -1px 0 rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3),
  0 1px 0 rgba(255, 255, 255, 0.1);

/* 선택된 메뉴 항목 3D 효과 */
box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.5),
  inset 0 -1px 0 rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2),
  0 1px 0 rgba(255, 255, 255, 0.3);
```

---

## 📱 컴포넌트별 스타일

### 1. Header - 네비게이션 통합 헤더

**구조:**
- 왼쪽: 네비게이션 링크 (Home, Blog)
- 오른쪽: 언어 변환기
- 회색 그라데이션 배경
- 3D 볼록 효과

**특징:**
```css
/* 헤더 배경 */
background: linear-gradient(to bottom, #f0f0f0, #e8e8e8, #d0d0d0);
padding: px-5 py-1.5;

/* 네비게이션 링크 */
text-xs font-semibold uppercase;
기본: text-[#666]
선택됨: text-[#5e9ed6]
호버: hover:text-[#5e9ed6]
```

### 2. 타이틀 영역 - 파란색 그라데이션

**구조:**
- 파란색 3단계 그라데이션 배경
- 흰색 텍스트
- 3D 볼록 효과

**특징:**
```css
/* 타이틀 배경 */
background: linear-gradient(to bottom, #6ba8e0, #5e9ed6, #3d7eb3);
padding: px-6 py-4;
border-bottom: border-[#2a2a2a];
클래스: ipod-title-3d
```

### 3. Blog Post List - iPod 플레이리스트 스타일

**구조:**
- 각 항목: ▶ + 제목 + 날짜 + 화살표
- 호버 시 전체 파란색 그라데이션 하이라이트
- 3D 볼록 효과

**특징:**
```css
/* 리스트 아이템 */
▶ text-[#5e9ed6]
title: font-bold text-[#1a1a1a]
date: text-xs text-[#666]

/* 호버 시 */
background: linear-gradient(to bottom, #6ba8e0, #5e9ed6, #3d7eb3)
all text: white
클래스: ipod-3d-hover (3D 효과 자동 적용)
```

### 4. Blog Post Detail - LCD 스크린 콘텐츠

**헤더 구조:**
1. 회색 헤더: 네비게이션 통합
2. 파란색 타이틀 바: 제목 (흰색 텍스트, 3D 효과)
3. 콘텐츠 영역: 본문 (#f8f9fa 배경)

**콘텐츠 스타일:**
- 본문: #1a1a1a
- 링크: #4a8ec4 (블루)
- 코드: 하얀 박스 + 회색 테두리
- 리스트: ▶ 블루 마커

### 5. Footer - iPod 설정 메뉴 스타일

**구조:**
- LCD 박스 형태
- 회색 그라데이션 배경 (헤더와 동일)
- 리스트 스타일 링크
- 3D 볼록 효과

### 6. 프로그래스바 - 하단 고정 재생 바

**구조:**
- 하단 고정 위치
- 제목과 시간 표시
- 파란색 그라데이션 진행 바
- GPU 가속 애니메이션 (transform 사용)

**특징:**
```css
/* 프로그래스바 */
position: fixed bottom-0
background: white
border-top: 2px solid #d4d4d4

/* 진행 바 */
background: linear-gradient(to right, #5e9ed6, #4a8ec4)
transform: scaleX(progress) /* GPU 가속 */

/* 핸들 */
transform: translateX(position) /* GPU 가속 */
```

---

## 📝 Typography

### 폰트 패밀리

```css
font-family: "SF Pro Display", "Roboto", -apple-system, BlinkMacSystemFont,
  "Segoe UI", "Helvetica Neue", Arial, sans-serif;
```

**특징:**
- **SF Pro Display**: 아이팟 LCD의 명확한 가독성 재현
- **Font Weight**: 400 (일반), 500 (미디엄), 600 (세미볼드), 700 (볼드)
- **Antialiasing**: 선명한 렌더링

### 크기 체계

```css
/* 헤더 */
h1: text-xl md:text-2xl lg:text-3xl (20px ~ 30px), font-bold
h2: text-xl (20px), font-bold
h3: text-lg (18px), font-semibold
h4: text-base (16px), font-semibold

/* 본문 */
body: text-base (16px), line-height: 1.7
small: text-xs (12px), font-medium
```

### 텍스트 색상

```css
/* LCD 스크린 텍스트 */
primary: #1a1a1a (거의 검정)
secondary: #333333 (진한 회색)
tertiary: #666666 (중간 회색)
disabled: #999999 (연한 회색)

/* 블루 하이라이트 시 */
selected: #ffffff (흰색)
```

---

## 🎯 상호작용 (Interactions)

### 호버 효과

**네비게이션 링크:**
```css
/* 기본 */
color: #666;

/* 호버 */
color: #5e9ed6;
transition: color 0.2s ease;
```

**게시글 리스트 아이템:**
```css
/* 기본 */
background: transparent;
color: #1a1a1a;

/* 호버 */
background: linear-gradient(to bottom, #6ba8e0, #5e9ed6, #3d7eb3);
color: white;
클래스: ipod-3d-hover (3D 효과 자동 적용)
transition: all 0.2s ease;
```

### 3D 효과 클래스

```css
/* 기본 3D 효과 */
.ipod-3d-effect { ... }

/* 호버 시 3D 효과 */
.ipod-3d-hover:hover { ... }

/* 활성/선택 상태 3D 효과 */
.ipod-3d-active { ... }

/* 헤더용 3D 효과 */
.ipod-header-3d { ... }

/* 타이틀용 3D 효과 */
.ipod-title-3d { ... }
```

### 클릭 효과

```css
active: scale-[0.99];
```

---

## 📐 Spacing System

```css
/* 아이팟 스타일 간격 */
--spacing-tight: 8px; /* 작은 요소 간격 */
--spacing-base: 12px; /* 기본 간격 */
--spacing-comfortable: 16px; /* 편안한 간격 */
--spacing-spacious: 24px; /* 넉넉한 간격 */
```

**적용:**
- 헤더 padding: `px-5 py-1.5`
- 타이틀 padding: `px-6 py-4`
- 리스트 아이템 padding: `px-5 py-3.5`
- 카드 padding: `px-6 py-5`
- 컴포넌트 간격: `gap-3` (헤더 네비게이션), `mb-8` (섹션)

---

## 🔲 Border Radius

```css
--radius-ipod: 8px; /* 코드 블록, 작은 요소 */
--radius-ipod-card: 12px; /* 이미지, 중간 요소 */
--radius-ipod-screen: 16px; /* LCD 스크린 */
```

**적용:**
- LCD 박스: `rounded-2xl` (16px)
- 버튼/작은 카드: `rounded-xl` (12px)
- 코드 블록: `rounded-lg` (8px)
- 프로그래스바: `rounded-full`

---

## 🎨 Markdown 콘텐츠 스타일

### 제목

```css
h1: 2rem, font-bold, border-bottom: 2px solid #e0e0e0
h2: 1.5rem, font-bold, border-bottom: 1px solid #e8e8e8
h3: 1.25rem, font-semibold
```

### 리스트

```css
▶ marker in #5e9ed6 (아이팟 블루)
line-height: 1.7
color: #1a1a1a
```

### 링크

```css
color: #4a8ec4;
border-bottom: 1px solid #a8d0f0;
hover: background-color: rgba(94, 158, 214, 0.1);
```

### 코드 블록

```css
background: #ffffff;
border: 2px solid #d4d4d4;
border-radius: 8px;
box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
```

### 인라인 코드

```css
background: #e8e8e8;
color: #1a1a1a;
border: 1px solid #d0d0d0;
border-radius: 4px;
```

### 인용구

```css
border-left: 4px solid #5e9ed6;
background: #f0f4f8;
border-radius: 0 8px 8px 0;
color: #333;
```

### 이미지

```css
border-radius: 12px;
border: 2px solid #d4d4d4;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
```

### 테이블

```css
background: #ffffff;
border: 2px solid #d4d4d4;
thead: linear-gradient(to bottom, #f5f5f5, #e8e8e8);
hover row: rgba(94, 158, 214, 0.08);
```

---

## ✨ 애니메이션

### Transition Timing

```css
transition: all 0.2s ease;
/* 빠르고 반응성 좋은 아이팟 느낌 */
```

### GPU 가속 애니메이션

**프로그래스바:**
```css
/* transform 사용으로 GPU 가속 */
transform: scaleX(progress); /* 진행 바 */
transform: translateX(position); /* 핸들 */
```

### Hover Animation

```css
/* 리스트 아이템 */
background: gradient transition
transform: none /* 스케일 없음 */

/* 클릭 */
active:scale-[0.99] /* 살짝 눌림 */
```

---

## 📱 반응형 디자인

### 브레이크포인트

```css
mobile: default
tablet: md: (768px)
desktop: lg: (1024px)
```

### 반응형 텍스트

```css
h1: text-xl md:text-2xl lg:text-3xl
body: 항상 text-base (변경 없음)
```

---

## 🎵 아이팟 디자인 원칙

### 1. **명확성 (Clarity)**

- 모든 텍스트는 LCD처럼 선명하게
- 고대비 색상 사용 (#1a1a1a on #f8f9fa)
- 파란색 하이라이트로 선택 상태 명확히 표시

### 2. **계층구조 (Hierarchy)**

- 헤더 - 타이틀 - 콘텐츠의 명확한 구분
- 테두리와 배경색으로 영역 구분
- 3D 볼록 효과로 중요 요소 강조

### 3. **일관성 (Consistency)**

- 모든 페이지에 LCD 박스 스타일 적용
- ▶ 마커 통일 사용
- 파란색 하이라이트 통일
- 3D 효과 일관성 있게 적용

### 4. **반응성 (Responsiveness)**

- 빠른 호버 피드백 (0.2s)
- 클릭 시 즉각적인 시각적 피드백
- GPU 가속 애니메이션으로 부드러운 스크롤

### 5. **입체감 (Depth)**

- 3D 볼록 효과로 물리적 버튼 느낌
- 그라데이션과 그림자로 입체감 표현
- 헤더와 선택된 항목의 볼록 튀어나온 느낌

---

## 📋 체크리스트

새 컴포넌트 추가 시 확인사항:

- [ ] LCD 박스 스타일 (하얀 배경 + 회색 테두리)
- [ ] 회색 그라데이션 헤더 (3단계)
- [ ] 파란색 그라데이션 타이틀 (3단계, 3D 효과)
- [ ] ▶ 리스트 마커 (블루)
- [ ] 호버 시 파란색 그라데이션 배경 + 3D 효과
- [ ] SF Pro Display 폰트 사용
- [ ] 명확한 색상 대비
- [ ] 2px 테두리 적용
- [ ] 16px 둥근 모서리 (LCD 박스)
- [ ] 빠른 트랜지션 (0.2s)
- [ ] 모바일 반응형 확인
- [ ] 3D 볼록 효과 적용 (필요시)

---

## 🔧 주요 CSS 변수

```css
:root {
  /* iPod Classic Colors */
  --ipod-blue: #5e9ed6;
  --ipod-blue-light: #6ba8e0;
  --ipod-blue-dark: #4a8ec4;
  --ipod-blue-darker: #3d7eb3;

  /* Grayscale */
  --ipod-text-primary: #1a1a1a;
  --ipod-text-secondary: #333333;
  --ipod-text-tertiary: #666666;
  --ipod-gray-light: #999999;

  /* LCD Screen */
  --lcd-bg: #ffffff;
  --lcd-content-bg: #f8f9fa;
  --lcd-border: #d4d4d4;
  --lcd-border-dark: #b8b8b8;

  /* Background */
  --ipod-bg: #e8e8e8;
}
```

---

## 📚 참고 자료

- iPod Classic (5th Generation) Design
- Apple Industrial Design
- Skeuomorphic UI Design
- LCD Display Aesthetics

---

## 🎵 디자인 철학

> "Simple is better than complex.  
> Clear is better than clever.  
> The best interface is no interface."

아이팟 클래식의 디자인은 **단순함, 명확함, 직관성**의 완벽한 조화였습니다.  
이 블로그는 그 철학을 웹에서 재현합니다.

---

**Last Updated**: 2025년 1월 17일  
**Design System Version**: 4.0.0 (iPod Classic LCD Edition)

