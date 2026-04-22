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
    this.references = {};
    this.CHAR_TYPES = {
      DELIMITER: new Set([
        "\\", "`", "*", "_",
        "{", "}", "[", "]",
        "<", ">", "(", ")",
        "!", "\"",
      ]),
      WHITESPACE: new Set([" ", "\t", "\n"]),
    };
  }

  tokenizeInline(text) {
    const tokens = [];
    let pos = 0;
    let buffer = "";

    const clearBuffer = () => {
      if (buffer.length > 0) {
        tokens.push({
          type: "CHUNK",
          value: buffer,
          lspace: true,
          rspace: true,
          lchunk: "",
          rchunk: "",
        });
        buffer = "";
      }
    }

    while (pos < text.length) {
      // ESCAPE
      const curr = text[pos];
      const next = text[pos + 1];
      if (curr === "\\" && next && this.CHAR_TYPES.DELIMITER.has(next)) {
        clearBuffer();
        tokens.push({
          type: "CHUNK",
          value: next,
          lspace: true,
          rspace: true,
          lchunk: "",
          rchunk: "",
        });
        pos += 2;
        continue;
      }
      // DELIMITER
      if (this.CHAR_TYPES.DELIMITER.has(curr)) {
        clearBuffer();
        let end = pos;
        while (end < text.length && text[end] === curr) {
          end++;
        }
        tokens.push({
          type: "DELIM",
          value: text.slice(pos, end),
          lspace: true,
          rspace: true,
          lchunk: "",
          rchunk: "",
        });
        pos = end;
        continue;
      }
      // WHITESPACE
      if (this.CHAR_TYPES.WHITESPACE.has(curr)) {
        clearBuffer();
        let end = pos;
        while (end < text.length && this.CHAR_TYPES.WHITESPACE.has(text[end])) {
          end++;
        }
        tokens.push({
          type: "SPACE",
          value: text.slice(pos, end),
          lspace: true,
          rspace: true,
          lchunk: "",
          rchunk: "",
        });
        pos = end;
        continue;
      }
      buffer += curr;
      pos++;
    }
    clearBuffer();
    // Set lspace and rspace for each token
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (i > 0) {
        token.lspace = tokens[i - 1].type === "SPACE";
        token.lchunk = tokens[i - 1].value.slice(-1);
      }
      if (i < tokens.length - 1) {
        token.rspace = tokens[i + 1].type === "SPACE";
        token.rchunk = tokens[i + 1].value.slice(0, 1);
      }
    }
    return tokens;
  }

  parse(node) {
    node = this.parseInline(node);
    return node;
  }

  parseInline(node) {
    if (node.type === "HTML") {
      return node;
    }
    if (node.type === "CODE_BLOCK") {
      return node;
    }
    if (node.type === "BLOCKQUOTE") {
      return node;
    }
    if (node.type === "TEXT") {
      node = this.parseText(node);
    } else {
      node.children = node.children.map(child => this.parseInline(child));
    }
    return node;
  }

  parseText(node) {
    let context = {
      input: this.tokenizeInline(node.value),
      stack: [],
      state: "REDUCE",
    };
    while (context.input.length > 0) {
      context.stack.push(context.input.shift());
      while (context.stack.length > 0) {
        console.log("STACK:");
        for (const elem of context.stack) {
          console.log(elem);
        }
        if (this.tryReduceCode(context)) continue;
        if (this.tryReduceImage(context)) continue;
        if (this.tryReduceLink(context)) continue;
        if (this.tryReduceLinkURL(context)) continue;
        if (this.tryReduceLinkWithTitle(context)) continue;
        if (this.tryReduceLineBreak(context)) continue;
        if (this.tryReduceEmphasis(context)) continue;
        if (this.tryReduceItem(context)) continue;
        if (this.tryReduceNode(context)) continue;
        break;
      }
    }
    let children = [];
    for (const elem of context.stack) {
      children.push(elem);
    }
    return {
      type: "INLINE",
      children: children,
    }
  }

  tryReduceCode(context) {
    const N = context.stack.length;
    const M = context.input.length;
    if (N < 1) return false;
    const e0 = context.stack[N - 1];
    if (e0.type !== "DELIM") return false;
    if (e0.value !== "`") return false;
    let matchIndex = -1;
    for (let i = 0; i < M; i++) {
      const x = context.input[i];
      if (x.type !== "DELIM") continue;
      if (x.value !== "`") continue;
      if (x.count !== e0.count) continue;
      matchIndex = i;
      break;
    }
    if (matchIndex < 0) return false;
    const contents = context.input.slice(0, matchIndex);
    const e1 = context.input[matchIndex];
    context.input = context.input.slice(matchIndex + 1);
    const item = {
      type: "CODE_INLINE",
      children: contents,
      lspace: false,
      rspace: false,
    }
    context.stack.pop();
    context.stack.push({
      type: "NODE",
      children: [item],
      lspace: e0.lspace,
      rspace: e1.rspace,
    });
    return true;
  }

  tryReduceLineBreak(context) {
    const N = context.stack.length;
    if (N < 1) return false;
    const e0 = context.stack[N - 1];
    if (e0.type !== "SPACE") return false;
    if (!e0.value.includes("  \n")) return false;
    const item = {
      type: "LINE_BREAK",
      children: [],
      lspace: false,
      rspace: false,
    }
    context.stack.pop();
    context.stack.push(item);
    return true;
  }

  tryReduceEmphasis(context) {
    const N = context.stack.length;
    if (N < 3) return false;
    const e0 = context.stack[N - 1];
    const e1 = context.stack[N - 2];
    const e2 = context.stack[N - 3];
    if (e1.type !== "NODE") return false;
    if (e0.type !== "DELIM") return false;
    if (e2.type !== "DELIM") return false;
    if (e0.value[0] !== e2.value[0]) return false;
    if (e0.value[0] !== "*" && e0.value[0] !== "_") return false;
    if (e2.value[0] !== "*" && e2.value[0] !== "_") return false;
    if (e0.lspace) return false;
    if (e2.rspace) return false;
    if (e0.value[0] === "_" && !(e0.rspace || e0.rchunk === "*")) return false;
    if (e2.value[0] === "_" && !(e2.lspace || e2.lchunk === "*")) return false;
    if (e0.value.length >= 2 && e2.value.length >= 2) {
      const item = {
        type: "NODE",
        children: [{ type: "BOLD", children: [e1] }],
        lspace: false,
        rspace: false,
      }
      context.stack.pop();
      context.stack.pop();
      context.stack.pop();
      e2.value = e2.value.slice(2);
      e0.value = e0.value.slice(2);
      if (e2.value.length > 0) context.stack.push(e2);
      context.stack.push(item);
      if (e0.value.length > 0) context.stack.push(e0);
      return true;
    }
    if (e0.value.length >= 1 && e2.value.length >= 1) {
      const item = {
        type: "NODE",
        children: [{ type: "ITALIC", children: [e1] }],
        lspace: false,
        rspace: false,
      }
      context.stack.pop();
      context.stack.pop();
      context.stack.pop();
      e2.value = e2.value.slice(1);
      e0.value = e0.value.slice(1);
      if (e2.value.length > 0) context.stack.push(e2);
      context.stack.push(item);
      if (e0.value.length > 0) context.stack.push(e0);
      return true;
    }
    return false;
  }

  tryReduceImage(context) {
    const N = context.stack.length;
    if (N < 7) return false;
    const e0 = context.stack[N - 1];
    const e1 = context.stack[N - 2];
    const e2 = context.stack[N - 3];
    const e3 = context.stack[N - 4];
    const e4 = context.stack[N - 5];
    const e5 = context.stack[N - 6];
    const e6 = context.stack[N - 7];
    if (e0.type !== "DELIM" || e0.value !== ")") return false;
    if (e1.type !== "NODE") return false;
    if (e2.type !== "DELIM" || e2.value !== "(") return false;
    if (e3.type !== "DELIM" || e3.value !== "]") return false;
    if (e4.type !== "NODE") return false;
    if (e5.type !== "DELIM" || e5.value !== "[") return false;
    if (e6.type !== "DELIM" || e6.value !== "!") return false;
    context.stack.pop();
    context.stack.pop();
    context.stack.pop();
    context.stack.pop();
    context.stack.pop();
    context.stack.pop();
    context.stack.pop();
    const item = {
      type: "IMAGE",
      children: [],
      alt: e4,
      src: e1,
      title: "",
    }
    context.stack.push({
      type: "NODE",
      children: [item],
      lspace: e6.lspace,
      rspace: e0.rspace,
    });
    return true;
  }

  tryReduceLink(context) {
    const N = context.stack.length;
    if (N < 6) return false;
    const e0 = context.stack[N - 1];
    const e1 = context.stack[N - 2];
    const e2 = context.stack[N - 3];
    const e3 = context.stack[N - 4];
    const e4 = context.stack[N - 5];
    const e5 = context.stack[N - 6];
    if (e0.type !== "DELIM" || e0.value !== ")") return false;
    if (e1.type !== "NODE") return false;
    if (e2.type !== "DELIM" || e2.value !== "(") return false;
    if (e3.type !== "DELIM" || e3.value !== "]") return false;
    if (e4.type !== "NODE") return false;
    if (e5.type !== "DELIM" || e5.value !== "[") return false;
    context.stack.pop();
    context.stack.pop();
    context.stack.pop();
    context.stack.pop();
    context.stack.pop();
    context.stack.pop();
    const item = {
      type: "LINK",
      children: [],
      text: e4,
      href: e1,
      title: "",
    }
    context.stack.push({
      type: "NODE",
      children: [item],
      lspace: e5.lspace,
      rspace: e0.rspace,
    });
    return true;
  }

  tryReduceLinkWithTitle(context) {
    const N = context.stack.length;
    if (N < 9) return false;
    const e0 = context.stack[N - 1];
    const e1 = context.stack[N - 2];
    const e2 = context.stack[N - 3];
    const e3 = context.stack[N - 4];
    const e4 = context.stack[N - 5];
    const e5 = context.stack[N - 6];
    const e6 = context.stack[N - 7];
    const e7 = context.stack[N - 8];
    const e8 = context.stack[N - 9];
    if (e0.type !== "DELIM" || e0.value !== ")") return false;
    if (e1.type !== "DELIM" || e1.value !== "\"") return false;
    if (e2.type !== "NODE") return false;
    if (e3.type !== "DELIM" || e3.value !== "\"") return false;
    if (e4.type !== "NODE") return false;
    if (e5.type !== "DELIM" || e5.value !== "(") return false;
    if (e6.type !== "DELIM" || e6.value !== "]") return false;
    if (e7.type !== "NODE") return false;
    if (e8.type !== "DELIM" || e8.value !== "[") return false;
    context.stack.pop();
    context.stack.pop();
    context.stack.pop();
    context.stack.pop();
    context.stack.pop();
    context.stack.pop();
    context.stack.pop();
    context.stack.pop();
    context.stack.pop();
    const item = {
      type: "LINK_WITH_TITLE",
      children: [],
      text: e7,
      href: e4,
      title: e2,
    }
    context.stack.push({
      type: "NODE",
      children: [item],
      lspace: e8.lspace,
      rspace: e0.rspace,
    });
    return true;
  }

  tryReduceLinkURL(context) {
    const N = context.stack.length;
    if (N < 3) return false;
    const e0 = context.stack[N - 1];
    const e1 = context.stack[N - 2];
    const e2 = context.stack[N - 3];
    if (e0.type !== "DELIM" || e0.value !== ">") return false;
    if (e1.type !== "NODE") return false;
    if (e2.type !== "DELIM" || e2.value !== "<") return false;
    context.stack.pop();
    context.stack.pop();
    context.stack.pop();
    const item = {
      type: "LINK",
      children: [],
      text: e1,
      href: e1,
    }
    context.stack.push({
      type: "NODE",
      children: [item],
      lspace: e2.lspace,
      rspace: e0.rspace,
    });
    return true;
  }

  tryReduceItem(context) {
    const N = context.stack.length;
    if (N < 1) return false;
    const e0 = context.stack[N - 1];
    if (e0.type === "NODE") return false;
    if (e0.type === "DELIM") return false;
    context.stack.pop();
    context.stack.push({
      type: "NODE",
      children: [e0],
      lspace: e0.lspace,
      rspace: e0.rspace,
    });
    return true;
  }

  tryReduceNode(context) {
    const N = context.stack.length;
    if (N < 2) return false;
    const e0 = context.stack[N - 1];
    const e1 = context.stack[N - 2];
    if (e0.type !== "NODE") return false;
    if (e1.type !== "NODE") return false;
    context.stack.pop();
    context.stack.pop();
    context.stack.push({
      type: "NODE",
      children: [e1, e0],
      lspace: e1.lspace,
      rspace: e0.rspace,
    });
    return true;
  }
}

