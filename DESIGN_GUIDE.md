# Design Guide - Apple Glass UI Style

이 문서는 jindol-blog의 디자인 시스템과 스타일 가이드를 정리한 문서입니다.

## 🎨 디자인 컨셉

Apple의 iOS/macOS 디자인 시스템을 기반으로 한 **Glass UI (Glassmorphism)** 스타일을 적용했습니다.

### 핵심 특징

- **Frosted Glass 효과**: backdrop-blur와 반투명 배경
- **부드러운 라운딩**: 16px ~ 24px의 큰 border-radius
- **웜톤 베이지 색상 팔레트**: 따뜻하고 차분한 느낌
- **섬세한 그림자**: 입체감을 주는 다층 그림자 효과
- **넉넉한 여백**: Apple 특유의 여유로운 spacing

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
h1: text-4xl (36px), font-bold, letter-spacing: -0.02em
h2: text-2xl (24px), font-semibold, letter-spacing: -0.01em
h3: text-xl (20px), font-semibold, letter-spacing: -0.01em
h4: text-lg (18px), font-semibold

/* 본문 */
body: text-base (16px), leading-relaxed
small: text-sm (14px)
```

### 그라데이션 텍스트

```css
/* 제목에 적용되는 그라데이션 */
background: linear-gradient(to right, #3e3028, #6b5d52);
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

### 3. Blog Header Card (블로그 헤더)

```css
backdrop-blur-2xl
bg-white/30
border: border-white/20
border-radius: 24px
padding: 32px ~ 48px
```

**특징:**

- 가장 큰 라운딩 (24px)
- 넉넉한 패딩
- 그라데이션 제목

### 4. Footer

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

- Apple Human Interface Guidelines
- iOS/macOS Design System
- Glassmorphism Design Principles
- Tailwind CSS Documentation

---

**Last Updated**: 2025년 11월 16일
**Design System Version**: 1.0.0
