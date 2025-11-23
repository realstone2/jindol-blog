# PRD-05: 노션 이미지 → S3 Presigned URL

## 📋 개요

노션 이미지 URL의 만료 문제를 해결하기 위해 빌드 타임에 이미지를 S3에 업로드하고, Markdown의 이미지 경로를 안정적인 S3 URL로 교체하는 기능

---

## 🎯 배경 및 필요성

### 문제점

- 노션 이미지 URL은 1시간 후 만료됨
- 블로그에서 이미지가 깨지는 현상 발생

### 해결책

빌드 시 S3에 업로드하고 안정적인 URL로 교체

---

## 📝 기능 요구사항

- **FR-5.1**: 노션 콘텐츠에서 이미지 URL 추출
- **FR-5.2**: 이미지 다운로드 및 S3 버킷에 업로드
- **FR-5.3**: S3 URL로 Markdown의 이미지 경로 교체
- **FR-5.4**: 이미지 파일명: `{slug}/{hash}.{ext}` 형식
- **FR-5.5**: 중복 업로드 방지 (해시 기반 캐싱)

---

## 🔧 기술 요구사항

- **TR-5.1**: AWS SDK v3 (`@aws-sdk/client-s3`) 사용
- **TR-5.2**: 이미지 최적화 (`sharp` 라이브러리)
- **TR-5.3**: WebP 포맷 변환 고려
- **TR-5.4**: CloudFront CDN 연동 (선택사항)

---

## 📁 S3 버킷 구조

```
blog-images-bucket/
├── posts/
│   ├── my-post/
│   │   ├── abc123.webp
│   │   └── def456.webp
│   └── another-post/
│       └── ghi789.webp
└── .upload-cache.json
```

---

## 🔄 업로드 흐름

```
노션 이미지 URL 발견
    ↓
1. URL에서 이미지 다운로드
    ↓
2. 이미지 해시 계산 (MD5)
    ↓
3. 캐시에서 해시 확인
    ↓
4. 캐시 미스 → S3 업로드
   캐시 히트 → 기존 URL 사용
    ↓
5. S3 URL로 Markdown 내용 교체
    ↓
6. .upload-cache.json 업데이트
```

---

## 💻 이미지 최적화

```typescript
import sharp from "sharp";

async function optimizeImage(buffer: Buffer) {
  return sharp(buffer)
    .resize(1920, undefined, {
      // 최대 너비 1920px
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 85 }) // WebP 포맷으로 변환
    .toBuffer();
}
```

---

## 💻 S3 업로드 코드

```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const s3 = new S3Client({ region: "ap-northeast-2" });

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return `https://${process.env.S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/${key}`;
}
```

---

## 🔐 환경 변수

```env
AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=your-blog-images
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
CLOUDFRONT_DOMAIN=xxx.cloudfront.net  # 선택사항
```

---

## 💻 전체 구현 예시

```typescript
// scripts/upload-images.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { createHash } from "crypto";
import { readFile, writeFile } from "fs/promises";

const s3 = new S3Client({ region: process.env.AWS_REGION! });

async function uploadImage(notionUrl: string, slug: string): Promise<string> {
  // 1. 이미지 다운로드
  const response = await fetch(notionUrl);
  const buffer = Buffer.from(await response.arrayBuffer());

  // 2. 해시 계산
  const hash = createHash("md5").update(buffer).digest("hex").slice(0, 8);

  // 3. 캐시 확인
  const cache = await loadCache();
  const cacheKey = `${slug}:${hash}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  // 4. 이미지 최적화
  const optimized = await sharp(buffer)
    .resize(1920, undefined, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  // 5. S3 업로드
  const key = `posts/${slug}/${hash}.webp`;
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Body: optimized,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  // 6. URL 생성
  const url = process.env.CLOUDFRONT_DOMAIN
    ? `https://${process.env.CLOUDFRONT_DOMAIN}/${key}`
    : `https://${process.env.S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/${key}`;

  // 7. 캐시 업데이트
  cache[cacheKey] = url;
  await saveCache(cache);

  return url;
}
```

---

## ⚠️ 에러 처리

- **다운로드 실패**: 원본 노션 URL 유지 (경고 로그)
- **업로드 실패**: 재시도 3회, 실패 시 원본 URL 유지
- **용량 초과**: 이미지 크기 축소 후 재시도

---

## 🔗 관련 문서

- [노션 API 통합](./PRD-01-notion-integration.md) - 이미지 URL 추출
- [노션 데이터 → Markdown 파싱](./PRD-06-notion-parsing.md) - 이미지 블록 처리

---

**작성일**: 2025-11-16  
**버전**: 1.0




