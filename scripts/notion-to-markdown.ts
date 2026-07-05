/**
 * 노션 블록을 Markdown으로 변환하는 유틸리티
 */

import { NotionToMarkdown } from "notion-to-md";
import type { Client } from "@notionhq/client";
import { replaceImageUrls } from "./upload-images";

export interface NotionPage {
  id: string;
  properties: any;
  created_time: string;
  last_edited_time: string;
}

export interface PageMetadata {
  title: string;
  publishedAt: string;
  summary: string;
  tags: string[];
  language: string;
  slug: string;
}

/**
 * 노션 페이지의 속성을 파싱하여 메타데이터 추출
 *
 * 데이터베이스 컬럼 구조:
 * - title: 제목
 * - content: 본문 (페이지 블록에서 가져옴)
 * - tag: 태그
 * - createDate: 생성일
 * - slug: Notion 페이지 UUID 사용
 */
export function extractMetadata(page: NotionPage): PageMetadata {
  const properties = page.properties;

  // 제목 추출 (title 컬럼)
  const title =
    properties.title?.title?.[0]?.plain_text ||
    properties.Title?.title?.[0]?.plain_text ||
    properties.Name?.title?.[0]?.plain_text ||
    "Untitled";

  // 생성일 추출 (date 컬럼 우선, 그 다음 createDate 컬럼)
  const publishedAt =
    properties.date?.date?.start ||
    properties["date"]?.date?.start ||
    properties["Date"]?.date?.start ||
    properties.createDate?.date?.start ||
    properties["createDate"]?.date?.start ||
    properties["Create Date"]?.date?.start ||
    properties["Published Date"]?.date?.start ||
    page.created_time.split("T")[0];

  // 요약 추출 (없으므로 빈 문자열)
  const summary = "";

  // 태그 추출 (tag 컬럼)
  let tags: string[] = [];

  if (properties.tag?.multi_select) {
    // Multi-select 타입
    tags = properties.tag.multi_select.map((tag: any) => tag.name);
  } else if (properties.tag?.select) {
    // Single select 타입
    tags = properties.tag.select.name ? [properties.tag.select.name] : [];
  } else if (properties.Tag?.multi_select) {
    // 대문자 T로 시작하는 경우
    tags = properties.Tag.multi_select.map((tag: any) => tag.name);
  } else if (properties.Tags?.multi_select) {
    // 복수형
    tags = properties.Tags.multi_select.map((tag: any) => tag.name);
  } else if (properties.tag?.rich_text) {
    // Rich text 타입 — 쉼표 구분 문자열 (예: "React, 반응형, SSR")
    tags = properties.tag.rich_text
      .map((segment: any) => segment.plain_text ?? "")
      .join("")
      .split(",")
      .map((tag: string) => tag.trim())
      .filter(Boolean);
  }

  // 언어는 기본값으로 한국어 (자동 번역으로 영어 생성)
  const language = "ko";

  // Slug는 Notion 페이지 UUID 사용 (하이픈 제거)
  const slug = page.id.replace(/-/g, "");

  return {
    title,
    publishedAt,
    summary,
    tags,
    language,
    slug,
  };
}

/**
 * 메타데이터를 Frontmatter 문자열로 변환
 */
export function generateFrontmatter(metadata: PageMetadata): string {
  return `---
title: "${metadata.title.replace(/"/g, '\\"')}"
publishedAt: "${metadata.publishedAt}"
summary: "${metadata.summary.replace(/"/g, '\\"')}"
language: "${metadata.language}"
tags: [${metadata.tags.map((tag) => `"${tag}"`).join(", ")}]
---`;
}

/**
 * 노션 페이지를 Markdown으로 변환
 */
export async function convertPageToMarkdown(
  notion: Client,
  pageId: string,
  slug: string = ""
): Promise<string> {
  const n2m = new NotionToMarkdown({ notionClient: notion });

  // 커스텀 변환기 설정
  n2m.setCustomTransformer("callout", async (block) => {
    const { callout } = block as any;
    const icon = callout.icon?.emoji || "💡";
    const text = callout.rich_text.map((t: any) => t.plain_text).join("");

    return `> ${icon} **Note:** ${text}`;
  });

  n2m.setCustomTransformer("toggle", async (block) => {
    const { toggle } = block as any;
    const text = toggle.rich_text.map((t: any) => t.plain_text).join("");

    return `<details>\n<summary>${text}</summary>\n\n</details>`;
  });

  try {
    // 마크다운 블록 가져오기
    const mdBlocks = await n2m.pageToMarkdown(pageId);

    if (!mdBlocks || mdBlocks.length === 0) {
      console.warn(`  ⚠️  페이지 ${pageId}에 블록이 없습니다.`);
      return "";
    }

    // 문자열로 변환
    const markdown = n2m.toMarkdownString(mdBlocks);

    // notion-to-md 라이브러리 반환값 구조에 따라 처리
    let markdownString = "";
    if (typeof markdown === "string") {
      markdownString = markdown;
    } else if (markdown && typeof markdown === "object") {
      // parent 속성이 있으면 사용
      if ("parent" in markdown && markdown.parent) {
        markdownString = markdown.parent;
      } else {
        // 없으면 객체를 문자열로 변환 시도
        markdownString = JSON.stringify(markdown);
      }
    }

    // 이미지 URL을 S3 URL로 교체
    if (slug && markdownString) {
      console.log(`  🖼️  이미지 처리 중...`);
      markdownString = await replaceImageUrls(markdownString, slug);
    }

    return markdownString;
  } catch (error) {
    console.error(`  ❌ 페이지 ${pageId} 변환 실패:`, error);
    return "";
  }
}

/**
 * 노션 이미지 URL을 추출하여 배열로 반환
 */
export async function extractImageUrls(
  notion: Client,
  pageId: string
): Promise<string[]> {
  const imageUrls: string[] = [];

  const blocks = await notion.blocks.children.list({
    block_id: pageId,
  });

  for (const block of blocks.results) {
    if ("type" in block) {
      if (block.type === "image") {
        const imageBlock = block as any;
        const url =
          imageBlock.image.type === "external"
            ? imageBlock.image.external.url
            : imageBlock.image.file.url;

        if (url) {
          imageUrls.push(url);
        }
      }
    }
  }

  return imageUrls;
}
