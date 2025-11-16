# S3 이미지 업로드 설정 가이드

## 개요

이 프로젝트는 노션 블로그 이미지를 자동으로 S3에 업로드하고 최적화하는 기능을 제공합니다. 노션 이미지 URL은 1시간 후 만료되는 문제를 해결하기 위해 빌드 시 자동으로 S3에 업로드됩니다.

## 주요 기능

- ✅ 노션 이미지 자동 다운로드
- ✅ WebP 포맷으로 자동 변환 및 최적화
- ✅ S3 버킷에 업로드
- ✅ 해시 기반 캐싱으로 중복 업로드 방지
- ✅ CloudFront CDN 지원 (선택사항)
- ✅ 자동 재시도 로직 (최대 3회)

## AWS S3 설정 방법

### 1. S3 버킷 생성

1. AWS Console → S3로 이동
2. "버킷 만들기" 클릭
3. 버킷 이름 입력 (예: `my-blog-images`)
4. 리전 선택 (예: `ap-northeast-2` - 서울)
5. "퍼블릭 액세스 차단" 설정:
   - "모든 퍼블릭 액세스 차단" 해제 (이미지를 공개적으로 제공하기 위함)
   - 또는 버킷 정책을 통해 특정 객체만 공개 설정
6. 버킷 생성 완료

### 2. 버킷 정책 설정 (퍼블릭 읽기 허용)

S3 버킷 → 권한 → 버킷 정책에 다음 추가:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-blog-images/*"
    }
  ]
}
```

### 3. IAM 사용자 생성 및 권한 부여

1. AWS Console → IAM → 사용자 → "사용자 추가"
2. 사용자 이름 입력 (예: `blog-uploader`)
3. "액세스 키 - 프로그래매틱 액세스" 선택
4. 권한 설정 → "기존 정책 직접 연결"
5. 다음 정책 연결:
   - `AmazonS3FullAccess` (또는 아래 커스텀 정책 사용)

**커스텀 정책 (권장):**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:PutObjectAcl", "s3:GetObject"],
      "Resource": "arn:aws:s3:::my-blog-images/*"
    }
  ]
}
```

6. 사용자 생성 완료 후 **액세스 키 ID**와 **비밀 액세스 키** 저장

### 4. 환경 변수 설정

`.env.local` 파일에 다음 추가:

```env
# AWS S3 설정
S3_BUCKET_NAME=my-blog-images
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
```

## CloudFront CDN 설정 (선택사항)

CloudFront를 사용하면 전 세계에서 더 빠르게 이미지를 제공할 수 있습니다.

### 1. CloudFront 배포 생성

1. AWS Console → CloudFront → "배포 생성"
2. 원본 도메인: S3 버킷 선택
3. 원본 액세스: "공개" (또는 OAI 사용)
4. 캐시 정책: "CachingOptimized"
5. 배포 생성 완료 후 **배포 도메인 이름** 복사 (예: `d123456abcdef.cloudfront.net`)

### 2. 환경 변수 추가

`.env.local`에 CloudFront 도메인 추가:

```env
CLOUDFRONT_DOMAIN=d123456abcdef.cloudfront.net
```

이제 이미지 URL이 CloudFront URL로 생성됩니다.

## 사용 방법

### 자동 실행 (빌드 시)

```bash
pnpm build
```

빌드 시 자동으로 노션 동기화 및 이미지 업로드가 실행됩니다.

### 수동 실행

```bash
pnpm sync-notion
```

## 캐시 관리

이미지 업로드 정보는 `.upload-cache.json` 파일에 캐시됩니다.

- **캐시 위치**: 프로젝트 루트 디렉토리
- **캐시 키**: `{slug}:{image_hash}`
- **캐시 값**: S3 URL

### 캐시 초기화

모든 이미지를 다시 업로드하려면 캐시 파일을 삭제하세요:

```bash
rm .upload-cache.json
```

## 이미지 최적화

업로드되는 이미지는 자동으로 최적화됩니다:

- **포맷**: WebP
- **최대 너비**: 1920px
- **품질**: 85
- **원본 비율 유지**: 예

## 파일 구조

```
.upload-cache.json              # 업로드 캐시
scripts/
  upload-images.ts              # S3 업로드 유틸리티
  notion-to-markdown.ts         # 이미지 URL 교체 로직
  sync-notion.ts                # 노션 동기화 메인 스크립트
```

## S3 버킷 구조

```
my-blog-images/
├── posts/
│   ├── {slug1}/
│   │   ├── abc12345.webp
│   │   └── def67890.webp
│   └── {slug2}/
│       └── ghi11121.webp
```

## 문제 해결

### 이미지 업로드 실패

1. AWS 자격 증명 확인
2. S3 버킷 권한 확인
3. IAM 사용자 권한 확인
4. 네트워크 연결 확인

### CloudFront 이미지가 표시되지 않음

1. CloudFront 배포 상태가 "Deployed"인지 확인
2. 캐시 무효화(Invalidation) 생성: `/*`
3. 원본 액세스 권한 확인

## 비용 고려사항

- **S3 스토리지**: 최초 50GB까지 $0.025/GB (서울 리전)
- **S3 PUT 요청**: 1,000건당 $0.005
- **CloudFront 데이터 전송**: 최초 10TB까지 $0.085/GB
- **CloudFront 요청**: 10,000건당 $0.0075

대부분의 블로그는 AWS 프리 티어 범위 내에서 운영 가능합니다.

## 참고 문서

- [AWS S3 문서](https://docs.aws.amazon.com/s3/)
- [AWS CloudFront 문서](https://docs.aws.amazon.com/cloudfront/)
- [Sharp 이미지 처리 라이브러리](https://sharp.pixelplumbing.com/)
