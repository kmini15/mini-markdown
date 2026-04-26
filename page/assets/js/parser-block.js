import Node from "./node.js";

class ParserBlock {
  constructor() {
    const paragraphRule = new ParagraphRule();
    this.rules = [
      new DocumentRule(),
      new HtmlRule(),
      new LinkReferenceDefinitionRule(),
      new CodeBlockRule(),
      new BlockquoteRule(),
      new ListRule(),
      new ListItemRule(),
      new HeadingRule(),
      new SetextHeadingRule(),
      new HorizontalRuleRule(),
      new GridRule(),
      new ParagraphRule(),
    ];
    this.rules.at(-1).setRules(this.rules);
    this.maxDepth = 20;
  }

  parse(text) {
    const reader = new LineReader(text);
    const stack = [];
    const node = new Node("DOCUMENT");
    node.fields = {
      markerColumn: 0,
      contentColumn: 0,
    };
    stack.push(node);
    while (!reader.eof()) {
      const line = reader.current();
      const context = new LineContext(line);
      console.log("Processing Line: ", reader.pos);
      console.log("Processing Input: ", line);
      console.log("stack:", stack.map(node => node.type).join(" > "));
      let stackIndex = 0;
      stackIndex = this.matchBlocks(stack, stackIndex, reader, context);
      stackIndex = this.carryBlocks(stack, stackIndex, reader, context);
      stackIndex = this.closeBlocks(stack, stackIndex, reader, context);
      stackIndex = this.resolveBlocks(stack, stackIndex, reader, context);
      stackIndex = this.startBlocks(stack, stackIndex, reader, context);
      reader.advance();
    }
    const documentNode = stack[0];
    const references = {};
    for (let child = documentNode.firstChild; child; child = child.next) {
      if (child.type === "LINK_REFERENCE_DEFINITION") {
        references[child.fields.label] = {
          destination: child.fields.destination,
          title: child.fields.title,
        };
      }
    }
    documentNode.fields.references = references;
    return documentNode;
  }

  getRule(node) {
    return this.rules.find(rule => rule.type === node.type);
  }

  matchBlocks(stack, stackIndex, reader, context) {
    for (let i = 0; i < stack.length; i++) {
      const node = stack[i];
      const rule = this.getRule(node);
      if (!rule) break; // No rule for this node type
      if (rule.match(node, reader, context)) {
        console.log("match rule:", rule.type);
        stackIndex = i;
      } else {
        break;
      }
    }
    return stackIndex;
  }

  carryBlocks(stack, stackIndex, reader, context) {
    for (let i = stackIndex + 1; i < stack.length; i++) {
      const node = stack[i];
      const rule = this.getRule(node);
      if (!rule) break; // No rule for this node type
      if (rule.carry(node, reader, context)) {
        console.log("carry rule:", rule.type);
        stackIndex = i;
      } else {
        break;
      }
    }
    const lastNode = stack[stack.length - 1];
    if (!lastNode) return stackIndex;
    if (lastNode.type !== "PARAGRAPH") return stackIndex;
    const rule = this.getRule(lastNode);
    if (!rule) return stackIndex; // No rule for this node type
    if (rule.carry(lastNode, reader, context)) {
      console.log("paragraph carry rule:", rule.type);
      stackIndex = stack.length - 1;
    }
    return stackIndex;
  }

  closeBlocks(stack, stackIndex, reader, context) {
    while (stack.length > stackIndex + 1) {
      const node = stack.pop();
      const rule = this.getRule(node);
      if (!rule) continue; // No rule for this node type
      console.log("close rule:", rule.type);
      rule.close(node, reader, context);
    }
    return stackIndex;
  }

  resolveBlocks(stack, stackIndex, reader, context) {
    for (let rule of this.rules) {
      const node = stack[stackIndex];
      const resolvedNode = rule.resolve(node, reader, context);
      if (!resolvedNode) continue;
      stack[stackIndex] = resolvedNode;
    }
    return stackIndex;
  }

  startBlocks(stack, stackIndex, reader, context) {
    for (let i = 0; i < this.maxDepth; i++) {
      if (context.eof()) break;
      const parent = stack[stack.length - 1];
      let started = false;
      for (let rule of this.rules) {
        const child = rule.start(parent, reader, context);
        if (!child) continue;
        console.log("start rule:", rule.type);
        parent.appendChild(child);
        stack.push(child);
        started = true;
        break;
      }
      if (!started) break;
    }
    stackIndex = stack.length - 1;
    return stackIndex;
  }
}

class LineReader {
  constructor(text) {
    this.lines = text.replace(/\r\n?/g, "\n").split("\n");
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

  retreat() {
    if (this.pos <= 0) return null;
    this.pos--;
  }
}

class LineContext {
  constructor(line) {
    this.line = line;
    this.index = 0;
    this.column = 0;
    this.indexCapture = 0;
  }

  eof() {
    return this.index >= this.line.length;
  }

  current() {
    if (this.eof()) return null;
    return this.line[this.index];
  }

