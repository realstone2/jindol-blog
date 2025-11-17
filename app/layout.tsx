import "./global.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { baseUrl } from "./sitemap";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Next.js Portfolio Starter",
    template: "%s | Next.js Portfolio Starter",
  },
  description: "This is my portfolio.",
  openGraph: {
    title: "My Portfolio",
    description: "This is my portfolio.",
    url: baseUrl,
    siteName: "My Portfolio",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cx("text-black", GeistSans.variable, GeistMono.variable)}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* iPod Classic 스타일 폰트 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&family=SF+Pro+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased relative min-h-screen"
        style={{
          fontFamily:
            "'SF Pro Display', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* iPod Classic 스타일 - 심플한 그레이 배경 */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#e8e8e8] via-[#f0f0f0] to-[#e0e0e0]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.5),transparent_60%)]"></div>
        </div>

        <main className="max-w-5xl mx-auto sm:px-8 h-screen flex flex-col pb-24">
          <div className="flex-1 flex flex-col">{children}</div>
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  );
}
