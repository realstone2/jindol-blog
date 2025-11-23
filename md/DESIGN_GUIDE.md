# Design Guide - iPod Classic UI Style

이 문서는 jindol-blog의 디자인 시스템과 스타일 가이드를 정리한 문서입니다.

## � 디자인 컨셉

**iPod Classic (5th Generation)** 의 아이코닉한 LCD 스크린 UI를 웹으로 재해석했습니다.  
2000년대 초반 Apple의 미니멀하고 직관적인 디자인 철학을 현대적으로 구현합니다.

### 핵심 특징

- **LCD 스크린 디스플레이**: 하얀 배경에 명확한 회색 테두리
- **리스트 기반 네비게이션**: 아이팟의 시그니처 메뉴 스타일
- **블루 하이라이트**: 선택된 항목의 시그니처 블루 그라데이션
- **▶ 플레이 아이콘**: 모든 리스트 항목의 마커
- **심플한 타이포그래피**: Inter 폰트를 사용한 깔끔한 텍스트
- **회색 톤 배경**: 아이팟 본체의 은색 메탈 느낌
- **명확한 계층구조**: 헤더 - 리스트 - 액션의 명확한 구조

---

## 🎨 색상 시스템 (Color Palette)

### 아이팟 시그니처 블루

```css
--ipod-blue: #5e9ed6; /* 메인 블루 */
--ipod-blue-dark: #4a8ec4; /* 그라데이션 끝 */
--ipod-blue-darker: #3d7eb3; /* 테두리 */
```

### 그레이 스케일

```css
--ipod-text-primary: #1a1a1a; /* 메인 텍스트 */
--ipod-text-secondary: #333333; /* 보조 텍스트 */
--ipod-text-tertiary: #666666; /* 삼차 텍스트 */
--ipod-gray-light: #999999; /* 아이콘 */
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
--lcd-header: linear-gradient(to bottom, #f5f5f5, #e8e8e8);
--ipod-blue-gradient: linear-gradient(to right, #5e9ed6, #4a8ec4);
```

### 배경 색상

```css
--ipod-bg: #e8e8e8 ~#f0f0f0; /* 메인 배경 (메탈 실버) */
```

---

## 🪟 LCD Screen 컴포넌트 구조

### 기본 LCD 박스 구조

```tsx
<div className="bg-white rounded-2xl border-2 border-[#d4d4d4]">
  {/* 1. 상단 헤더 - 회색 그라데이션 */}
  <div className="bg-gradient-to-b from-[#e8e8e8] to-[#d0d0d0] px-5 py-2.5 border-b border-[#b8b8b8]">
    <span>SECTION NAME</span>
  </div>

  {/* 2. 타이틀 - 블루 그라데이션 (선택 상태) */}
  <div className="bg-gradient-to-r from-[#5e9ed6] to-[#4a8ec4] px-6 py-5 border-b border-[#3d7eb3]">
    <h1 className="text-white">Title</h1>
  </div>

  {/* 3. 콘텐츠 - 밝은 회색 배경 */}
  <div className="bg-[#f8f9fa] px-6 py-5">Content</div>
</div>
```

### 그림자 효과

```css
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8);
```

---

## 📱 컴포넌트별 스타일

### 1. Navigation - iPod 메뉴 스타일

**구조:**

- 상단 헤더: "MENU" 라벨 + 아이콘
- 리스트 아이템: ▶ 마커 + 텍스트 + 화살표
- 호버: 블루 그라데이션 배경

**특징:**

```css
/* 기본 상태 */
background: #f8f9fa;
border: 2px solid #d4d4d4;

/* 호버 상태 */
background: linear-gradient(to right, #5e9ed6, #4a8ec4);
color: white;
```

### 2. Blog Post List - iPod 플레이리스트 스타일

**구조:**

- 각 항목: ▶ + 제목 + 날짜 + 화살표
- 호버 시 전체 블루 하이라이트

**특징:**

```css
/* 리스트 아이템 */
▶ text-[#5e9ed6]
title: font-bold text-[#1a1a1a]
date: text-xs text-[#666]

/* 호버 시 */
background: linear-gradient(to right, #5e9ed6, #4a8ec4)
all text: white
```

