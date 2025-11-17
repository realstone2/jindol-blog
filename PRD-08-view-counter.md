# PRD-08: 조회수 기록 시스템

## 📋 개요

Upstash Redis를 사용하여 블로그 포스트의 조회수를 실시간으로 집계하고, 인기 포스트를 추적하는 기능

---

## 🎯 배경 및 필요성

### 목적
- 인기 포스트 파악
- 콘텐츠 전략 수립

### 요구사항
- 실시간 조회수 집계
- 중복 조회 방지 (동일 사용자)
- 서버리스 아키텍처 (비용 효율성)

---

## 📝 기능 요구사항

- **FR-8.1**: 페이지 방문 시 조회수 자동 증가
- **FR-8.2**: 동일 사용자의 중복 조회 방지 (24시간 쿠키)
- **FR-8.3**: 블로그 포스트 상단에 조회수 표시
- **FR-8.4**: 인기 포스트 목록 (조회수 기준 Top 10)
- **FR-8.5**: 관리자 대시보드에서 통계 확인

---

## 🔧 기술 요구사항

- **TR-8.1**: Vercel KV (Redis) 또는 Upstash Redis 사용
- **TR-8.2**: Edge Function으로 조회수 증가 API 구현
- **TR-8.3**: 클라이언트 컴포넌트로 조회수 표시
- **TR-8.4**: 서버 컴포넌트로 초기 조회수 가져오기

---

## 📊 선택지 비교

| 방식 | 장점 | 단점 | 비용 |
|------|------|------|------|
| **Vercel KV** | Vercel 통합, 간편함 | Vercel 종속성 | 무료: 30K requests/day |
| **Upstash Redis** | 독립적, 관대한 무료 플랜 | 별도 설정 | 무료: 10K commands/day |
| **Supabase** | PostgreSQL, 추가 기능 많음 | 오버킬 | 무료: 500MB |
| **Firebase** | 실시간 업데이트 | 복잡한 설정 | 무료: 50K reads/day |

**선택**: **Upstash Redis** (비용 효율성 + 독립성)

---

## 💾 데이터 구조 (Redis)

```
# 조회수 저장
views:{slug} → 1234

# 중복 방지 (24시간 TTL)
viewed:{slug}:{ip_hash} → "1" (expires in 86400s)

# 전체 조회수 통계
views:total → 10000

# 인기 포스트 (Sorted Set)
views:popular → {slug: score}
```

---

## 💻 API Route 구현

```typescript
// app/api/views/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = await params;
  
  const views = await redis.get<number>(`views:${slug}`) || 0;
  
  return NextResponse.json({ views });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = await params;
  
  // IP 해시로 중복 체크
  const ip = request.ip || 'unknown';
  const ipHash = await hashIP(ip);
  const viewedKey = `viewed:${slug}:${ipHash}`;
  
  // 24시간 내 이미 조회했는지 확인
  const alreadyViewed = await redis.get(viewedKey);
  
  if (alreadyViewed) {
    const views = await redis.get<number>(`views:${slug}`) || 0;
    return NextResponse.json({ views, incremented: false });
  }
  
  // 조회수 증가
  const views = await redis.incr(`views:${slug}`);
  
  // 중복 방지 키 설정 (24시간)
  await redis.setex(viewedKey, 86400, '1');
  
  // 인기 포스트 Sorted Set 업데이트
  await redis.zincrby('views:popular', 1, slug);
  
  return NextResponse.json({ views, incremented: true });
}

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
```

---

## 💻 클라이언트 컴포넌트

```tsx
// app/components/ViewCounter.tsx
'use client';

import { useEffect, useState } from 'react';

export function ViewCounter({ slug, initialViews }: {
  slug: string;
  initialViews: number;
}) {
  const [views, setViews] = useState(initialViews);
  
  useEffect(() => {
    // 조회수 증가 요청
    fetch(`/api/views/${slug}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => setViews(data.views));
  }, [slug]);
  
  return (
    <span className="text-neutral-500">
      {views.toLocaleString()} views
    </span>
  );
}
```

---

## 🔗 서버 컴포넌트 통합

```tsx
// app/[lang]/blog/[slug]/page.tsx
import { Redis } from '@upstash/redis';
import { ViewCounter } from '@/app/components/ViewCounter';

const redis = Redis.fromEnv();

export default async function BlogPost({ params }) {
  const { slug } = await params;
  
  // 초기 조회수 가져오기 (SSR)
  const views = await redis.get<number>(`views:${slug}`) || 0;
  
  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        <div className="flex items-center gap-4">
          <time>{post.publishedAt}</time>
          <ViewCounter slug={slug} initialViews={views} />
        </div>
      </header>
      {/* ... */}
    </article>
  );
}
```

---

## 📊 인기 포스트 목록

```tsx
// app/components/PopularPosts.tsx
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function PopularPosts() {
  // Sorted Set에서 Top 10 가져오기
  const popular = await redis.zrange('views:popular', 0, 9, {
    rev: true,
    withScores: true,
  });
  
  // popular = [['slug1', 1234], ['slug2', 567], ...]
  
  return (
    <section>
      <h2>인기 포스트</h2>
      <ul>
        {popular.map(([slug, views]) => (
          <li key={slug}>
            <Link href={`/blog/${slug}`}>
              {slug} ({views} views)
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

---

## 🔐 환경 변수

```env
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

---

## 🔒 보안 고려사항

- **IP 해싱**: 개인정보 보호 (원본 IP 저장하지 않음)
- **Rate Limiting**: 봇 공격 방지
- **Vercel Edge**: 빠른 응답 속도

---

## 🔗 관련 문서

- [GitHub 댓글 기능](./PRD-07-comments.md) - 사용자 인터랙션
- [다국어 지원](./PRD-04-i18n.md) - 다국어 조회수 표시

---

**작성일**: 2025-11-16  
**버전**: 1.0


