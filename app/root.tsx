import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
];
import { Nav } from "~/components/nav";
import { Footer } from "~/components/footer";
import { siteConfig } from "~/config/site";
import { getMessages } from "~/lib/messages";
import { langFromPath, LOCALE_REDIRECT_SCRIPT, localePath } from "~/lib/locale";
import type { Lang } from "~/lib/types";

function useLang(): Lang {
  return langFromPath(useLocation().pathname);
}

export function Layout({ children }: { children: React.ReactNode }) {
  const lang = useLang();

  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* 첫 페인트 전 쿠키 기반 언어 경로 리다이렉트 */}
        <script dangerouslySetInnerHTML={{ __html: LOCALE_REDIRECT_SCRIPT }} />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col">
        <Nav lang={lang} />
        <div className="flex-1">{children}</div>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const lang = useLang();
  const t = getMessages(lang);
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  let details: string | undefined;
  let stack: string | undefined;
  if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="mx-auto max-w-[780px] px-6 py-24 text-center sm:px-11">
      <div className="mb-3 text-[13px] font-bold tracking-[0.18em] text-wood-soft">
        {is404 ? "404" : "ERROR"}
      </div>
      <h1 className="mb-4 text-[34px] font-extrabold tracking-[-0.03em] text-ink">
        {is404 ? t.notFound.title : siteConfig.title[lang]}
      </h1>
      <p className="mb-10 text-[15px] text-faint">
        {details ?? t.notFound.description}
      </p>
      <Link
        to={localePath(lang, "/")}
        className="inline-block rounded-full bg-highlight px-7 py-3 text-[14.5px] font-bold text-ink transition-opacity hover:opacity-85"
      >
        {t.notFound.home}
      </Link>
      {stack && (
        <pre className="mt-12 overflow-x-auto rounded-xl bg-code-bg p-6 text-left text-[13px] leading-relaxed text-code-text">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
