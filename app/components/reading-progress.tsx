import { useEffect, useState } from "react";

/**
 * 읽기 진행률 바 (디자인 3b)
 * 뷰포트 최상단 fixed, 트랙 #EDE2CF / 채움 #A9613A / 높이 4px
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? (doc.scrollTop / max) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 bg-line">
      <div
        className="h-full bg-wood-strong transition-[width] duration-[80ms] ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
