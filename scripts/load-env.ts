/**
 * 환경 변수 로더 (side-effect 모듈)
 *
 * 각 스크립트의 "가장 첫 번째 import"로 두면, ESM import 호이스팅 때문에
 * 다른 모듈(예: translate.ts)이 평가되기 전에 .env가 먼저 주입된다.
 *
 * .env.local 을 먼저 로드해 우선권을 준다 (dotenv는 이미 존재하는 값을 덮어쓰지 않음).
 */

import { config } from "dotenv";
import { existsSync } from "fs";
import { join } from "path";

for (const file of [".env.local", ".env"]) {
  const envPath = join(process.cwd(), file);
  if (existsSync(envPath)) {
    config({ path: envPath });
  }
}
