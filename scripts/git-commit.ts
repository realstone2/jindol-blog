#!/usr/bin/env tsx

/**
 * 노션 동기화 후 변경 사항을 Git에 커밋하는 스크립트
 * 
 * 실행 방법:
 * - 로컬에서: pnpm commit-notion
 * - 워크플로우에서: 자동 실행
 */

// .env.local 파일 로드
import { config } from "dotenv";
import { existsSync } from "fs";
import { join } from "path";

const envPath = join(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  config({ path: envPath });
}

import { execSync } from "child_process";

/**
 * Git 커밋 및 푸시
 */
async function commitNotionChanges() {
  try {
    console.log("🔍 변경 사항 확인 중...\n");

    // 변경된 파일 스테이징
    const postsDir = join(process.cwd(), "app", "blog", "posts");
    const koDir = join(postsDir, "ko");
    const enDir = join(postsDir, "en");
    const cacheFile = join(process.cwd(), ".translation-cache.json");

    try {
      execSync(`git add "${koDir}" "${enDir}"`, { stdio: "inherit" });
    } catch (error) {
      console.warn("⚠️  포스트 디렉토리 스테이징 실패 (무시)");
    }

    try {
      execSync(`git add "${cacheFile}"`, { stdio: "inherit" });
    } catch (error) {
      // 캐시 파일이 없을 수 있음
    }

    // 변경 사항 확인
    let hasChanges = false;
    try {
      const diff = execSync("git diff --staged --name-only", {
        encoding: "utf-8",
      });
      hasChanges = diff.trim().length > 0;
    } catch (error) {
      // diff 명령 실패 시 변경 사항 없음으로 간주
      hasChanges = false;
    }

    if (!hasChanges) {
      console.log("ℹ️  변경 사항이 없습니다. 커밋할 내용이 없습니다.");
      return;
    }

    // 변경된 파일 목록 출력
    try {
      const changedFiles = execSync("git diff --staged --name-only", {
        encoding: "utf-8",
      });
      console.log("📝 변경된 파일:");
      console.log(changedFiles);
      console.log("");
    } catch (error) {
      // 무시
    }

    // 커밋 메시지 생성
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
    let changedCount = 0;
    try {
      const count = execSync("git diff --staged --name-only | wc -l", {
        encoding: "utf-8",
      });
      changedCount = parseInt(count.trim(), 10) || 0;
    } catch (error) {
      // 무시
    }

    const commitMessage = `chore: sync blog posts from Notion [${timestamp}]

- Changed files: ${changedCount}`;

    // 커밋
    console.log("💾 변경 사항 커밋 중...\n");
    execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });

    console.log("✅ 커밋 완료!");
    console.log(`📊 커밋 메시지: ${commitMessage}\n`);

    // 푸시 (선택적 - 환경 변수로 제어)
    if (process.env.GIT_PUSH === "true" || process.env.CI === "true") {
      console.log("🚀 원격 저장소에 푸시 중...\n");
      try {
        execSync("git push", { stdio: "inherit" });
        console.log("✅ 푸시 완료!");
      } catch (error) {
        console.error("❌ 푸시 실패:", error);
        console.log("💡 로컬에서 수동으로 푸시하세요: git push");
      }
    } else {
      console.log("ℹ️  푸시는 건너뜁니다. (GIT_PUSH=true로 설정하면 자동 푸시)");
      console.log("💡 수동 푸시: git push");
    }
  } catch (error) {
    console.error("❌ Git 커밋 중 에러 발생:", error);
    process.exit(1);
  }
}

// 스크립트 실행
commitNotionChanges();

