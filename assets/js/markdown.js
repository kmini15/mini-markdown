class LineReader {
  constructor(markdown) {
    this.lines = markdown.replace(/\r\n?/g, "\n").split("\n");
    this.pos = 0;
  }

  eof() {
    return this.pos >= this.lines.length;
  }

  current() {
    if (this.eof()) return null;
    return this.lines[this.pos];
  }

  advance() {
    if (this.eof()) return null;
    this.pos++;
  }

  setCurrent(line) {
    if (this.eof()) return null;
    this.lines[this.pos] = line;
  }
}

class HTMLParser {
  constructor() {
    this.SELF_CLOSING_TAGS = new Set([
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

  parse(reader) {
    let stack = [];
    let lines = [];
    while (!reader.eof()) {
      const line = reader.current();
      const openTags = [...line.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)(\s[^>]*)?>/g)];
      const closeTags = [...line.matchAll(/<\/([a-zA-Z][a-zA-Z0-9-]*)>/g)];
      for (const m of openTags) {
        const tag = m[1].toLowerCase();
        if (!m[0].endsWith("/>") && !this.SELF_CLOSING_TAGS.has(tag)) {
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
    if (lines.length === 0) return null;
    return {
      type: "HTML",
      children: [{
        type: "TEXT",
        children: [],
        value: lines.join("\n")
      }],
    };
  }
}

class BlockParser {
  constructor() {
    this.references = {};
    this.BLOCK_RULES = {
      HTML: {
        type: "HTML",
        pattern: /^(\s*)<([a-zA-Z][a-zA-Z0-9\-]*)(\s[^>]*)?>/,
        indentMode: "none",
        parser: this.parseHTML.bind(this),
      },
      LINK_REFERENCE_DEF: {
        type: "LINK_REFERENCE_DEF",
        pattern: /^(\s*)\[([^\]]+)\]:\s*([\S]+)(\s*"([^"]*)")?\s*$/,
        indentMode: "none",
        parser: this.parseLinkReferenceDef.bind(this),
      },
      LIST: {
        type: "LIST",
        pattern: /^(\s*)(([*+-]|\d+\.)\s)(.*)$/,
        indentMode: "none",
        parser: this.parseList.bind(this),
      },
      CODE_BLOCK: {
        type: "CODE_BLOCK",
        pattern: /^(\s{4})(.*)$/,
        indentMode: "base",
        parser: this.parseCodeBlock.bind(this),
      },
      BLOCKQUOTE: {
        type: "BLOCK_QUOTE",
        pattern: /^(\s*)>\s?(.*)$/,
        indentMode: "none",
        parser: this.parseBlockquote.bind(this),
      },
      HEADING: {
        type: "HEADING",
        pattern: /^(\s*)(#{1,6})\s+(.*)$/,
        indentMode: "none",
        parser: this.parseHeading.bind(this),
      },
      HORIZONTAL_RULE: {
        type: "HORIZONTAL_RULE",
        pattern: /^(\s*)([\-\*\_]{3,})\s*$/,
        indentMode: "none",
        parser: this.parseHorizontalRule.bind(this),
      },
      GRID: {
        type: "GRID",
        pattern: /^(\s*):{4}\[([^:]+)(:[^:]+)?(:[^:]+)?\]\s*$/,
        indentMode: "none",
        parser: this.parseGrid.bind(this),
      },
      PARAGRAPH: {
        type: "PARAGRAPH",
        pattern: /^(\s*)(.+)$/,
        indentMode: "none",
        parser: this.parseParagraph.bind(this),
      },
    }
  }

  matchBlock(reader, baseIndent) {
    if (reader.eof()) return null;
    for (const type in this.BLOCK_RULES) {
      const rule = this.BLOCK_RULES[type];
      let line = reader.current();
      if (rule.indentMode === "base") {
        const indent = line.match(/^(\s*)/)[1].length;
        if (indent < baseIndent) continue;
        line = line.slice(baseIndent);
      }
      const match = line.match(rule.pattern);
      if (match) {
        return rule;
      }
    }
    return null;
  }

  parseBlock(reader, baseIndent) {
    const rule = this.matchBlock(reader, baseIndent);
    return rule ? rule.parser(reader, baseIndent) : null;
  }

  parseBlocks(text) {
    const reader = new LineReader(text);
    let children = [];
    while (!reader.eof()) {
      const block = this.parseBlock(reader, 0);
      if (block) {
        children.push(block);
      } else {
        reader.advance(); // skip unrecognized line
      }
    }
    return children;
  }

  parse(text) {
    this.references = {};
    const reader = new LineReader(text);
    const children = this.parseBlocks(text);
    const references = this.references;
    this.references = {};
    return {
      type: "DOCUMENT",
      children: children,
      references: references,
    };
  }

  parseHTML(reader, baseIndent) {
    const parser = new HTMLParser();
    return parser.parse(reader);
  }

  parseLinkReferenceDef(reader, baseIndent) {
    const line = reader.current();
    const match = line.match(this.BLOCK_RULES.LINK_REFERENCE_DEF.pattern);
    if (!match) return null;
    reader.advance();
    const id = match[2].toLowerCase();
    const url = match[3];
    const title = match[5] || "";
    this.references[id] = { url, title };
    return {
      type: "LINK_REFERENCE_DEF",
      children: [],
      id: id,
      url: url,
      title: title,
    };
  }

  parseList(reader, baseIndent) {
    let children = [];
    const line = reader.current();
    const match = line.match(this.BLOCK_RULES.LIST.pattern);
    if (!match) return null;
    const referenceIndent = match[1].length;
    while (!reader.eof()) {
      const line = reader.current();
      const match = line.match(this.BLOCK_RULES.LIST.pattern);
      if (!match) break;
      const indent = match[1].length;
      if (indent < referenceIndent) break;
      if (indent > referenceIndent) {
        children.push(this.parseBlock(reader, indent));
        continue;
      }
      const ordered = match[3].endsWith(".");
      const new_indent = indent + match[2].length;
      const new_line = " ".repeat(new_indent) + match[4];
      reader.setCurrent(new_line); // remove list marker for nested parsing
      let block = this.parseBlock(reader, new_indent);
      if (block.type === "PARAGRAPH") {
        block = block.children[0]; // unwrap paragraph
      }
      children.push({
        type: "LIST_ITEM",
        children: [block],
        ordered: ordered,
      });
    }
    if (children.length === 0) return null;
    return {
      type: "LIST",
      children: children,
      ordered: children.length > 0 ? children[0].ordered : false,
    };
  }

  parseCodeBlock(reader, baseIndent) {
    let lines = [];
    while (!reader.eof()) {
      const line = reader.current().slice(baseIndent);
      const match = line.match(this.BLOCK_RULES.CODE_BLOCK.pattern);
      if (!match) break;
      lines.push(match[2]);
      reader.advance();
    }
    if (lines.length === 0) return null;
    return {
      type: "CODE_BLOCK",
      children: [{
        type: "TEXT",
        children: [],
        value: lines.join("\n"),
      }],
    };
  }

  parseBlockquote(reader, baseIndent) {
    let lines = [];
    const line = reader.current();
    const match = line.match(this.BLOCK_RULES.BLOCKQUOTE.pattern);
    if (!match) return null;
    const referenceIndent = match[1].length;
    while (!reader.eof()) {
      const line = reader.current();
      const match = line.match(this.BLOCK_RULES.BLOCKQUOTE.pattern);
      if (!match) break;
      const indent = match[1].length;
      if (indent < referenceIndent) break;
      lines.push(match[2]);
      reader.advance();
    }
    if (lines.length === 0) return null;
    const content = lines.join("\n");
    const blocks = this.parseBlocks(content);
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].type === "PARAGRAPH") {
        blocks[i] = blocks[i].children[0]; // unwrap paragraph
      }
    }
    return {
      type: "BLOCKQUOTE",
      children: blocks ? blocks : [],
    };
  }

