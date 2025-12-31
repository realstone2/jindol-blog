#!/usr/bin/env tsx

/**
 * 노션 API와 동기화하여 블로그 포스트를 가져오는 스크립트
 *
 * 실행 방법:
 * - 빌드 시 자동 실행: pnpm build
 * - 수동 실행: pnpm sync-notion
 */

// .env.local 파일 로드
import { config } from "dotenv";
import { existsSync } from "fs";
import { join } from "path";

const envPath = join(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  config({ path: envPath });
}

import { Client } from "@notionhq/client";
import { writeFile, mkdir, readdir } from "fs/promises";
import {
  extractMetadata,
  generateFrontmatter,
  convertPageToMarkdown,
  type NotionPage,
} from "./notion-to-markdown";
import { getTranslation } from "./translate";

// 환경 변수 검증
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  console.error("❌ 에러: 필수 환경 변수가 설정되지 않았습니다.");
  console.error("");
  console.error("다음 환경 변수를 설정해주세요:");
  console.error("  - NOTION_API_KEY (필수)");
  console.error("  - NOTION_DATABASE_ID (필수)");
  console.error("  - GEMINI_API_KEY (선택, 자동 번역용)");
  console.error("");
  console.error("로컬 개발: .env.local 파일에 설정");
  console.error("프로덕션: Vercel 환경 변수에 설정");
  process.exit(1);
}

if (!GEMINI_API_KEY) {
  console.warn(
    "⚠️  GEMINI_API_KEY가 설정되지 않아 자동 번역이 비활성화됩니다."
  );
  console.warn("   한국어 버전만 생성됩니다.");
  console.warn("");
}

// 노션 클라이언트 초기화
const notion = new Client({
  auth: NOTION_API_KEY,
});

/**
 * 기존 MDX 파일 목록 가져오기
 * ko와 en 디렉토리에서 파일명(slug) 목록을 반환
 */
async function getExistingSlugs(postsDir: string): Promise<Set<string>> {
  const existingSlugs = new Set<string>();
  const koDir = join(postsDir, "ko");
  const enDir = join(postsDir, "en");

  try {
    // 한국어 디렉토리에서 파일 목록 가져오기
    if (existsSync(koDir)) {
      const koFiles = await readdir(koDir);
      koFiles
        .filter((file) => file.endsWith(".mdx"))
        .forEach((file) => {
          const slug = file.replace(/\.mdx$/, "");
          existingSlugs.add(slug);
        });
    }

    // 영어 디렉토리에서 파일 목록 가져오기
    if (existsSync(enDir)) {
      const enFiles = await readdir(enDir);
      enFiles
        .filter((file) => file.endsWith(".mdx"))
        .forEach((file) => {
          const slug = file.replace(/\.mdx$/, "");
          existingSlugs.add(slug);
        });
    }
  } catch (error) {
    console.warn("⚠️  기존 파일 목록을 가져오는 중 에러 발생:", error);
  }

  return existingSlugs;
}

/**
 * 노션 데이터베이스에서 모든 페이지 가져오기
 * (Status 필터 없이 모든 페이지를 가져옴)
 */
async function fetchPublishedPages(): Promise<NotionPage[]> {
  // 이미 위에서 검증했지만 TypeScript를 위해 타입 단언
  if (!NOTION_DATABASE_ID) {
    throw new Error("NOTION_DATABASE_ID가 설정되지 않았습니다.");
  }

  try {
    console.log("📥 노션에서 페이지를 가져오는 중...");

    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      // Status 필터 제거 - 모든 페이지 가져오기
      sorts: [
        {
          property: "date",
          direction: "descending",
        },
      ],
    });

    console.log(`✅ ${response.results.length}개의 페이지를 가져왔습니다.`);
    return response.results as NotionPage[];
  } catch (error) {
    // date 정렬 실패 시 createDate로 시도
    try {
      console.log("⚠️  date 정렬 실패, createDate로 시도...");
      const response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        sorts: [
          {
            property: "createDate",
            direction: "descending",
          },
        ],
      });

      console.log(`✅ ${response.results.length}개의 페이지를 가져왔습니다.`);
      return response.results as NotionPage[];
    } catch (fallbackError) {
      // createDate도 실패 시 created_time으로 정렬 시도
      try {
        console.log("⚠️  createDate 정렬 실패, 기본 정렬로 시도...");
        const response = await notion.databases.query({
          database_id: NOTION_DATABASE_ID,
        });

        // created_time 기준으로 정렬
        const sorted = (response.results as NotionPage[]).sort((a, b) => {
          return (
            new Date(b.created_time).getTime() -
            new Date(a.created_time).getTime()
          );
        });

        console.log(`✅ ${sorted.length}개의 페이지를 가져왔습니다.`);
        return sorted;
      } catch (finalError) {
        console.error("❌ 노션 페이지를 가져오는 중 에러 발생:", finalError);
        throw finalError;
      }
    }
  }
}

/**
 * 페이지를 MDX 파일로 저장 (한국어 + 영어 번역)
 */
