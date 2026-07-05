import type { Lang } from "./types";

export const messages = {
  ko: {
    nav: { posts: "글", about: "소개", tags: "태그" },
    list: {
      title: "글",
      description: "개발하며 배운 것들을 기록합니다.",
      searchPlaceholder: "제목이나 내용으로 검색…",
      all: "전체",
      loadMore: "더 보기",
      empty: "조건에 맞는 글이 없어요.",
    },
    post: {
      minRead: (min: number) => `${min}분 읽기`,
      min: (min: number) => `${min}분`,
      prev: "← 이전 글",
      next: "다음 글 →",
      comments: "댓글",
    },
    tags: {
      title: "태그",
      description: "주제별로 글을 모아봅니다.",
      count: (n: number) => `${n}개의 글`,
    },
    about: {
      github: "GitHub",
      email: "이메일 보내기",
      stack: "STACK",
      timeline: "걸어온 길",
      interests: "요즘 관심사",
    },
    notFound: {
      title: "페이지를 찾을 수 없어요",
      description: "주소가 바뀌었거나 삭제된 글일 수 있어요.",
      home: "글 목록으로",
    },
  },
  en: {
    nav: { posts: "Posts", about: "About", tags: "Tags" },
    list: {
      title: "Posts",
      description: "Notes on what I learn while building.",
      searchPlaceholder: "Search by title or content…",
      all: "All",
      loadMore: "Load more",
      empty: "No posts match your filters.",
    },
    post: {
      minRead: (min: number) => `${min} min read`,
      min: (min: number) => `${min} min`,
      prev: "← Previous",
      next: "Next →",
      comments: "Comments",
    },
    tags: {
      title: "Tags",
      description: "Browse posts by topic.",
      count: (n: number) => (n === 1 ? "1 post" : `${n} posts`),
    },
    about: {
      github: "GitHub",
      email: "Send email",
      stack: "STACK",
      timeline: "Journey",
      interests: "Current interests",
    },
    notFound: {
      title: "Page not found",
      description: "The link may have changed or the post was removed.",
      home: "Back to posts",
    },
  },
} as const;

export type Messages = (typeof messages)[Lang];

export function getMessages(lang: Lang): Messages {
  return messages[lang];
}
