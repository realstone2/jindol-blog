/**
 * 노션 이미지를 S3에 업로드하고 URL을 관리하는 유틸리티
 *
 * 주요 기능:
 * - 노션 이미지 다운로드
 * - Sharp를 사용한 이미지 최적화 (WebP 변환)
 * - S3 업로드
 * - 해시 기반 캐싱으로 중복 업로드 방지
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { createHash } from "crypto";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

// S3 클라이언트 초기화
let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    const region = process.env.AWS_REGION || "ap-northeast-2";
    s3Client = new S3Client({ region });
  }
  return s3Client;
}

// 캐시 파일 경로
const CACHE_FILE_PATH = join(process.cwd(), ".upload-cache.json");

// 캐시 타입 정의
interface ImageCache {
  [key: string]: string; // cacheKey -> S3 URL
}

/**
 * 캐시 파일 로드
 */
async function loadCache(): Promise<ImageCache> {
  try {
    if (existsSync(CACHE_FILE_PATH)) {
      const content = await readFile(CACHE_FILE_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn("⚠️  캐시 파일 로드 실패, 새로운 캐시를 생성합니다.");
  }
  return {};
}

/**
 * 캐시 파일 저장
 */
async function saveCache(cache: ImageCache): Promise<void> {
  try {
    await writeFile(CACHE_FILE_PATH, JSON.stringify(cache, null, 2), "utf-8");
  } catch (error) {
    console.error("❌ 캐시 파일 저장 실패:", error);
  }
}

/**
 * 이미지 최적화 (WebP 변환, 리사이징)
 */
async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  try {
    return await sharp(buffer)
      .resize(1920, undefined, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();
  } catch (error) {
    console.error("❌ 이미지 최적화 실패:", error);
    // 최적화 실패 시 원본 반환
    return buffer;
  }
}

/**
 * S3에 이미지 업로드
 */
async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string = "image/webp"
): Promise<string> {
  const bucketName = process.env.S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("S3_BUCKET_NAME 환경 변수가 설정되지 않았습니다.");
  }

  const s3 = getS3Client();

  // 재시도 로직 (최대 3회)
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: contentType,
          CacheControl: "public, max-age=31536000, immutable",
        })
      );

      // URL 생성 (CloudFront 사용 시 CloudFront URL, 아니면 S3 URL)
      const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN;
      if (cloudFrontDomain) {
        return `https://${cloudFrontDomain}/${key}`;
      } else {
        const region = process.env.AWS_REGION || "ap-northeast-2";
        return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
      }
    } catch (error) {
      attempts++;
      console.error(
        `❌ S3 업로드 실패 (시도 ${attempts}/${maxAttempts}):`,
        error
      );

      if (attempts >= maxAttempts) {
        throw error;
      }

      // 재시도 전 대기 (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
    }
  }

  throw new Error("S3 업로드 실패: 최대 재시도 횟수 초과");
}

/**
 * 노션 이미지 URL을 다운로드하여 S3에 업로드
 *
 * @param notionUrl 노션 이미지 URL
 * @param slug 블로그 포스트 슬러그
 * @returns S3 URL 또는 null (실패 시)
 */
export async function uploadImageToS3(
  notionUrl: string,
  slug: string
): Promise<string | null> {
  try {
    // 1. 이미지 다운로드
    const response = await fetch(notionUrl);
    if (!response.ok) {
      console.error(
        `❌ 이미지 다운로드 실패 (${response.status}): ${notionUrl}`
      );
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. 해시 계산 (MD5, 앞 8자리만 사용)
    const hash = createHash("md5")
      .update(new Uint8Array(arrayBuffer))
      .digest("hex")
      .slice(0, 8);

    // 3. 캐시 확인
    const cache = await loadCache();
    const cacheKey = `${slug}:${hash}`;

    if (cache[cacheKey]) {
      console.log(`  ♻️  캐시된 이미지 사용: ${hash}.webp`);
      return cache[cacheKey];
    }

    // 4. 이미지 최적화
    const optimized = await optimizeImage(buffer);

    // 5. S3 업로드
    const key = `posts/${slug}/${hash}.webp`;
    console.log(`  📤 S3 업로드 중: ${key}`);
    const s3Url = await uploadToS3(optimized, key, "image/webp");

    // 6. 캐시 업데이트
    cache[cacheKey] = s3Url;
    await saveCache(cache);

    console.log(`  ✅ S3 업로드 완료: ${hash}.webp`);
    return s3Url;
  } catch (error) {
    console.error(`❌ 이미지 업로드 실패: ${notionUrl}`, error);
    return null;
  }
}

/**
 * Markdown 내용에서 노션 이미지 URL을 S3 URL로 교체
 *
 * @param markdown 원본 Markdown 내용
 * @param slug 블로그 포스트 슬러그
 * @returns S3 URL로 교체된 Markdown 내용
 */
export async function replaceImageUrls(
  markdown: string,
  slug: string
): Promise<string> {
  // AWS 환경 변수가 없으면 원본 그대로 반환
  if (!process.env.S3_BUCKET_NAME || !process.env.AWS_ACCESS_KEY_ID) {
    console.log("  ℹ️  AWS 설정이 없어 이미지 업로드를 건너뜁니다.");
    return markdown;
  }

  // 노션 이미지 URL 패턴 (Markdown 이미지 문법에서 추출)
  // ![alt](https://prod-files-secure.s3.us-west-2.amazonaws.com/...)
  const imageRegex = /!\[([^\]]*)\]\((https:\/\/[^\)]+)\)/g;

  let result = markdown;
  const matches = Array.from(markdown.matchAll(imageRegex));

  if (matches.length === 0) {
    return markdown;
  }

  console.log(`  🖼️  ${matches.length}개의 이미지 발견`);

  for (const match of matches) {
    const fullMatch = match[0];
    const alt = match[1];
    const originalUrl = match[2];

    // 노션 이미지 URL만 처리 (S3 또는 file.notion.so 도메인)
    if (
      !originalUrl.includes("amazonaws.com") &&
      !originalUrl.includes("notion.so")
    ) {
      continue;
    }

    // S3에 업로드
    const s3Url = await uploadImageToS3(originalUrl, slug);

    if (s3Url) {
      // Markdown 이미지 구문 교체
      const newImageMarkdown = `![${alt}](${s3Url})`;
      result = result.replace(fullMatch, newImageMarkdown);
    } else {
      console.warn(`  ⚠️  이미지 업로드 실패, 원본 URL 유지: ${originalUrl}`);
    }
  }

  return result;
}

/**
 * 캐시 초기화 (디버깅용)
 */
export async function clearCache(): Promise<void> {
  try {
    await writeFile(CACHE_FILE_PATH, "{}", "utf-8");
    console.log("✅ 캐시를 초기화했습니다.");
  } catch (error) {
    console.error("❌ 캐시 초기화 실패:", error);
  }
}
