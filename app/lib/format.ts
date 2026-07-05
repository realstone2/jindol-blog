import type { Lang } from "./types";

/** 디자인 표기: ko `2026.06.14`, en `Jun 14, 2026` */
export function formatDate(date: string, lang: Lang): string {
  const normalized = date.includes("T") ? date : `${date}T00:00:00`;
  const target = new Date(normalized);
  if (Number.isNaN(target.getTime())) return date;

  if (lang === "ko") {
    const year = target.getFullYear();
    const month = String(target.getMonth() + 1).padStart(2, "0");
    const day = String(target.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  }

  return target.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
