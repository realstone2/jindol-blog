function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-20 mb-12">
      {/* iPod 스크린 블록 */}
      <div
        className="bg-white rounded-2xl border-2 border-[#d4d4d4] overflow-hidden mb-6"
        style={{
          boxShadow:
            "0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
        }}
      >
        {/* 상단 헤더 */}
        <div className="bg-gradient-to-b from-[#e8e8e8] to-[#d0d0d0] px-5 py-2.5 border-b border-[#b8b8b8] flex items-center gap-2">
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

        {/* 링크 리스트 */}
        <div className="bg-[#f8f9fa] p-5">
          <ul className="flex flex-wrap gap-6 text-sm">
            <li>
              <a
                className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#5e9ed6] transition-colors font-semibold"
                rel="noopener noreferrer"
                target="_blank"
                href="/rss"
              >
                <span>→</span>
                <span>RSS</span>
              </a>
            </li>
            <li>
              <a
                className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#5e9ed6] transition-colors font-semibold"
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/vercel/next.js"
              >
                <span>→</span>
                <span>GitHub</span>
              </a>
            </li>
            <li>
              <a
                className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#5e9ed6] transition-colors font-semibold"
                rel="noopener noreferrer"
                target="_blank"
                href="https://vercel.com/templates/next.js/portfolio-starter-kit"
              >
                <span>→</span>
                <span>View Source</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="text-center text-xs text-[#999] font-medium">
        © {new Date().getFullYear()} MIT Licensed
      </p>
    </footer>
  );
}
