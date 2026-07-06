/**
 * 사이트 전역 설정.
 * 프로필/소개 문구를 바꾸려면 이 파일만 수정하면 됩니다.
 */
export const siteConfig = {
  /** 프로덕션 도메인 (canonical/RSS/sitemap/OG에 사용) */
  baseUrl: "https://jindol-blog-two.vercel.app",
  /** 텍스트 로고: `진돌` + 우드 브라운 `.dev` */
  logo: { name: "진돌", suffix: ".dev" },
  title: { ko: "진돌.dev", en: "jindol.dev" },
  description: {
    ko: "안녕하세요 프론트엔드 개발자 여진석입니다.",
    en: "Hello, I'm Yeo Jinseok, a frontend developer.",
  },
  author: {
    name: { ko: "여진석", en: "Jinseok Yeo" },
    role: { ko: "프론트엔드 개발자", en: "Frontend Developer" },
    bio: {
      ko: "커머스 도메인에서 제품과 팀의 개발 방식을 함께 개선하는 프론트엔드 개발자입니다.",
      en: "A frontend developer in commerce who improves both the product and how the team builds it.",
    },
    github: "https://github.com/realstone2",
    linkedin: "https://www.linkedin.com/in/jindol-487b8332a/",
    email: "yeojinseok@kakao.com",
    /** public/ 아래 프로필 사진 경로 (없으면 이니셜 플레이스홀더 표시) */
    avatar: "/profile.jpg" as string | null,
  },
  about: {
    stack: ["React", "React Native", "Remix", "Next"],
    kicker: { ko: "소개", en: "ABOUT" },
    headline: {
      ko: "더 나은 방식을\n계속 고민하는 개발자입니다.",
      en: "A developer who keeps asking\nif there's a better way.",
    },
    intro: {
      ko: "지금의 방식에 안주하기보다 더 나은 방법을 찾아 제안하는 걸 좋아합니다. 커머스 도메인에서 제품과 팀의 개발 경험을 함께 다듬어가고 있습니다.",
      en: "Rather than settling for how things are, I like finding and proposing better ways. I work in commerce, refining both the product and the team's developer experience.",
    },
    timeline: [
      {
        period: "2026—",
        title: {
          ko: "올리브영 · 프론트엔드 엔지니어",
          en: "Olive Young · Frontend Engineer",
        },
        description: {
          ko: "회원 스쿼드에서 US 올리브영 개발을 담당하고 있습니다.",
          en: "Building US Olive Young on the membership squad.",
        },
      },
      {
        period: "2022—25",
        title: {
          ko: "룩코(Looko) · 프론트엔드 엔지니어",
          en: "Looko · Frontend Engineer",
        },
        description: {
          ko: "빈티지 커머스 SecondSold와 AI 디지털 옷장 Acloset을 개발하며 B2B/B2C 커머스 생태계 전체를 경험했습니다. SEO 최적화, 웹뷰 실험 환경 구축, 브라우저에서의 대용량 데이터 처리 문제를 해결했어요.",
          en: "Built the vintage commerce platform SecondSold and the AI digital closet Acloset, covering the full B2B/B2C commerce ecosystem — SEO, WebView infrastructure, and large-scale in-browser data handling.",
        },
      },
    ],
    interests: {
      ko: ["AI Native 개발", "웹 인증/보안"],
      en: ["AI-native development", "Web auth & security"],
    },
  },
  /** Giscus 설정 — 어차피 브라우저에 노출되는 공개 식별자라 코드에 직접 관리 */
  giscus: {
    repo: "realstone2/jindol-blog" as `${string}/${string}`,
    repoId: "R_kgDOQWx3vA",
    category: "General",
    categoryId: "DIC_kwDOQWx3vM4Cx2b_",
  },
};
