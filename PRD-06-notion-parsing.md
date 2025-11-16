# PRD-06: 노션 데이터 → Markdown 파싱

## 📋 개요

노션의 다양한 블록 타입을 Markdown/MDX 형식으로 정확히 변환하는 파서 구현

---

## 🎯 배경 및 필요성

### 목적
- 노션의 다양한 블록 타입을 Markdown으로 정확히 변환
- 도전 과제: 
  - 노션의 복잡한 중첩 구조
  - 커스텀 블록 (Callout, Toggle 등)
  - Rich Text 포맷팅

---

## 📝 기능 요구사항

- **FR-6.1**: 모든 기본 블록 타입 변환 지원
- **FR-6.2**: Rich Text 포맷 (Bold, Italic, Code 등) 변환
- **FR-6.3**: 중첩 구조 (List 안의 List) 처리
- **FR-6.4**: 특수 블록은 MDX 컴포넌트로 변환

---

## 🔧 기술 요구사항

- **TR-6.1**: `notion-to-md` 패키지 사용 또는 커스텀 파서 구현
- **TR-6.2**: AST(Abstract Syntax Tree) 기반 변환
- **TR-6.3**: 단위 테스트 작성 (각 블록 타입별)

---

## 📊 블록 타입별 변환 상세

### 1. Heading

```typescript
// Notion
{ type: 'heading_1', heading_1: { rich_text: [{ plain_text: 'Title' }] } }

// Markdown
# Title
```

### 2. Paragraph with Rich Text

```typescript
// Notion
{
  type: 'paragraph',
  paragraph: {
    rich_text: [
      { text: 'This is ', annotations: {} },
      { text: 'bold', annotations: { bold: true } },
      { text: ' text', annotations: {} }
    ]
  }
}

// Markdown
This is **bold** text
```

### 3. Code Block

```typescript
// Notion
{
  type: 'code',
  code: {
    language: 'typescript',
    rich_text: [{ plain_text: 'const x = 1;' }]
  }
}

// Markdown
```typescript
const x = 1;
```
```

### 4. Callout → MDX Component

```typescript
// Notion
{
  type: 'callout',
  callout: {
    icon: { emoji: '💡' },
    rich_text: [{ plain_text: 'This is important' }]
  }
}

// MDX
<Callout emoji="💡">
This is important
</Callout>
```

### 5. Toggle → MDX Component

```typescript
// Notion
{
  type: 'toggle',
  toggle: {
    rich_text: [{ plain_text: 'Click to expand' }],
    children: [...]
  }
}

// MDX
<Details summary="Click to expand">
... children content ...
</Details>
```

---

## 🔄 변환 파이프라인

```
노션 블록 배열
    ↓
1. 각 블록의 type 확인
    ↓
2. Rich Text 파싱 (annotations → markdown)
    ↓
3. 중첩 children 재귀 처리
    ↓
4. 커스텀 블록 → MDX 컴포넌트 변환
    ↓
5. Markdown 문자열로 결합
    ↓
최종 MDX 파일
```

---

## 💻 커스텀 파서 예시

```typescript
type NotionBlock = /* ... */;
type MarkdownNode = string;

class NotionToMarkdownParser {
  parse(blocks: NotionBlock[]): string {
    return blocks.map(block => this.parseBlock(block)).join('\n\n');
  }
  
  private parseBlock(block: NotionBlock): string {
    switch (block.type) {
      case 'paragraph':
        return this.parseParagraph(block.paragraph);
      case 'heading_1':
        return `# ${this.parseRichText(block.heading_1.rich_text)}`;
      case 'heading_2':
        return `## ${this.parseRichText(block.heading_2.rich_text)}`;
      case 'code':
        return this.parseCode(block.code);
      case 'callout':
        return this.parseCallout(block.callout);
      // ... more cases
      default:
        console.warn(`Unsupported block type: ${block.type}`);
        return '';
    }
  }
  
  private parseRichText(richText: RichText[]): string {
    return richText.map(rt => {
      let text = rt.plain_text;
      
      if (rt.annotations.bold) text = `**${text}**`;
      if (rt.annotations.italic) text = `*${text}*`;
      if (rt.annotations.code) text = `\`${text}\``;
      if (rt.annotations.strikethrough) text = `~~${text}~~`;
      
      if (rt.href) text = `[${text}](${rt.href})`;
      
      return text;
    }).join('');
  }
  
  private parseCallout(callout: CalloutBlock): string {
    const icon = callout.icon?.emoji || '📝';
    const content = this.parseRichText(callout.rich_text);
    return `<Callout emoji="${icon}">\n${content}\n</Callout>`;
  }
}
```

---

## 🧪 테스트 케이스

```typescript
describe('NotionToMarkdownParser', () => {
  it('should convert heading_1 to markdown', () => {
    const block = {
      type: 'heading_1',
      heading_1: { rich_text: [{ plain_text: 'Hello' }] }
    };
    expect(parser.parseBlock(block)).toBe('# Hello');
  });
  
  it('should handle bold text', () => {
    const block = {
      type: 'paragraph',
      paragraph: {
        rich_text: [{
          plain_text: 'bold',
          annotations: { bold: true }
        }]
      }
    };
    expect(parser.parseBlock(block)).toBe('**bold**');
  });
});
```

---

## 📋 지원 블록 타입 목록

| 노션 블록 타입 | 변환 결과 | 비고 |
|----------------|-----------|------|
| paragraph | 일반 텍스트 | Rich Text 지원 |
| heading_1 | `# 제목` | |
| heading_2 | `## 제목` | |
| heading_3 | `### 제목` | |
| bulleted_list_item | `- 항목` | 중첩 지원 |
| numbered_list_item | `1. 항목` | 중첩 지원 |
| code | ` ```언어\n코드\n``` ` | |
| quote | `> 인용` | |
| image | `![alt](url)` | S3 URL로 교체 |
| toggle | `<Details>...</Details>` | MDX 컴포넌트 |
| callout | `<Callout>...</Callout>` | MDX 컴포넌트 |
| divider | `---` | |
| table | HTML 테이블 | |

---

## 🔗 관련 문서

- [노션 API 통합](./PRD-01-notion-integration.md) - 블록 데이터 가져오기
- [노션 이미지 → S3 업로드](./PRD-05-s3-images.md) - 이미지 블록 처리

---

**작성일**: 2025-11-16  
**버전**: 1.0

