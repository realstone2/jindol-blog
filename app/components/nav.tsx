import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";
import { getUserLanguage } from "app/lib/language";

const navItems = {
  "/": {
    name: "home",
  },
  "/blog": {
    name: "blog",
  },
  "https://vercel.com/templates/next.js/portfolio-starter-kit": {
    name: "deploy",
  },
};

export async function Navbar() {
  const lang = await getUserLanguage();

  return (
    <aside className="mb-16">
      <div className="lg:sticky lg:top-8 z-50">
        {/* iPod LCD Screen 네비게이션 */}
        <nav
          className="bg-white rounded-2xl border-2 border-[#d4d4d4] overflow-hidden"
          style={{
            boxShadow:
              "0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
          }}
          id="nav"
        >
          {/* 상단 헤더 */}
          <div className="bg-gradient-to-b from-[#e8e8e8] to-[#d0d0d0] px-5 py-2.5 border-b border-[#b8b8b8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#666]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
              </svg>
              <span className="text-xs font-semibold text-[#333] tracking-wide uppercase">
                Menu
              </span>
            </div>
            <LanguageSwitcher lang={lang} />
          </div>

          {/* 메뉴 아이템들 */}
          <div className="bg-[#f8f9fa] p-3 flex items-center gap-1">
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  className="group px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-[#5e9ed6] hover:to-[#4a8ec4] transition-all"
                >
                  <span className="font-semibold text-[#1a1a1a] group-hover:text-white text-sm uppercase tracking-wide">
                    {name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
