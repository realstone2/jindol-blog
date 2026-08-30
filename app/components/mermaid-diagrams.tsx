import { useEffect } from "react";

/**
 * 본문의 ```mermaid 코드블록을 다이어그램으로 렌더링
 *
 * markdown.server.ts가 만들어 둔 div.mermaid-block[data-mermaid]를 찾아
 * SVG로 채운다. mermaid는 DOM이 필요해서 서버에서 그릴 수 없으므로,
 * 다이어그램이 있는 글에서만 동적 import로 불러온다.
 */

/** 우드 팔레트(app.css)에 맞춘 다이어그램 테마 */
const THEME_VARIABLES = {
  background: "#fbf6ee",
  primaryColor: "#f3e9d8",
  primaryTextColor: "#33291e",
  primaryBorderColor: "#dccdb4",
  lineColor: "#a2917a",
  secondaryColor: "#f1e7d6",
  tertiaryColor: "#fcf9f3",
  fontFamily: '"Pretendard", ui-sans-serif, system-ui, sans-serif',
  fontSize: "15px",
};

export function MermaidDiagrams({ deps }: { deps: string }) {
  useEffect(() => {
    const blocks = Array.from(
      document.querySelectorAll<HTMLElement>(".mermaid-block[data-mermaid]"),
    ).filter((block) => block.dataset.state !== "done");

    if (blocks.length === 0) return;

    let cancelled = false;

    void (async () => {
      try {
        const { default: mermaid } = await import("mermaid");
        if (cancelled) return;

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: THEME_VARIABLES,
        });

        for (const [index, block] of blocks.entries()) {
          const source = block.dataset.mermaid;
          if (!source) continue;

          try {
            const { svg } = await mermaid.render(
              `mermaid-diagram-${index}-${Math.random().toString(36).slice(2)}`,
              source,
            );
            if (cancelled) return;
            block.innerHTML = svg;
            block.dataset.state = "done";
          } catch {
            if (cancelled) return;
            renderSource(block, source);
          }
        }
      } catch {
        if (cancelled) return;
        // mermaid 자체를 못 불러온 경우 — 원본 소스라도 보여준다
        for (const block of blocks) {
          const source = block.dataset.mermaid;
          if (source) renderSource(block, source);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [deps]);

  return null;
}

/** 렌더 실패 시 원본 소스를 코드블록으로 노출 */
function renderSource(block: HTMLElement, source: string) {
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  code.textContent = source;
  pre.appendChild(code);
  block.replaceChildren(pre);
  block.dataset.state = "error";
}
