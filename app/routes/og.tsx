import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { data } from "react-router";
import type { Route } from "./+types/og";
import { siteConfig } from "~/config/site";
import { getBlogPost } from "~/lib/posts.server";

let fontCache: { bold: Buffer; extraBold: Buffer } | null = null;

function loadFonts() {
  if (!fontCache) {
    const staticDir = path.join(
      process.cwd(),
      "node_modules",
      "pretendard",
      "dist",
      "public",
      "static",
    );
    fontCache = {
      bold: fs.readFileSync(path.join(staticDir, "Pretendard-Bold.otf")),
      extraBold: fs.readFileSync(
        path.join(staticDir, "Pretendard-ExtraBold.otf"),
      ),
    };
  }
  return fontCache;
}

/** 포스트별 OG 이미지 — 빌드 타임에 /og/:slug.png 로 프리렌더 (우드 팔레트) */
export async function loader({ params }: Route.LoaderArgs) {
  if (!params.file.endsWith(".png")) {
    throw data(null, { status: 404 });
  }
  const slug = params.file.slice(0, -4);

  let title = siteConfig.title.ko;
  if (slug !== "home") {
    const result = getBlogPost(slug, "ko");
    if (!result) {
      throw data(null, { status: 404 });
    }
    title = result.post.metadata.title;
  }

  const fonts = loadFonts();

  const svg = await satori(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        backgroundColor: "#FBF6EE",
        fontFamily: "Pretendard",
      }}
    >
      <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#33291E" }}>
        <span>{siteConfig.logo.name}</span>
        <span style={{ color: "#A9613A" }}>{siteConfig.logo.suffix}</span>
      </div>
      <div
        style={{
          fontSize: 64,
          fontWeight: 800,
          lineHeight: 1.3,
          letterSpacing: "-0.03em",
          color: "#33291E",
          maxWidth: 980,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 24, color: "#7A6C58" }}>
          {siteConfig.author.name.ko}
        </div>
        <div
          style={{
            width: 220,
            height: 10,
            borderRadius: 999,
            backgroundColor: "#E7B37F",
          }}
        />
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Pretendard", data: fonts.bold, weight: 700, style: "normal" },
        {
          name: "Pretendard",
          data: fonts.extraBold,
          weight: 800,
          style: "normal",
        },
      ],
    },
  );

  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  })
    .render()
    .asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