async function savePageAsMDX(
  page: NotionPage,
  postsDir: string
): Promise<void> {
  try {
    // 메타데이터 추출
    const metadata = extractMetadata(page);
    console.log(`\n  📝 처리 중: ${metadata.title} (${metadata.slug})`);

    // Markdown 변환
    const markdown = await convertPageToMarkdown(
      notion,
      page.id,
      metadata.slug
    );

    // 언어별 디렉토리 생성
    const koDir = join(postsDir, "ko");
    const enDir = join(postsDir, "en");
    await mkdir(koDir, { recursive: true });
    await mkdir(enDir, { recursive: true });

    // Frontmatter 생성 (한국어 버전)
    const koMetadata = { ...metadata, language: "ko" };
    const koFrontmatter = generateFrontmatter(koMetadata);

    // 최종 MDX 내용 (한국어)
    const koContent = `${koFrontmatter}\n\n${markdown}`;

    // 한국어 파일 저장 (ko/{slug}.mdx)
    const koFilePath = join(koDir, `${metadata.slug}.mdx`);
    await writeFile(koFilePath, koContent, "utf-8");
    console.log(`  ✅ 한국어 저장: ko/${metadata.slug}.mdx`);

    // 영어 번역 (Gemini API 사용)
    if (GEMINI_API_KEY) {
      console.log(`  🌐 영어로 번역 중...`);

      const enContent = await getTranslation(metadata.slug, koContent);

      if (enContent) {
        // 영어 파일 저장 (en/{slug}.mdx)
        const enFilePath = join(enDir, `${metadata.slug}.mdx`);
        await writeFile(enFilePath, enContent, "utf-8");
        console.log(`  ✅ 영어 저장: en/${metadata.slug}.mdx`);
      } else {
        console.warn(`  ⚠️  영어 번역 실패: ${metadata.slug}`);
        console.warn(`     한국어 버전만 사용 가능합니다.`);
      }
    }
  } catch (error) {
    console.error(`  ❌ 페이지 저장 실패 (${page.id}):`, error);
    // 개별 페이지 실패 시 계속 진행
  }
}

/**
 * 메인 동기화 함수
 */
async function syncNotion() {
  console.log("🚀 노션 동기화 시작\n");

  try {
    // 포스트 디렉토리 경로
    const postsDir = join(process.cwd(), "app", "blog", "posts");

    // 디렉토리 생성 (없는 경우)
    await mkdir(postsDir, { recursive: true });

    // 기존 파일 목록 가져오기
    const existingSlugs = await getExistingSlugs(postsDir);
    if (existingSlugs.size > 0) {
      console.log(`📋 기존 파일 ${existingSlugs.size}개를 확인했습니다.`);
    }

    // Published 페이지 가져오기
    const pages = await fetchPublishedPages();

    if (pages.length === 0) {
      console.log("ℹ️  동기화할 페이지가 없습니다.");
      return;
    }

    console.log("\n📝 페이지를 MDX로 변환하는 중...\n");

    // 각 페이지를 MDX로 변환하여 저장
    let processedCount = 0;
    let skippedCount = 0;

    for (const page of pages) {
      // 메타데이터 추출하여 slug 확인
      const metadata = extractMetadata(page);
      const slug = metadata.slug;

      // 날짜 데이터가 있는지 확인 (date 필드만 확인)
      const hasDateField = page.properties.date?.date?.start;

      if (!hasDateField) {
        console.log(
          `  ⏭️  건너뜀: ${metadata.title} (${slug}) - 날짜 데이터 없음`
        );
        skippedCount++;
        continue;
      }

      // 이미 존재하는 ID인지 확인
      if (existingSlugs.has(slug)) {
        console.log(`  ⏭️  건너뜀: ${metadata.title} (${slug}) - 이미 존재함`);
        skippedCount++;
        continue;
      }

      // 새 페이지 처리
      await savePageAsMDX(page, postsDir);
      processedCount++;
    }

    console.log("\n✨ 노션 동기화 완료!");
    console.log(`📊 총 ${pages.length}개의 페이지 중:`);
    console.log(`   - 새로 처리: ${processedCount}개`);
    console.log(`   - 건너뜀: ${skippedCount}개`);

    if (GEMINI_API_KEY) {
      console.log(`🌐 각 페이지는 한국어와 영어 버전으로 생성되었습니다.`);
    } else {
      console.log(`📝 한국어 버전만 생성되었습니다. (GEMINI_API_KEY 미설정)`);
    }
  } catch (error) {
    console.error("\n❌ 동기화 중 에러 발생:", error);

    // 노션 API 에러인 경우 상세 정보 출력
    if (error instanceof Error) {
      console.error("\n에러 상세:");
      console.error(error.message);

      if ("code" in error) {
        console.error(`에러 코드: ${(error as any).code}`);
      }
    }

    // 빌드는 실패하지 않도록 (fallback to existing files)
    console.log("\n⚠️  기존 로컬 파일을 사용합니다.");
    process.exit(0); // 빌드를 계속 진행
  }
}

// 스크립트 실행
syncNotion();
