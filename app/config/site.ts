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
    avatar: null as string | null,
  },
  about: {
    location: { ko: "📍 서울, 대한민국", en: "📍 Seoul, Korea" },
    years: {
      ko: "🌱 2022년부터 웹을 만드는 중",
      en: "🌱 Building the web since 2022",
    },
    stack: ["TypeScript", "React", "React Router", "React Native", "TanStack Query"],
    kicker: { ko: "소개", en: "ABOUT" },
    headline: {
      ko: "제품과 함께\n팀의 개발 방식도 개선합니다.",
      en: "I improve the product —\nand how the team builds it.",
    },
    intro: {
      ko: "반복되는 비효율을 발견하면 도구와 방법론으로 만드는 걸 좋아합니다. AI를 활용해 운영 업무 시간을 90% 줄이고, API Hook 자동 생성 도구로 팀의 Best Practice를 만들었습니다. 기획·디자인·백엔드와 문제를 빠르게 공유하며 부드럽고 명확하게 소통하는 것을 중요하게 생각해요. 이 블로그에는 그 과정에서 배운 것들을 기록합니다.",
      en: "When I spot repeated inefficiency, I like turning it into tools and methodology. I've cut operations work by 90% with AI and built an API hook generator that became the team's best practice. I value fast, clear communication with PMs, designers, and backend engineers. This blog is a record of what I learn along the way.",
    },
    timeline: [
      {
        period: "2026—",
        title: {
          ko: "올리브영 · US 커머스플랫폼개발팀",
          en: "Olive Young · US Commerce Platform Team",
        },
        description: {
          ko: "Remix(React Router v7) 기반으로 글로벌 커머스 웹을 개발하고 있습니다.",
          en: "Building a global commerce web experience with Remix (React Router v7).",
        },
      },
      {
        period: "2022—25",
        title: {
          ko: "루코(Looko) · 프론트엔드 엔지니어",
          en: "Looko · Frontend Engineer",
        },
        description: {
          ko: "빈티지 커머스 SecondSold와 AI 디지털 옷장 Acloset을 개발하며 B2B/B2C 커머스 생태계 전체를 경험했습니다. SEO 최적화, 웹뷰 실험 환경 구축, 대용량 데이터 처리 문제를 해결했어요.",
          en: "Built the vintage commerce platform SecondSold and the AI digital closet Acloset, covering the full B2B/B2C commerce ecosystem — SEO, WebView infrastructure, and large-scale data handling.",
        },
      },
      {
        period: "2022",
        title: { ko: "웹의 세계로", en: "Into the web" },
        description: {
          ko: "컴퓨터소프트웨어학과를 졸업하고 패션 테크 스타트업에서 커리어를 시작했습니다.",
          en: "Graduated in computer software and started my career at a fashion tech startup.",
        },
      },
    ],
    interests: {
      ko: ["React Router v7", "AI Native 개발"],
      en: ["React Router v7", "AI-native development"],
    },
  },
  giscus: {
    repo: import.meta.env.VITE_GISCUS_REPO as `${string}/${string}`,
    repoId: import.meta.env.VITE_GISCUS_REPO_ID as string,
    category: (import.meta.env.VITE_GISCUS_CATEGORY as string) || "Announcements",
    categoryId: import.meta.env.VITE_GISCUS_CATEGORY_ID as string,
  },
};
