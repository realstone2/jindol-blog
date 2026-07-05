import { siteConfig } from "~/config/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-[1040px] flex-col items-center justify-between gap-3 px-6 py-8 text-[13.5px] text-faint-2 sm:flex-row sm:px-11">
        <div>
          © {new Date().getFullYear()} {siteConfig.logo.name}
          {siteConfig.logo.suffix}
        </div>
        <div className="flex gap-5 font-semibold">
          <a
            href={siteConfig.author.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-wood-strong"
          >
            GitHub
          </a>
          <a
            href={siteConfig.author.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-wood-strong"
          >
            LinkedIn
          </a>
          <a href="/rss" className="transition-colors hover:text-wood-strong">
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
