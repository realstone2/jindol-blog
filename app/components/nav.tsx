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
    <aside className="mb-20">
      <div className="lg:sticky lg:top-8 z-50">
        <nav
          className="flex flex-row items-center relative backdrop-blur-3xl bg-white/30 rounded-[20px] p-3 border border-white/30"
          style={{
            boxShadow:
              "0 8px 32px 0 rgba(139, 99, 76, 0.15), inset 0 1px 1px 0 rgba(255, 255, 255, 0.7), inset 0 -1px 1px 0 rgba(255, 248, 240, 0.5)",
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)",
          }}
          id="nav"
        >
          <div className="flex flex-row items-center justify-between space-x-1 w-full">
            <div className="flex flex-row items-center space-x-1">
              {Object.entries(navItems).map(([path, { name }]) => {
                return (
                  <Link
                    key={path}
                    href={path}
                    className="transition-all hover:bg-white/40 active:scale-95 flex align-middle relative py-2.5 px-5 rounded-[14px] font-semibold text-[#3E3028] hover:shadow-sm"
                    style={{
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
            <LanguageSwitcher lang={lang} />
          </div>
        </nav>
      </div>
    </aside>
  );
}
