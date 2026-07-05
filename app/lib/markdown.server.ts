import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { toString as hastToString } from "hast-util-to-string";
import { highlight } from "sugar-high";
import type { Element, Root } from "hast";

/** pre > code 블록을 sugar-high로 하이라이팅 (CSS 변수 --sh-* 는 app.css에서 정의) */
function rehypeSugarHigh() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "pre") return;
      const code = node.children.find(
        (child): child is Element =>
          child.type === "element" && child.tagName === "code",
      );
      if (!code) return;
      code.children = [{ type: "raw", value: highlight(hastToString(code)) }];
    });
  };
}

/** 외부 링크는 새 탭으로 */
function rehypeExternalLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") return;
      const href = String(node.properties?.href ?? "");
      if (/^https?:\/\//.test(href)) {
        node.properties = {
          ...node.properties,
          target: "_blank",
          rel: "noopener noreferrer",
        };
      }
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSlug)
  .use(rehypeSugarHigh)
  .use(rehypeExternalLinks)
  .use(rehypeStringify, { allowDangerousHtml: true });

/** 콘텐츠는 빌드에 고정되므로 렌더 결과를 메모이즈 (요청마다 재파싱 방지) */
const htmlCache = new Map<string, string>();

export async function renderMarkdown(content: string): Promise<string> {
  const cached = htmlCache.get(content);
  if (cached !== undefined) return cached;

  const file = await processor.process(content);
  const html = String(file);
  htmlCache.set(content, html);
  return html;
}
