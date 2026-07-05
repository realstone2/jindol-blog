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
      ko: "웹에서 편안한 경험을 만드는 프론트엔드 개발자. 서울에서 일합니다.",
      en: "A frontend developer crafting comfortable web experiences. Based in Seoul.",
    },
    github: "https://github.com/realstone2",
    linkedin: "https://www.linkedin.com/in/jindol-487b8332a/",
    email: "wlstjrghdud@gmail.com",
    /** public/ 아래 프로필 사진 경로 (없으면 이니셜 플레이스홀더 표시) */
    avatar: null as string | null,
  },
  about: {
    location: { ko: "📍 서울, 대한민국", en: "📍 Seoul, Korea" },
    years: { ko: "🌱 웹을 만드는 중", en: "🌱 Building the web" },
    stack: ["TypeScript", "React", "Next.js", "Node"],
    kicker: { ko: "소개", en: "ABOUT" },
    headline: {
      ko: "읽기 편한 화면과\n단단한 코드를 만듭니다.",
      en: "I build readable screens\nand solid code.",
    },
    intro: {
      ko: "사용자가 멈칫하지 않고 자연스럽게 흘러가는 인터페이스를 좋아합니다. 눈에 띄지 않지만 꼼꼼하게 다듬어진 디테일이 좋은 경험을 만든다고 믿어요. 이 블로그에서는 그런 과정을 솔직하게 기록합니다.",
      en: "I like interfaces that flow naturally without making users pause. I believe good experiences come from details that are carefully polished, even if nobody notices them. This blog is an honest record of that process.",
    },
    timeline: [
      {
        period: "2023—",
        title: {
          ko: "프론트엔드 개발자 · 어느 스타트업",
          en: "Frontend Developer · a startup",
        },
        description: {
          ko: "디자인 시스템을 세우고, 팀의 개발 경험을 개선하는 일을 맡고 있어요.",
          en: "Building a design system and improving the team's developer experience.",
        },
      },
      {
        period: "2019",
        title: { ko: "웹의 세계로", en: "Into the web" },
        description: {
          ko: "첫 사이드 프로젝트를 배포하고 그대로 빠져들었어요.",
          en: "Shipped my first side project and never looked back.",
        },
      },
    ],
    interests: {
      ko: ["로컬 퍼스트 앱", "타이포그래피", "웹 성능"],
      en: ["Local-first apps", "Typography", "Web performance"],
    },
  },
  giscus: {
    repo: import.meta.env.VITE_GISCUS_REPO as `${string}/${string}`,
    repoId: import.meta.env.VITE_GISCUS_REPO_ID as string,
    category: (import.meta.env.VITE_GISCUS_CATEGORY as string) || "Announcements",
    categoryId: import.meta.env.VITE_GISCUS_CATEGORY_ID as string,
  },
};
