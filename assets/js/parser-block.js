import Node from "./node.js";

class ParserBlock {
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
        type: "BLOCKQUOTE",
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
        pattern: /^(\s*):{4}\[([^\]:]+)(:[^\]:]+)?\]\s*$/,
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

  parse(text) {
    this.references = {};
    const documentNode = this.parseBlocks(text);
    const references = this.references;
    this.references = {};
    documentNode.type = "DOCUMENT";
    documentNode.fields.references = references;
    return documentNode;
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
    const node = new Node("BLOCK");
    const reader = new LineReader(text);
    while (!reader.eof()) {
      const child = this.parseBlock(reader, 0);
      if (child) {
        node.appendChild(child);
      } else {
        reader.advance(); // skip unrecognized line
      }
    }
    return node;
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
    const node = new Node("LINK_REFERENCE_DEF");
    node.fields.id = id;
    node.fields.url = url;
    node.fields.title = title;
    return node;
  }

  parseList(reader, baseIndent) {
    const node = new Node("LIST");
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
        const child = this.parseBlock(reader, indent);
        node.appendChild(child);
        continue;
      }
      const ordered = match[3].endsWith(".");
      const new_indent = indent + match[2].length;
      const new_line = " ".repeat(new_indent) + match[4];
      reader.setCurrent(new_line); // remove list marker for nested parsing
      let child = this.parseBlock(reader, new_indent);
      if (child.type === "PARAGRAPH") {
        const inlineNode = child.firstChild;
        child.insertAfter(inlineNode);
        child.unlink();
        child = inlineNode;
      }
      const listItemNode = new Node("LIST_ITEM");
      listItemNode.appendChild(child);
      listItemNode.fields.ordered = ordered;
      node.appendChild(listItemNode);
    }
    if (node.firstChild === null) return null;
    node.fields.ordered = node.firstChild.fields.ordered;
    return node;
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
    const textNode = new Node("TEXT");
    textNode.value = lines.join("\n");
    const node = new Node("CODE_BLOCK");
    node.appendChild(textNode);
    return node;
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
    const node = this.parseBlocks(content);
    node.type = "BLOCKQUOTE";
    return node;
  }

  parseHeading(reader, baseIndent) {
    const line = reader.current();
    const match = line.match(this.BLOCK_RULES.HEADING.pattern);
    if (!match) return null;
    reader.advance();
    const textNode = new Node("TEXT");
    textNode.value = match[3];
    const node = new Node("HEADING");
    node.appendChild(textNode);
    node.fields.level = match[2].length;
    return node;
  }

  parseHorizontalRule(reader, baseIndent) {
    const line = reader.current();
    const match = line.match(this.BLOCK_RULES.HORIZONTAL_RULE.pattern);
    if (!match) return null;
    reader.advance();
    const node = new Node("HORIZONTAL_RULE");
    return node;
  }

  parseGrid(reader, baseIndent) {
    const line = reader.current();
    const match = line.match(this.BLOCK_RULES.GRID.pattern);
    if (!match) return null;
    reader.advance();
    const columns = match[2].trim();
    const gap = match[3] ? match[3].slice(1).trim() : 0;
    const node = new Node("GRID");
    while (!reader.eof()) {
      const line = reader.current();
      reader.advance();
      if (line.match(/^(\s*)([:]{4})\s*$/)) {
        break;
      }
      const inlineNode = new Node("INLINE");
      inlineNode.value = line;
      const itemNode = new Node("GRID_ITEM");
      itemNode.appendChild(inlineNode);
      node.appendChild(itemNode);
    }
    node.fields.columns = columns;
    node.fields.gap = gap;
    return node;
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
    const inlineNode = new Node("INLINE");
    inlineNode.value = lines.join("\n").trim();
    const node = new Node("PARAGRAPH");
    node.appendChild(inlineNode);
    return node;
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
    const textNode = new Node("TEXT");
    textNode.value = lines.join("\n");
    const node = new Node("HTML");
    node.appendChild(textNode);
    return node;
  }
}

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

export default ParserBlock;