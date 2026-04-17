class LineReader {
  constructor(markdown) {
    this.lines = markdown.replace(/\r\n?/g, "\n").split("\n");
    this.pos = 0;
    this.head = 0;
  }

  eof() {
    return this.pos >= this.lines.length;
  }

  current(offset = 0) {
    return this.lines[this.pos + offset]?.slice(this.head) ?? null;
  }

  advance() {
    if (this.eof()) return null;
    this.head = 0;
    this.pos++;
  }

  consume(num) {
    this.head += num;
  }
}

class BlockParser {
  constructor() {
    this.patterns = [
      { type: "LINK_REFERENCE", regex: /^\s*\[([^\n\]]+)\]:\s+([^\n\s]+)(\s+"([^"\n]*)")?\s*$/ },
      { type: "HTML", regex: /^\s*<([A-Za-z][A-Za-z0-9-]*)(\s[^>]*)?>\s*$/g },
      { type: "CODE_BLOCK", regex: /^(\s{4})([^\n]+)$/ },
      { type: "BLOCKQUOTE", regex: /^(\s*)(>+)\s+([^\n]*)$/ },
      { type: "O_LIST", regex: /^(\s*)(\d+\.)\s+([^\n]*)$/ },
      { type: "U_LIST", regex: /^(\s*)([-*+])\s+([^\n]*)$/ },
      { type: "HEADING", regex: /^(\s*)(#{1,6})\s+([^\n]*)$/ },
      { type: "HORIZONTAL_RULE", regex: /^(\s*)([-*_]{3,})\s*$/ },
      { type: "GRID", regex: /^(\s*)[:]{4}\[([^\n:]+)(:[^\n:]+)?(:[^\n:]+)?\]\s*$/ },
      { type: "PARAGRAPH", regex: /^(\s*)([^\n]+)$/ },
    ]
    this.references = {}; // reference definitions collected during parsing
    this.SELF_CLOSING = new Set([
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
    ]);
  }

  matchPattern(reader) {
    const line = reader.current();
    for (const pattern of this.patterns) {
      const match = line?.match(pattern.regex);
      if (!match) continue;
      return { type: pattern.type, match };
    }
    return null;
  }

  parseHeading(reader) {
    const pattern = this.matchPattern(reader);
    reader.advance();
    return {
      type: "HEADING",
      children: [{
        type: "TEXT",
        value: pattern.match[3],
      }],
      level: pattern.match[2].length
    }
  }

  parseParagraph(reader) {
    // Parse setext-style headings first
    const line1 = reader.current(0);
    const line2 = reader.current(1);
    if (line1 && line2) {
      const pattern1 = line1.match(/^\s*([^\n]+)\s*$/);
      const pattern2 = line2.match(/^\s*(=+|-+)\s*$/);
      if (pattern1 && pattern2) {
        reader.advance(); // consume heading text
        reader.advance(); // consume underline
        return {
          type: "HEADING",
          children: [{
            type: "TEXT",
            value: pattern1[1],
          }],
          level: pattern2[1].startsWith("=") ? 1 : 2,
        }
      }
    }
    // Otherwise, parse as normal paragraph
    let lines = [];
    while (!reader.eof()) {
      const line2 = reader.current(1);
      const pattern2 = line2?.match(/^\s*(=+|-+)\s*$/);
      if (pattern2) { // if next line is setext underline, stop parsing paragraph
        break;
      }
      const nextPattern = this.matchPattern(reader);
      if (!nextPattern || nextPattern.type !== "PARAGRAPH") break;
      lines.push(nextPattern.match[2]);
      reader.advance();
    }
    return {
      type: "PARAGRAPH",
      children: [{
        type: "TEXT",
        value: lines.join("\n"),
      }],
    }
  }

  parseBlockquote(reader) {
    let lines = [];
    while (!reader.eof()) {
      const nextPattern = this.matchPattern(reader);
      if (!nextPattern || nextPattern.type !== "BLOCKQUOTE") break;
      const num_prefix = reader.current().match(/^(\s*>{1})/)[1].length;
      lines.push(reader.current().slice(num_prefix));
      reader.advance();
    }
    const children = this.parseBlocks(lines.join("\n"));
    for (let i = 0; i < children.length; i++) {
      if (children[i].type === "PARAGRAPH") {
        children[i] = children[i].children[0]; // unwrap paragraph
      }
    }
    return {
      type: "BLOCKQUOTE",
      children: children,
    }
  }

  parseOlist(reader, depth = 0) {
    let children = [];
    while (!reader.eof()) {
      const nextPattern = this.matchPattern(reader);
      if (!nextPattern || (nextPattern.type !== "O_LIST" && nextPattern.type !== "U_LIST")) break;
      let next_depth = nextPattern.match[1].length;
      if (next_depth === depth) {
        const num_prefix = nextPattern.match[1].length + nextPattern.match[2].length;
        reader.consume(num_prefix); // consume list marker
        let child = this.parseBlock(reader, depth);
        if (child.type === "PARAGRAPH") child = child.children[0]; // unwrap paragraph
        children.push({ type: "LIST_ITEM", children: [child] });
        continue;
      }
      if (next_depth > depth) {
        const olist = this.parseBlock(reader, next_depth);
        children.push(olist);
        continue;
      }
      break;
    }
    return {
      type: "O_LIST",
      children: children,
    }
  }

  parseUlist(reader, depth = 0) {
    let children = [];
    while (!reader.eof()) {
      const nextPattern = this.matchPattern(reader);
      if (!nextPattern || (nextPattern.type !== "O_LIST" && nextPattern.type !== "U_LIST")) break;
      let next_depth = nextPattern.match[1].length;
      if (next_depth === depth) {
        const num_prefix = nextPattern.match[1].length + nextPattern.match[2].length;
        reader.consume(num_prefix); // consume list marker
        let child = this.parseBlock(reader, depth);
        if (child.type === "PARAGRAPH") child = child.children[0]; // unwrap paragraph
        children.push({ type: "LIST_ITEM", children: [child] });
        continue;
      }
      if (next_depth > depth) {
        const ulist = this.parseBlock(reader, next_depth);
        children.push(ulist);
        continue;
      }
      break;
    }
    return {
      type: "U_LIST",
      children: children,
    }
  }

  parseCodeBlock(reader) {
    let lines = [];
    while (!reader.eof()) {
      const nextPattern = this.matchPattern(reader);
      if (!nextPattern || nextPattern.type !== "CODE_BLOCK") break;
      lines.push(nextPattern.match[2]);
      reader.advance();
    }
    return {
      type: "CODE_BLOCK",
      children: [{ type: "TEXT", value: lines.join("\n") }],
    }
  }

  parseHorizontalRule(reader) {
    const pattern = this.matchPattern(reader);
    reader.advance();
    return {
      type: "HORIZONTAL_RULE",
      children: [{ type: "TEXT", value: "<hr>" }],
    }
  }

  parseLinkReference(reader) {
    const pattern = this.matchPattern(reader);
    reader.advance();
    this.references[pattern.match[1].toLowerCase()] = {
      url: pattern.match[2],
      title: pattern.match[4] || "",
    };
    return {
      type: "LINK_REFERENCE",
      children: [{ type: "TEXT", value: "" }],
    };
  }

  parseHTML(reader) {
    const first = reader.current();
    const open = first?.match(/^\s*<([A-Za-z][A-Za-z0-9-]*)\b[^>]*>/);
    if (!open) return null;
    const stack = [];
    const lines = [];
    while (!reader.eof()) {
      const line = reader.current();
      const openTags = [...line.matchAll(/<([A-Za-z][A-Za-z0-9-]*)\b[^>]*?>/g)];
      const closeTags = [...line.matchAll(/<\/([A-Za-z][A-Za-z0-9-]*)>/g)];
      const selfClosing = [...line.matchAll(/<([A-Za-z][A-Za-z0-9-]*)\b[^>]*?\/>/g)];
      // self closing 제거
      for (const m of selfClosing) {
        // stack 영향 없음
      }
      for (const m of openTags) {
        const tag = m[1].toLowerCase();
        if (!this.SELF_CLOSING.has(tag) && !m[0].endsWith("/>")) {
          stack.push(tag);
        }
      }
      for (const m of closeTags) {
        const tag = m[1].toLowerCase();
        if (stack.length && stack[stack.length - 1] === tag) {
          stack.pop();
        }
      }
      lines.push(line);
      reader.advance();
      if (stack.length === 0) break;
    }
    return {
      type: "HTML_BLOCK",
      children: [{ type: "TEXT", value: lines.join("\n") }] ,
    };
  }

  parseGrid(reader) {
    const pattern = this.matchPattern(reader);
    reader.advance();
    const columns = pattern.match[2];
    const gap = pattern.match[3] ? pattern.match[3].slice(1) : 0;
    const item_style = pattern.match[4] ? pattern.match[4].slice(1) : "";
    let children = [];
    while (!reader.eof()) {
      const line = reader.current();
      reader.advance();
      if (line.match(/^(\s*)([:]{4})\s*$/)) {
        break;
      }
      children.push({
        type: "GRID_ITEM",
        children: [{ type: "TEXT", value: line }],
        style: item_style,
      });
    }
    return {
      type: "GRID",
      children: children,
      columns: columns,
      gap: gap,
    }
  }

  parseBlock(reader, depth = 0) {
    const pattern = this.matchPattern(reader);
    if (!pattern) return null;
    switch (pattern.type) {
      case "HEADING":
        return this.parseHeading(reader);
      case "HEADING_SETEXT":
        return this.parseHeadingSetext(reader);
      case "PARAGRAPH":
        return this.parseParagraph(reader);
      case "BLOCKQUOTE":
        return this.parseBlockquote(reader);
      case "O_LIST":
        return this.parseOlist(reader, pattern.match[1].length);
      case "U_LIST":
        return this.parseUlist(reader, pattern.match[1].length);
      case "CODE_BLOCK":
        return this.parseCodeBlock(reader);
      case "HORIZONTAL_RULE":
        return this.parseHorizontalRule(reader);
      case "LINK_REFERENCE":
        return this.parseLinkReference(reader);
      case "HTML":
        return this.parseHTML(reader);
      case "GRID":
        return this.parseGrid(reader);
      default:
        return null;
    }
  }

  parseBlocks(text) {
    let children = [];
    const reader = new LineReader(text);
    while (!reader.eof()) {
      const block = this.parseBlock(reader);
      if (block) {
        children.push(block);
      } else {
        reader.advance(); // skip unrecognized token
      }
    }
    return children;
  }

  parse(text) {
    this.references = {};
    const children = this.parseBlocks(text);
    const references = this.references; // collect references during block parsing
    this.references = {};
    return {
      type: "ROOT",
      children: children,
      references: references,
    }
  }
}


class InlineParser {
  constructor() {
    this.patterns = [
      {
        type: "ESCAPE_PROTECT",
        regex: /\\([^\n])/g,
        render: (char) => `\uE000${char}\uE000`
      },
      {
        type: "VIDEO",
        regex: /#\[([^\n]*)\]\(([^\n]+)\)/g,
        render: (alt, src) => `<video controls preload="none" poster="${alt}"><source src="${src}" type="video/mp4"></video>`
      },
      {
        type: "IMAGE",
        regex: /!\[([^\n]*)\]\(([^\n]+)\)/g,
        render: (alt, src) => `<img src="${src}" alt="${alt}" />`
      },
      {
        type: "LINK",
        regex: /\[([^\n\]]+)\]\(([^)\s]+)(\s+"([^"\n]*)")?\)/g,
        render: (text, href, _, title) => {
          if (title) {
            return `<a href="${href}" title="${title}">${text}</a>`;
          } else {
            return `<a href="${href}">${text}</a>`;
          }
        }
      },
      {
        type: "LINK_URL",
        regex: /<([^>\s]{2,}:[^>\s]+)>/g,
        render: (href) => `<a href="${href}">${href}</a>`
      },
      {
        type: "LINK_EMAIL",
        regex: /<([^>\s]{2,}@[^>\s]+)>/g,
        render: (href) => `<a href="mailto:${href}">${href}</a>`
      },
      {
        type: "LINK_REFERENCE",
        regex: /\[([^\n\]]+)\]\[([^\n\]]*)\]/g,
        render: (text, id, _, refs) => {
          const ref = this.references[id.toLowerCase()] || this.references[text.toLowerCase()];
          if (ref) {
            const title_attr = ref.title ? ` title="${ref.title}"` : "";
            return `<a href="${ref.url}"${title_attr}>${text}</a>`;
          } else {
            return text;
          }
        }
      },
      {
        type: "LINE_BREAK",
        regex: /\s{2,}\n/g,
        render: () => `<br>`
      },
      {
        type: "BOLD",
        regex: /\*\*([^\n*\uE000]+)\*\*/g,
        render: (text) => `<b>${text}</b>`
      },
      {
        type: "BOLD_ALT",
        regex: /(\b)__([^\n_\uE000]+)__(\b)/g,
        render: (pre, text, post) => `${pre}<b>${text}</b>${post}`
      },
      {
        type: "ITALIC",
        regex: /\*([^\n*\uE000]+)\*/g,
        render: (text) => `<i>${text}</i>`
      },
      {
        type: "ITALIC_ALT",
        regex: /(\b)_([^\n_\uE000]+)_(\b)/g,
        render: (pre, text, post) => `${pre}<i>${text}</i>${post}`
      },
      {
        type: "CODE_INLINE",
        regex: /(`+)([\s\S]*?)\1/g,
        render: (pre, text) => `<code>${text}</code>`
      },
      {
        type: "ESCAPE_RESTORE",
        regex: /\uE000([^\n])\uE000/g,
        render: (char) => char
      },
    ];
    this.references = {};
  }

  parseInline(text) {
    let result = text;
    for (const pattern of this.patterns) {
      result = result.replace(pattern.regex, (...args) => {
        const groups = args.slice(1, -2);
        return pattern.render(...groups);
      });
    }
    return result;
  }

  parseInlines(node) {
    if (node.type === "HTML") return node; // don't parse inline elements in HTML blocks
    if (node.type === "CODE_BLOCK") return node; // don't parse inline elements in code blocks
    if (node.type === "TEXT") {
      return {
        type: "TEXT",
        value: this.parseInline(node.value),
      }
    }
    let children = [];
    for (const child of node.children) {
      children.push(this.parseInlines(child));
    }
    return {
      ...node,
      children: children,
    }
  }

  parse(node) {
    this.references = node.references || {};
    node = this.parseInlines(node);
    this.references = {};
    return node;
  }
}

class Renderer {
  render(node) {
    if (node.type === "TEXT") {
      return node.value;
    }
    let result = "";
    for (const child of node.children) {
      result += this.render(child);
    }
    switch (node.type) {
      case "HEADING":
        return `<h${node.level}>${result}</h${node.level}>\n`;
      case "PARAGRAPH":
        return `<p>${result}</p>\n`;
      case "BLOCKQUOTE":
        return `<blockquote>${result}</blockquote>\n`;
      case "O_LIST":
        return `<ol>\n${result}</ol>\n`;
      case "U_LIST":
        return `<ul>\n${result}</ul>\n`;
      case "LIST_ITEM":
        return `<li>${result}</li>\n`;
      case "CODE_BLOCK":
        return `<pre><code>${result}</code></pre>\n`;
      case "HORIZONTAL_RULE":
        return `<hr>\n`;
      case "HTML":
        return result.trim();
      case "GRID":
        let gridStyle = "";
        if (node.columns) {
          gridStyle += `--columns: ${node.columns};`;
        }
        if (node.gap) {
          gridStyle += `--gap: ${node.gap};`;
        }
        return `<div class="grid" style="${gridStyle}">${result.trim()}</div>\n`;
      case "GRID_ITEM":
        return `<div class="grid-item">${result}</div>\n`;
      default:
        return result;
    }
  }
}

class Markdown {
  constructor() {
    this.blockParser = new BlockParser();
    this.inlineParser = new InlineParser();
  }

  toStringAST(node, indent = 0) {
    let result = "";
    if (node.type === "TEXT") {
      result += "    ".repeat(indent) + `[${node.type}] ${node.value}\n`;
      return result;
    }
    result += "    ".repeat(indent) + `[${node.type}]` + "\n";
    for (const child of node.children) {
      result += this.toStringAST(child, indent + 1);
    }
    return result;
  }

  toStringRef(node) {
    if (node.type === "ROOT") {
      let result = "[REFERENCES]:\n";
      for (const id in node.references) {
        const ref = node.references[id];
        const title = ref.title ? `"${ref.title}"` : "";
        result += `  [${id}]: ${ref.url} ${title}\n`;
      }
      return result;
    }
    return "";
  }

  parse(text) {
    const block_node = this.blockParser.parse(text);
    const output_ref = this.toStringRef(block_node);
    const inline_node = this.inlineParser.parse(block_node);
    const output_ast = this.toStringAST(inline_node);
    const output = output_ref + output_ast;
    return output;
  }

  render(text) {
    const block_node = this.blockParser.parse(text);
    const inline_node = this.inlineParser.parse(block_node);
    const renderer = new Renderer();
    return renderer.render(inline_node);
  }
}
