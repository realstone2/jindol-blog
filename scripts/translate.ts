/**
 * Gemini API를 사용한 자동 번역 유틸리티
 */

// .env.local / .env 로드 (반드시 첫 번째 import)
import "./load-env";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createHash } from "crypto";
import { join } from "path";
import { readFile, writeFile } from "fs/promises";

/**
 * Gemini 클라이언트 (지연 초기화)
 *
 * 모듈 로드 시점에 키를 읽으면 호출하는 쪽의 import 순서에 따라
 * .env 주입보다 먼저 평가될 수 있어, 실제 사용 시점에 읽는다.
 */
let genAIInstance: GoogleGenerativeAI | null | undefined;

function getGenAI(): GoogleGenerativeAI | null {
  if (genAIInstance !== undefined) {
    return genAIInstance;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn(
      "⚠️  GEMINI_API_KEY가 설정되지 않아 번역 기능이 비활성화됩니다."
    );
    genAIInstance = null;
    return genAIInstance;
  }

  genAIInstance = new GoogleGenerativeAI(apiKey);
  return genAIInstance;
}

/**
 * 번역 캐시 타입
 */
interface TranslationCache {
  [slug: string]: {
    sourceHash: string;
    translatedAt: string;
    translatedBy: string;
  };
}

/**
 * 번역 캐시 파일 경로
 */
const CACHE_PATH = join(process.cwd(), ".translation-cache.json");

/**
 * 번역 캐시 읽기
 */
async function readCache(): Promise<TranslationCache> {
  try {
    const content = await readFile(CACHE_PATH, "utf-8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

/**
 * 번역 캐시 저장
 */
async function writeCache(cache: TranslationCache): Promise<void> {
  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2), "utf-8");
}

/**
 * 콘텐츠의 해시값 생성
 */
function createContentHash(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

/**
 * 번역이 필요한지 확인 (캐시 체크)
 */
async function needsTranslation(
  slug: string,
  content: string
): Promise<boolean> {
  const cache = await readCache();
  const cached = cache[slug];

  if (!cached) {
    return true; // 캐시에 없음
  }

  const currentHash = createContentHash(content);
  return cached.sourceHash !== currentHash; // 내용이 변경됨
}

/**
 * 번역 프롬프트 생성
 */
function createTranslationPrompt(content: string): string {
  return `You are a professional technical translator specializing in software engineering content.

Task: Translate the following Korean blog post to natural, fluent English.

CRITICAL REQUIREMENTS:
1. Preserve ALL Markdown syntax EXACTLY (##, ###, -, *, \`, \`\`\`, >, [], (), etc.)
2. DO NOT translate:
   - Code blocks (content inside \`\`\` \`\`\`)
   - Code snippets (content inside \` \`)
   - URLs and links
   - File paths and file names
   - Package names and technical identifiers
   - HTML/JSX tags
3. Translate frontmatter fields:
   - title: Translate to natural English
   - summary: Translate to natural English
   - Keep other fields (publishedAt, language, tags) unchanged
   - Change language field value from "ko" to "en"
4. Maintain professional, technical writing style
5. Use standard technical terminology
6. Keep the same structure and formatting

ORIGINAL KOREAN CONTENT:
---
${content}
---

Provide ONLY the translated content in English. Do not add explanations or comments.

TRANSLATED ENGLISH CONTENT:`;
}

/**
 * Gemini API를 사용하여 번역
 */
export async function translateToEnglish(
  content: string,
  retries: number = 5 // 재시도 횟수 증가
): Promise<string | null> {
  const genAI = getGenAI();

  if (!genAI) {
    console.error("❌ Gemini API가 초기화되지 않았습니다.");
    return null;
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", // 더 안정적인 모델 (할당량: 분당 1500회)
    generationConfig: {
      temperature: 0.3, // 일관성 있는 번역을 위해 낮은 값
      topP: 0.8,
      topK: 40,
    },
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`  🔄 번역 시도 ${attempt}/${retries}...`);

      const prompt = createTranslationPrompt(content);
      const result = await model.generateContent(prompt);
      const translated = result.response.text();

      // 기본 검증: Markdown frontmatter 존재 여부 확인
      if (!translated.includes("---")) {
        throw new Error("번역 결과에 frontmatter가 없습니다.");
      }

      // language 필드가 en으로 변경되었는지 확인
      if (translated.includes('language: "ko"')) {
        translated.replace('language: "ko"', 'language: "en"');
      }

      return translated;
    } catch (error) {
      console.error(
        `  ❌ 번역 시도 ${attempt} 실패:`,
        error instanceof Error ? error.message : error
      );

      if (attempt < retries) {
        // Rate limit 대응: 지수 백오프 (더 긴 대기 시간)
        const waitTime = Math.pow(2, attempt) * 5000; // 5초, 10초, 20초
        console.log(`  ⏳ ${waitTime / 1000}초 후 재시도...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  return null;
}

/**
 * 블로그 포스트를 영어로 번역하고 저장
 */
export async function translatePost(
  slug: string,
  koreanContent: string
): Promise<boolean> {
  try {
    console.log(`  📝 번역 중: ${slug}`);

    // 캐시 확인
    const needsUpdate = await needsTranslation(slug, koreanContent);
    if (!needsUpdate) {
      console.log(`  ✅ 캐시됨, 번역 스킵: ${slug}`);
      return true;
    }

    // 번역 실행
    const translated = await translateToEnglish(koreanContent);

    if (!translated) {
      console.error(`  ❌ 번역 실패: ${slug}`);
      return false;
    }

    console.log(`  ✅ 번역 완료: ${slug}`);

    // 캐시 업데이트
    const cache = await readCache();
    cache[slug] = {
      sourceHash: createContentHash(koreanContent),
      translatedAt: new Date().toISOString(),
      translatedBy: "gemini-1.5-flash-latest",
    };
    await writeCache(cache);

    return true;
  } catch (error) {
    console.error(`  ❌ 번역 중 에러 발생 (${slug}):`, error);
    return false;
  }
}

/**
 * 번역 결과 반환 (파일 저장하지 않고)
 */
export async function getTranslation(
  slug: string,
  koreanContent: string
): Promise<string | null> {
  try {
    // 번역 실행
    const translated = await translateToEnglish(koreanContent);

    if (!translated) {
      return null;
    }

    // 캐시 업데이트
    const cache = await readCache();
    cache[slug] = {
      sourceHash: createContentHash(koreanContent),
      translatedAt: new Date().toISOString(),
      translatedBy: "gemini-1.5-flash-latest",
    };
    await writeCache(cache);

    return translated;
  } catch (error) {
    console.error(`  ❌ 번역 중 에러 발생 (${slug}):`, error);
    return null;
  }
}
