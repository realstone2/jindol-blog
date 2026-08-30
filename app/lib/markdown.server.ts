import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { SKIP, visit } from "unist-util-visit";
import { toString as hastToString } from "hast-util-to-string";
import { highlight } from "sugar-high";
import type { Element, Root } from "hast";

/** code 요소의 언어 (```mermaid → "mermaid") */
function codeLanguage(code: Element): string {
  const className = code.properties?.className;
  const list = Array.isArray(className) ? className : [];
  for (const name of list) {
    const match = /^language-(.+)$/.exec(String(name));
    if (match) return match[1];
  }
  return "";
}

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
      // mermaid는 클라이언트에서 다이어그램으로 그리므로 하이라이팅 대상이 아니다
      if (codeLanguage(code) === "mermaid") return;
      code.children = [{ type: "raw", value: highlight(hastToString(code)) }];
    });
  };
}

/**
 * ```mermaid 코드블록을 다이어그램 컨테이너로 변환
 *
 * 원본 소스를 그대로 남겨두고 클라이언트(MermaidDiagrams)가 SVG로 교체한다.
 * 스크립트가 로드되지 않으면 코드블록 그대로 보이는 게 폴백이다.
 */
function rehypeMermaid() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "pre") return;
      const code = node.children.find(
        (child): child is Element =>
          child.type === "element" && child.tagName === "code",
      );
      if (!code || codeLanguage(code) !== "mermaid") return;

      const fallback: Element = {
        type: "element",
        tagName: "pre",
        properties: {},
        children: node.children,
      };

      node.tagName = "div";
      node.properties = {
        className: ["mermaid-block"],
        "data-mermaid": hastToString(code),
      };
      // JS가 없는 환경에서는 원본 소스라도 보이게
      node.children = [
        {
          type: "element",
          tagName: "noscript",
          properties: {},
          children: [fallback],
        },
      ];

      // 새로 만든 자식(pre > code.language-mermaid)을 다시 방문하면 무한 재귀가 된다
      return SKIP;
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
  .use(rehypeMermaid)
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