class Renderer {
  render(node) {
    let result = "";
    if (node.children) {
      for (const child of node.children) {
        result += this.render(child);
      }
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
      case "INLINE":
        return this.renderInline(node);
      case "TEXT":
        return node.value;
      default:
        return result;
    }
  }

  renderInline(node) {
    let result = "";
    if (node.children) {
      for (const child of node.children) {
        result += this.renderInline(child);
      }
    }
    switch (node.type) {
      case "BOLD":
        return `<b>${result}</b>`;
      case "ITALIC":
        return `<i>${result}</i>`;
      case "LINE_BREAK":
        return `<br>`;
      case "CODE_INLINE":
        return `<code>${result}</code>`;
      case "IMAGE":
        const alt = node.alt ? this.renderInline(node.alt) : "";
        const src = node.src ? this.renderInline(node.src) : "";
        return `<img src="${src}" alt="${alt}"$>`;
      case "LINK": {
        const text = node.text ? this.renderInline(node.text) : "";
        const href = node.href ? this.renderInline(node.href) : "";
        return `<a href="${href}">${text}</a>`;
      }
      case "LINK_WITH_TITLE": {
        const text = node.text ? this.renderInline(node.text) : "";
        const href = node.href ? this.renderInline(node.href) : "";
        const title = node.title ? this.renderInline(node.title) : "";
        return `<a href="${href}" title="${title}">${text}</a>`;
      }
      case "CHUNK":
        return node.value;
      case "SPACE":
        return node.value;
      case "DELIM":
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
    if (node.children) {
      for (const child of node.children) {
        result += this.toStringAST(child, indent + 1);
      }
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