### 3. Blog Post Detail - LCD 스크린 콘텐츠

**헤더 구조:**

1. 회색 헤더: "Blog Post" 라벨
2. 블루 타이틀 바: 제목 (흰색 텍스트)
3. 콘텐츠 영역: 본문 (#f8f9fa 배경)

**콘텐츠 스타일:**

- 본문: #1a1a1a
- 링크: #4a8ec4 (블루)
- 코드: 하얀 박스 + 회색 테두리
- 리스트: ▶ 블루 마커

### 4. Footer - iPod 설정 메뉴 스타일

**구조:**

- LCD 박스 형태
- 리스트 스타일 링크
- 외부 링크 아이콘

---

## 📝 Typography

### 폰트 패밀리

```css
font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue",
  Arial, sans-serif;
```

**특징:**

- **Inter**: 아이팟 LCD의 명확한 가독성 재현
- **Font Weight**: 400 (일반), 600 (세미볼드), 700 (볼드), 800 (헤비)
- **Antialiasing**: 선명한 렌더링

### 크기 체계

```css
/* 헤더 */
h1: text-2xl ~ 3xl (24px ~ 30px), font-bold
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

**리스트 아이템:**

```css
/* 기본 */
background: #f8f9fa;
color: #1a1a1a;

/* 호버 */
background: linear-gradient(to right, #5e9ed6, #4a8ec4);
color: white;
transition: all 0.2s ease;
```

### 클릭 효과

```css
active: scale-[0.99];
```

### 포커스 상태

```css
border-color: #5e9ed6;
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

- 리스트 아이템 padding: `px-5 py-3`
- 카드 padding: `px-6 py-5`
- 컴포넌트 간격: `space-y-3` (리스트), `mb-8` (섹션)

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
h1: text-2xl md:text-3xl
body: 항상 text-base (변경 없음)
```

---

## 🎵 아이팟 디자인 원칙

### 1. **명확성 (Clarity)**

- 모든 텍스트는 LCD처럼 선명하게
- 고대비 색상 사용 (#1a1a1a on #f8f9fa)

### 2. **계층구조 (Hierarchy)**

- 헤더 - 타이틀 - 콘텐츠의 명확한 구분
- 테두리와 배경색으로 영역 구분

### 3. **일관성 (Consistency)**

- 모든 페이지에 LCD 박스 스타일 적용
- ▶ 마커 통일 사용
- 블루 하이라이트 통일

### 4. **반응성 (Responsiveness)**

- 빠른 호버 피드백 (0.2s)
- 클릭 시 즉각적인 시각적 피드백

---

## 📋 체크리스트

새 컴포넌트 추가 시 확인사항:

- [ ] LCD 박스 스타일 (하얀 배경 + 회색 테두리)
- [ ] 회색 그라데이션 헤더
- [ ] ▶ 리스트 마커 (블루)
- [ ] 호버 시 블루 그라데이션 배경
- [ ] Inter 폰트 사용
- [ ] 명확한 색상 대비
- [ ] 2px 테두리 적용
- [ ] 16px 둥근 모서리 (LCD 박스)
- [ ] 빠른 트랜지션 (0.2s)
- [ ] 모바일 반응형 확인

---

## 🔧 주요 CSS 변수

```css
:root {
  /* iPod Classic Colors */
  --ipod-blue: #5e9ed6;
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

**Last Updated**: 2025년 11월 17일  
**Design System Version**: 3.0.0 (iPod Classic LCD Edition)

---

## 🎨 색상 시스템 (Color Palette)

### 배경 색상

```css
--apple-bg-light: #f5f1e8; /* 메인 배경 (크림 베이지) */
```

### 그라데이션 배경

```css
/* 부드러운 베이지 톤 radial gradient */
- rgba(235,220,200,0.4) at 30% 20%
- rgba(245,235,220,0.3) at 70% 60%
- rgba(230,225,210,0.3) at 50% 80%
```

### 텍스트 색상

```css
--apple-text-primary: #3e3028; /* 메인 텍스트 (다크 초콜릿 브라운) */
--apple-text-secondary: #6b5d52; /* 보조 텍스트 (미디엄 베이지 브라운) */
--apple-text-tertiary: #8e8276; /* 삼차 텍스트 (라이트 베이지 그레이) */
```

### 액센트 색상

```css
--apple-accent: #8b7355; /* 링크, 호버 상태 (웜 베이지 브라운) */
```

---

## 🪟 Glass UI 스타일 가이드

### Glassmorphism 속성

```css
backdrop-filter: blur(20px) ~blur(40px);
-webkit-backdrop-filter: blur(20px) ~blur(40px);
background: rgba(255, 255, 255, 0.2) ~rgba(255, 255, 255, 0.4);
border: 1px solid rgba(255, 255, 255, 0.2) ~rgba(255, 255, 255, 0.3);
```

### 그림자 효과 (웜톤)

```css
/* 외부 그림자 */
box-shadow: 0 8px 32px 0 rgba(139, 99, 76, 0.12);

/* 다층 그림자 (유리 효과) */
box-shadow: 0 8px 32px 0 rgba(139, 99, 76, 0.15), /* 외부 그림자 */ inset 0 1px
    1px 0 rgba(255, 248, 240, 0.7),
  /* 상단 빛 반사 */ inset 0 -1px 1px 0 rgba(255, 248, 240, 0.3); /* 하단 입체감 */
```

---

## 📐 Spacing System

```css
--spacing-xs: 8px;
--spacing-sm: 12px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```

---

## 🔲 Border Radius

```css
--radius-sm: 12px; /* 작은 요소 (코드, 버튼 등) */
--radius-md: 16px; /* 중간 요소 (카드 등) */
--radius-lg: 20px; /* 큰 요소 (네비게이션) */
--radius-xl: 24px; /* 특별한 요소 (헤더 카드) */
```

실제 적용:

- 네비게이션: `rounded-[20px]`
- 블로그 카드: `rounded-2xl` (16px)
- 블로그 헤더: `rounded-3xl` (24px)
- 버튼: `rounded-[14px]`

---

## 📝 Typography

### 폰트

- **Sans**: Geist Sans (기본)
- **Mono**: Geist Mono (코드)

### 크기 및 굵기

```css
/* 제목 */
h1: text-3xl ~ 5xl (30px ~ 48px), font-bold, letter-spacing: -0.02em, 중앙 정렬 (포스트 상세)
h2: text-2xl (24px), font-semibold, letter-spacing: -0.01em, 하단 구분선
h3: text-xl (20px), font-semibold, letter-spacing: -0.01em
h4: text-lg (18px), font-semibold

/* 본문 */
body: text-base (17px), leading-relaxed (1.75)
small: text-sm (14px)
```

### 그라데이션 텍스트 (포스트 제목)

```css
/* iPod LCD 스타일 그라데이션 */
background: linear-gradient(to bottom right, #3e3028, #6b5d52, #8b7355);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## 🎯 컴포넌트별 스타일

### 1. Navigation (네비게이션)

```css
backdrop-blur-3xl
bg-white/30
border: border-white/30
border-radius: 20px
padding: 12px
```

**특징:**

- Sticky positioning (lg:top-8)
- 강력한 blur 효과
- 다층 그림자로 입체감
- 호버 시 `bg-white/40`

### 2. Blog Post Cards (블로그 카드)

```css
backdrop-blur-2xl
bg-white/25
border: border-white/20
border-radius: 16px
padding: 24px
```

**특징:**

- 호버 시 `bg-white/40` + `scale-[1.02]`
- Active 시 `scale-[0.98]`
- 제목에 hover 시 accent 색상

### 3. Blog Post Detail Header (포스트 상세 헤더) - iPod LCD 스타일

```css
backdrop-blur-3xl
bg-white/40
border: border-white/30
border-radius: 28px
padding: 40px ~ 56px
```

**특징:**

- 중앙 정렬 레이아웃
- 상단/하단 장식 라인 (iPod 스크린 테두리)
- 날짜 배지: 아이콘 + 텍스트
- 큰 그라데이션 제목
- 요약문 표시

### 4. Blog Post Content (포스트 본문) - iPod 리스트 뷰 스타일

```css
backdrop-blur-2xl
bg-white/25
border: border-white/25
border-radius: 24px
padding: 32px ~ 48px
```

**특징:**

- 깔끔한 카드 레이아웃
- 가독성 높은 타이포그래피
- iPod 스타일 리스트 마커 (▸)

### 5. Footer

```css
margin-top: 96px
text-color: #8E8276
```

**특징:**

- 아이콘 배경: `bg-[#F5F1E8]`
- 호버 시: `text-[#8B7355]`, `bg-[#8B7355]/10`

### 5. Code Blocks

```css
backdrop-blur: blur(20px)
background: rgba(255, 255, 255, 0.3)
border: 1px solid rgba(255, 255, 255, 0.2)
border-radius: 16px
```

**특징:**

- 인라인 코드: `bg-rgba(139, 115, 85, 0.1)`
- 코드 텍스트 색상: `#3E3028`

---

## ✨ 애니메이션 & 인터랙션

### Transition Timing

```css
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
transition: all 0.3s ease-out; /* 카드 */
```

### 호버 효과

- **네비게이션 링크**: 배경 밝아짐
- **블로그 카드**: 배경 밝아짐 + 살짝 확대 (scale 1.02)
- **버튼/링크**: 색상 변경 (accent 색상)

### 클릭 효과

- **Active 상태**: `scale-[0.95]` 또는 `scale-[0.98]`

---

## 📱 반응형 디자인

### 브레이크포인트

- Mobile: 기본
- Tablet: `md:` (768px)
- Desktop: `lg:` (1024px)

### 반응형 요소

```css
/* 컨테이너 */
max-width: 1024px (max-w-4xl)
padding: 24px (px-6) → 32px (sm:px-8) → 48px (lg:px-12)

/* 카드 레이아웃 */
flex-col → md:flex-row
```

---

## 🎨 Markdown 스타일링

### 링크

```css
color: #8B7355
text-decoration-color: rgba(139, 115, 85, 0.3)
hover: text-decoration-color: #8B7355
```

### 리스트

- Disc style (●)
- 색상: `#3E3028`

### 이미지

```css
border-radius: 20px (rounded-2xl)
box-shadow: large shadow
```

---

## 📋 체크리스트

디자인 시스템 적용 시 확인사항:

- [ ] Glass UI 효과 (backdrop-blur, 반투명 배경)
- [ ] 베이지 톤 색상 팔레트 적용
- [ ] 웜톤 그림자 효과
- [ ] 적절한 border-radius (12px ~ 24px)
- [ ] 넉넉한 spacing
- [ ] 부드러운 애니메이션
- [ ] 호버/액티브 상태 스타일
- [ ] 그라데이션 배경
- [ ] 그라데이션 텍스트 (제목)
- [ ] 반응형 디자인

---

## 🔧 주요 CSS 변수

```css
:root {
  /* Colors */
  --apple-accent: #8b7355;
  --apple-text-primary: #3e3028;
  --apple-text-secondary: #6b5d52;
  --apple-text-tertiary: #8e8276;
  --apple-bg-light: #f5f1e8;

  /* Glassmorphism */
  --glass-bg-light: rgba(255, 255, 255, 0.72);
  --glass-border-light: rgba(0, 0, 0, 0.08);

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(139, 99, 76, 0.05);
  --shadow-md: 0 4px 6px rgba(139, 99, 76, 0.07);
  --shadow-lg: 0 10px 25px rgba(139, 99, 76, 0.1);
  --shadow-xl: 0 20px 40px rgba(139, 99, 76, 0.15);

  /* Border Radius */
  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 20px;
  --radius-xl: 24px;

  /* Spacing */
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
}
```

---

## 📚 참고 자료

- iPod Classic Design
- Apple Human Interface Guidelines
- iOS/macOS Design System
- Glassmorphism Design Principles
- Tailwind CSS Documentation

---

**Last Updated**: 2025년 11월 17일  
**Design System Version**: 2.0.0 (iPod Classic Edition)
