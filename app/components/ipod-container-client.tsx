"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface IpodContainerClientProps {
  children: React.ReactNode;
  lang: "ko" | "en";
  languageSwitcher: React.ReactNode;
  currentPath: string;
}

// 현재 pathname 기반으로 페이지 이름 가져오기
function getPageName(pathname: string): string {
  if (pathname === "/") return "Home";
  if (pathname === "/blog") return "Blog";
  if (pathname.startsWith("/blog/")) return "Post";
  return "Home";
}

// 현재 pathname이 특정 경로와 일치하는지 확인
function isActivePath(currentPath: string, targetPath: string): boolean {
  if (targetPath === "/") {
    return currentPath === "/";
  }
  return currentPath.startsWith(targetPath);
}

// 페이지 제목 가져오기
function getPageTitle(pathname: string): string {
  if (pathname === "/") return "Recent Posts";
  if (pathname === "/blog") return "All Posts";
  if (pathname.startsWith("/blog/")) {
    // 블로그 포스트의 경우 제목을 가져올 수 없으므로 기본값
    return "Blog Post";
  }
  return "Content";
}

export function IpodContainerClient({
  children,
  lang,
  languageSwitcher,
  currentPath,
}: IpodContainerClientProps) {
  const pathname = usePathname();
  const pageName = getPageName(pathname || currentPath);
  const [progress, setProgress] = useState(0);

  const navItems = [
    { path: "/", name: "Home" },
    { path: "/blog", name: "Blog" },
    {
      path: "https://vercel.com/templates/next.js/portfolio-starter-kit",
      name: "Deploy",
      external: true,
    },
  ];

  // 스크롤 프로그레스 감지
  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
      setProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  // 진행률을 시간으로 변환 (0:00 ~ 5:00 형태)
  const totalSeconds = 300; // 5분 = 300초
  const currentSeconds = Math.floor((progress / 100) * totalSeconds);
  const minutes = Math.floor(currentSeconds / 60);
  const seconds = currentSeconds % 60;
  const currentTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const totalTime = "5:00";

  return (
    <>
      <div
        className="bg-white rounded-2xl border-2 border-[#d4d4d4] overflow-hidden h-full flex flex-col"
        style={{
          boxShadow:
            "0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
        }}
      >
        {/* 헤더 - 네비게이션 통합 (3D 효과) */}
        <div className="bg-gradient-to-b from-[#f0f0f0] via-[#e8e8e8] to-[#d0d0d0] border-b border-[#b8b8b8] ipod-header-3d">
          <div className="px-5 py-1.5 flex items-center justify-between gap-3">
            {/* 왼쪽: 네비게이션 링크 */}
            <div className="flex items-center gap-3">
              {navItems.map((item) => {
                const isActive =
                  !item.external && isActivePath(pathname || currentPath, item.path);
                const LinkComponent = item.external ? "a" : Link;
                const linkProps = item.external
                  ? {
                      href: item.path,
                      target: "_blank",
                      rel: "noopener noreferrer",
                    }
                  : { href: item.path };

                return (
                  <LinkComponent
                    key={item.path}
                    {...linkProps}
                    className={`text-xs font-semibold tracking-wide uppercase transition-colors ${
                      isActive
                        ? "text-[#5e9ed6]"
                        : "text-[#666] hover:text-[#5e9ed6]"
                    }`}
                  >
                    {item.name}
                  </LinkComponent>
                );
              })}
            </div>

            {/* 오른쪽: 페이지명과 언어 변환 */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#333] tracking-wide uppercase">
                {pageName}
              </span>
              {languageSwitcher}
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 - flex-1로 남은 공간 모두 차지 */}
        <div className="flex-1 flex flex-col overflow-auto">{children}</div>

        {/* 하단 Footer */}
        <div className="bg-gradient-to-b from-[#f0f0f0] via-[#e8e8e8] to-[#d0d0d0] border-t border-[#b8b8b8] ipod-header-3d">
          <div className="px-5 py-3">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-[#666]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
              </svg>
              <span className="text-xs font-semibold text-[#333] tracking-wide uppercase">
                Links
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-xs mb-3">
              <a
                className="flex items-center gap-1.5 text-[#1a1a1a] hover:text-[#5e9ed6] transition-colors font-semibold"
                rel="noopener noreferrer"
                target="_blank"
                href="/rss"
              >
                <span>→</span>
                <span>RSS</span>
              </a>
              <a
                className="flex items-center gap-1.5 text-[#1a1a1a] hover:text-[#5e9ed6] transition-colors font-semibold"
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/vercel/next.js"
              >
                <span>→</span>
                <span>GitHub</span>
              </a>
              <a
                className="flex items-center gap-1.5 text-[#1a1a1a] hover:text-[#5e9ed6] transition-colors font-semibold"
                rel="noopener noreferrer"
                target="_blank"
                href="https://vercel.com/templates/next.js/portfolio-starter-kit"
              >
                <span>→</span>
                <span>View Source</span>
              </a>
            </div>

            <p className="text-xs text-[#666] font-medium">
              © {new Date().getFullYear()} MIT Licensed
            </p>
          </div>
        </div>
      </div>

      {/* 고정 프로그래스바 */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#d4d4d4] z-50"
        style={{
          boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-3">
          {/* 제목과 시간 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <svg
                className="w-4 h-4 text-[#5e9ed6] flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="text-sm font-bold text-[#1a1a1a] truncate">
                {getPageTitle(pathname || currentPath)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#666] tabular-nums">
              <span>{currentTime}</span>
              <span className="text-[#999]">/</span>
              <span>{totalTime}</span>
            </div>
          </div>

          {/* 재생 바 */}
          <div className="relative h-2 bg-[#e8e8e8] rounded-full overflow-hidden">
            {/* 진행률 바 */}
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#5e9ed6] to-[#4a8ec4] transition-all duration-150"
              style={{ width: `${progress}%` }}
            />

            {/* 진행 핸들 */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#5e9ed6] rounded-full shadow-sm transition-all duration-150"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