  advance(n = 1) {
    this.index += n;
    this.column += n;
  }

  retreat(n = 1) {
    this.index -= n;
    this.column -= n;
  }

  remains() {
    if (this.eof()) return "";
    return this.line.slice(this.index);
  }

  capture() {
    this.indexCapture = this.index;
    this.columnCapture = this.column;
  }

  restore() {
    this.index = this.indexCapture;
    this.column = this.columnCapture;
  }
}

class BlockRule {
  constructor(type) {
    this.type = type;
  }

  match(node, reader, context) {
    return false;
  }

  carry(node, reader, context) {
    return this.match(node, reader, context);
  }

  close(node, reader, context) {
    return false;
  }

  resolve(node, reader, context) {
    return null;
  }

  start(parent, reader, context) {
    return null;
  }

  parse(node, reader, context) { }
}

class DocumentRule extends BlockRule {
  constructor() {
    super("DOCUMENT");
  }

  match(node, reader, context) {
    return true;
  }
}

class HtmlRule extends BlockRule {
  constructor() {
    super("HTML");
    this.pattern = /^(\s*)<([a-zA-Z][a-zA-Z0-9\-]*)(\s[^>]*)?>/;
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

  start(parent, reader, context) {
    console.log("html rule start");
    console.log("html rule context:", context.remains());
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return null;
    context.advance(context.remains().length);
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
    textNode.fields = {
      inline: false,
    };
    const htmlNode = new Node(this.type);
    htmlNode.appendChild(textNode);
    reader.retreat(); 
    return htmlNode;
  }
}

class LinkReferenceDefinitionRule extends BlockRule {
  constructor() {
    super("LINK_REFERENCE_DEFINITION");
    this.pattern = /^\s*\[([^\]]+)\]:\s*(\S+)(?:\s+"([^"]+)")?\s*$/;
  }

  start(parent, reader, context) {
    if (parent.type !== "DOCUMENT") return null;
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return null;
    context.advance(parsed[0].length);
    const child = new Node(this.type);
    child.fields = {
      label: parsed[1].trim(),
      destination: parsed[2].trim(),
      title: parsed[3] ? parsed[3].trim() : "",
    };
    return child;
  }
}

class CodeBlockRule extends BlockRule {
  constructor() {
    super("CODE_BLOCK");
    this.pattern = /^(\s{4})(.*)$/;
  }

  match(node, reader, context) {
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return false;
    const contentColumn = parsed[1].length + context.column;
    if (contentColumn < node.fields.contentColumn) return false;
    context.advance(parsed[1].length); // until content
    const textNode = node.firstChild;
    if (context.eof()) return;
    textNode.value += "\n" + context.remains();
    context.advance(context.remains().length);
    return true;
  }

  start(parent, reader, context) {
    if (parent.type === this.type) return null;
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return null;
    const markerColumn = context.column;
    const contentColumn = parsed[1].length + context.column;
    context.advance(parsed[1].length); // until content
    const textNode = new Node("TEXT");
    textNode.value = context.remains();
    textNode.fields = {
      inline: false,
    };
    context.advance(context.remains().length);
    const child = new Node(this.type);
    child.appendChild(textNode);
    child.fields = {
      markerColumn: markerColumn,
      contentColumn: contentColumn
    };
    return child;
  }
}

class BlockquoteRule extends BlockRule {
  constructor() {
    super("BLOCKQUOTE");
    this.pattern = /^((\s*)>)/;
  }

  match(node, reader, context) {
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return false;
    const markerColumn = parsed[2].length + context.column;
    if (markerColumn < node.fields.markerColumn) return false;
    context.advance(parsed[1].length);
    return true;
  }

  start(parent, reader, context) {
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return null;
    const markerColumn = parsed[2].length + context.column;
    const contentColumn = parsed[1].length + context.column;
    const child = new Node(this.type);
    child.fields = {
      markerColumn: markerColumn,
      contentColumn: contentColumn
    };
    context.advance(parsed[1].length);
    return child;
  }
}

class ListRule extends BlockRule {
  constructor() {
    super("LIST");
    this.pattern = /^((\s*)([-+*]|\d+[.)])\s)(\s*.*)/;
  }

  match(node, reader, context) {
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return false;
    const markerColumn = parsed[2].length + context.column;
    if (markerColumn < node.fields.markerColumn) return false;
    context.advance(parsed[2].length); // until marker
    return true;
  }

  start(parent, reader, context) {
    if (parent.type === this.type) return null;
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return null;
    const markerColumn = parsed[2].length + context.column;
    const contentColumn = parsed[1].length + context.column;
    context.advance(parsed[2].length); // until marker
    const child = new Node(this.type);
    child.fields = {
      markerColumn: markerColumn,
      contentColumn: contentColumn,
      ordered: /^\d+[.)]$/.test(parsed[3]),
    };
    return child;
  }

  carry(node, reader, context) {
    const parsed = context.remains().match(/^(\s*)/);
    if (!parsed) return false;
    const indentColumn = parsed[1].length + context.column;
    if (indentColumn < node.fields.contentColumn) return false;
    return true;
  }
}

