#!/usr/bin/env tsx

/**
 * 노션 페이지 "하나"만 동기화하는 스크립트 (초안 오발행 방지용)
 *
 * 실행: pnpm sync-one <노션 페이지 ID>
 * 예:   pnpm sync-one 394f4343-7bda-8159-9b8b-c1f00948d90b
 */

// .env.local / .env 로드 (반드시 첫 번째 import)
import "./load-env";

import { Client } from "@notionhq/client";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import {
  extractMetadata,
  generateFrontmatter,
  convertPageToMarkdown,
  type NotionPage,
} from "./notion-to-markdown";
import { getTranslation } from "./translate";

const pageId = process.argv[2];
if (!pageId) {
  console.error("사용법: pnpm sync-one <노션 페이지 ID>");
  process.exit(1);
}

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function main() {
  const page = (await notion.pages.retrieve({ page_id: pageId })) as NotionPage;
  const metadata = extractMetadata(page);
  console.log(`📝 동기화: ${metadata.title} (${metadata.slug})`);

  const markdown = await convertPageToMarkdown(notion, page.id, metadata.slug);

  const postsDir = join(process.cwd(), "content", "posts");
  const koDir = join(postsDir, "ko");
  const enDir = join(postsDir, "en");
  await mkdir(koDir, { recursive: true });
  await mkdir(enDir, { recursive: true });

  const koContent = `${generateFrontmatter({ ...metadata, language: "ko" })}\n\n${markdown}`;
  await writeFile(join(koDir, `${metadata.slug}.mdx`), koContent, "utf-8");
  console.log(`✅ ko/${metadata.slug}.mdx`);

  if (process.env.GEMINI_API_KEY) {
    console.log("🌐 영어 번역 중…");
    const enContent = await getTranslation(metadata.slug, koContent);
    if (enContent) {
      await writeFile(join(enDir, `${metadata.slug}.mdx`), enContent, "utf-8");
      console.log(`✅ en/${metadata.slug}.mdx`);
    } else {
      console.warn("⚠️ 번역 실패 — 한국어 버전만 저장됨");
    }
  }
}

main().catch((error) => {
  console.error("❌ 동기화 실패:", error);
  process.exit(1);
});
