"use client";

import { useEffect, useState } from "react";

export function ScrollProgress({ title }: { title: string }) {
  const [progress, setProgress] = useState(0);

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
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#d4d4d4] z-50"
      style={{
        boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* iPod Now Playing 바 */}
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
              {title}
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

          {/* 버퍼링 효과 (선택사항) */}
          <div
            className="absolute top-0 left-0 h-full bg-[#b8d8f0] transition-all duration-300"
            style={{ width: `${Math.min(progress + 5, 100)}%` }}
          />

          {/* 진행률 바 (위에 다시) */}
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

        {/* 컨트롤 버튼 (선택사항) */}
        <div className="flex items-center justify-center gap-6 mt-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-[#666] hover:text-[#5e9ed6] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>
          <button className="text-[#5e9ed6] hover:text-[#4a8ec4] transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              {progress < 100 ? (
                <path d="M8 5v14l11-7z" />
              ) : (
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              )}
            </svg>
          </button>
          <button
            onClick={() =>
              window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth",
              })
            }
            className="text-[#666] hover:text-[#5e9ed6] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