class ListItemRule extends BlockRule {
  constructor() {
    super("LIST_ITEM");
    this.pattern = /^((\s*)([-+*]|\d+[.)])\s)(\s*.*)/;
  }

  match(node, reader, context) {
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return false;
    const markerColumn = parsed[2].length + context.column;
    if (markerColumn < node.fields.contentColumn) return false;
    context.advance(parsed[2].length); // until marker
    return true;
  }

  start(parent, reader, context) {
    if (parent.type !== "LIST") return null;
    if (parent.type === this.type) return null;
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return null;
    const markerColumn = parsed[2].length + context.column;
    const contentColumn = parsed[1].length + context.column;
    context.advance(parsed[1].length); // until content
    const child = new Node(this.type);
    child.fields = {
      markerColumn: markerColumn,
      contentColumn: contentColumn
    };
    return child;
  }

  carry(node, reader, context) {
    const parsed = context.remains().match(/^(\s*)/);
    if (!parsed) return false;
    const contentColumn = parsed[1].length + context.column;
    if (contentColumn < node.fields.contentColumn) return false;
    context.advance(node.fields.contentColumn - context.column);
    return true;
  }
}

class HeadingRule extends BlockRule {
  constructor() {
    super("HEADING");
    this.pattern = /^\s*(#{1,6})\s+(.*)$/;
  }

  start(parent, reader, context) {
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return null;
    const level = parsed[1].length;
    const textNode = new Node("TEXT");
    textNode.value = parsed[2];
    textNode.fields = {
      inline: true,
    };
    context.advance(parsed[0].length);
    const child = new Node(this.type);
    child.appendChild(textNode);
    child.fields = {
      level: level,
    }
    return child;
  }
}

class SetextHeadingRule extends BlockRule {
  constructor() {
    super("SETEXT_HEADING");
    this.pattern = /^([\s\S]+)\n\s*(=+|-+)\s*$/;
  }

  resolve(node, reader, context) {
    if (node.type !== "PARAGRAPH") return null;
    const textNode = node.firstChild;
    const parsed = textNode.value.match(this.pattern);
    if (!parsed) return null;
    textNode.value = parsed[1];
    const headingNode = new Node("HEADING");
    headingNode.appendChild(textNode);
    headingNode.fields = {
      level: parsed[2][0] === "=" ? 1 : 2,
    };
    node.insertAfter(headingNode);
    node.unlink();
    return headingNode;
  }
}

class HorizontalRuleRule extends BlockRule {
  constructor() {
    super("HORIZONTAL_RULE");
    this.pattern = /^\s*[-*_]{3,}\s*$/;
  }

  start(parent, reader, context) {
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return null;
    context.advance(parsed[0].length);
    const child = new Node(this.type);
    return child;
  }
}

class GridRule extends BlockRule {
  constructor() {
    super("GRID");
    this.pattern_open = /^(\s*):{4}\[([^\]:]+)(:[^\]:]+)?\]\s*$/;
    this.pattern_close = /^(\s*)([:]{4})\s*$/;
  }

  start(parent, reader, context) {
    const line = context.remains();
    const match = line.match(this.pattern_open);
    if (!match) return null;
    context.advance(line.length);
    reader.advance();
    const columns = match[2].trim();
    const gap = match[3] ? match[3].slice(1).trim() : 0;
    const node = new Node(this.type);
    node.fields.columns = columns;
    node.fields.gap = gap;
    let lines = [];
    while (!reader.eof()) {
      const line = reader.current();
      reader.advance();
      if (line.match(this.pattern_close)) {
        break;
      }
      lines.push(line);
    }
    for (let line of lines) {
      const textNode = new Node("TEXT");
      textNode.value = line;
      textNode.fields = {
        inline: true,
      };
      const itemNode = new Node("GRID_ITEM");
      itemNode.appendChild(textNode);
      node.appendChild(itemNode);
    }
    reader.retreat();
    return node;
  }
}

class ParagraphRule extends BlockRule {
  constructor(rules) {
    super("PARAGRAPH");
    this.rules = [];
  }

  match(node, reader, context) {
    if (context.eof()) return false;
    for (let rule of this.rules) {
      if (rule.type === "DOCUMENT") continue;
      if (rule.type === "PARAGRAPH") continue;
      context.capture();
      const result = rule.match(node, reader, context);
      context.restore();
      if (result) {
        return false;
      }
    }
    if (context.remains().trim() === "") return false;
    const textNode = node.firstChild;
    textNode.value += "\n" + context.remains();
    context.advance(context.remains().length);
    return true;
  }

  start(parent, reader, context) {
    if (parent.type === this.type) return null;
    if (context.remains().trim() === "") return null;
    const textNode = new Node("TEXT");
    textNode.value = context.remains();
    textNode.fields = {
      inline: true,
    };
    context.advance(context.remains().length);
    const child = new Node(this.type);
    child.appendChild(textNode);
    return child;
  }

  setRules(rules) {
    this.rules = rules;
  }
}

export default ParserBlock;