  parseHeading(reader, baseIndent) {
    const line = reader.current();
    const match = line.match(this.BLOCK_RULES.HEADING.pattern);
    if (!match) return null;
    reader.advance();
    return {
      type: "HEADING",
      children: [{
        type: "TEXT",
        children: [],
        value: match[3].trim(),
      }],
      level: match[2].length,
    };
  }

  parseHorizontalRule(reader, baseIndent) {
    const line = reader.current();
    const match = line.match(this.BLOCK_RULES.HORIZONTAL_RULE.pattern);
    if (!match) return null;
    reader.advance();
    return {
      type: "HORIZONTAL_RULE",
      children: [],
    };
  }

  parseGrid(reader, baseIndent) {
    const line = reader.current();
    const match = line.match(this.BLOCK_RULES.GRID.pattern);
    if (!match) return null;
    reader.advance();
    const columns = match[2].trim();
    const gap = match[3] ? match[3].slice(1).trim() : 0;
    const style = match[4] ? match[4].slice(1).trim() : null;
    let children = [];
    while (!reader.eof()) {
      const line = reader.current();
      reader.advance();
      if (line.match(/^(\s*)([:]{4})\s*$/)) {
        break;
      }
      children.push({
        type: "GRID_ITEM",
        children: [{
          type: "TEXT",
          children: [],
          value: line
        }],
        style: style,
      });
    }
    return {
      type: "GRID",
      children: children,
      columns: columns,
      gap: gap,
    };
  }

  parseParagraph(reader, baseIndent) {
    let lines = [];
    while (!reader.eof()) {
      const line = reader.current();
      const rule = this.matchBlock(reader, baseIndent);
      if (!rule || rule.type !== "PARAGRAPH") break;
      lines.push(line);
      reader.advance();
    }
    if (lines.length === 0) return null;
    return {
      type: "PARAGRAPH",
      children: [{
        type: "TEXT",
        children: [],
        value: lines.join("\n"),
      }],
    };
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
        children: [],
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
      case "LIST":
        if (node.ordered) {
          return `<ol>\n${result}</ol>\n`;
        } else {
          return `<ul>\n${result}</ul>\n`;
        }
      case "LIST_ITEM":
        return `<li>${result}</li>\n`;
      case "CODE_BLOCK":
        return `<pre><code>\n${result}\n</code></pre>\n`;
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
      case "BOLD":
        return `<b>${result}</b>`;
      case "ITALIC":
        return `<i>${result}</i>`;
      case "BOLD_ITALIC":
        return `<b><i>${result}</i></b>`;
      case "LINE_BREAK":
        return `<br>\n`;
      case "CODE_INLINE":
        return `<code>${node.value}</code>`;
      case "TEXT":
        return node.value;
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
    result += "  ".repeat(indent) + `[${node.type}]`;
    let parameters = [];
    for (const key in node) {
      if (key !== "type" && key !== "children") {
        parameters.push(`${key}=${node[key]}`);
      }
    }
    if (parameters.length > 0) {
      result += ` { ${parameters.join(", ")} }`;
    }
    result += "\n";
    console.log(node);
    for (const child of node.children) {
      result += this.toStringAST(child, indent + 1);
    }
    return result;
  }

  toStringRef(node) {
    if (node.type === "DOCUMENT" && node.references) {
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
