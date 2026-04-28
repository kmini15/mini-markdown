import Node from "./node.js";

class ParserBlock {
  constructor() {
    const paragraphRule = new ParagraphRule();
    this.rules = [
      new DocumentRule(),
      new LinkReferenceDefinitionRule(),
      new HtmlRule(),
      new CodeBlockRule(),
      new FencedCodeBlockRule(),
      new BlockquoteRule(),
      new ListRule(),
      new ListItemRule(),
      new HeadingRule(),
      new SetextHeadingRule(),
      new HorizontalRuleRule(),
      new TableRule(),
      new GridRule(),
      new GridTableRule(),
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
      stackIndex = stack.length - 1;
    }
    return stackIndex;
  }

  closeBlocks(stack, stackIndex, reader, context) {
    while (stack.length > stackIndex + 1) {
      const node = stack.pop();
      const rule = this.getRule(node);
      if (!rule) continue; // No rule for this node type
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
    this.posCapture = 0;
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

  capture() {
    this.posCapture = this.pos;
  }

  restore() {
    this.pos = this.posCapture;
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
      contentColumn: contentColumn,
      language: ""
    };
    return child;
  }
}

class FencedCodeBlockRule extends BlockRule {
  constructor() {
    super("CODE_BLOCK");
    this.pattern_open = /^(\s*)(`{3,}|~{3,})([a-zA-Z0-9-]*)?\s*$/;
    this.pattern_close = /^(\s*)(`{3,}|~{3,})\s*$/;
  }

  start(parent, reader, context) {
    const line = context.remains();
    const matchOpen = line.match(this.pattern_open);
    if (!matchOpen) return null;
    const markerColumn = matchOpen[1].length + context.column;
    const contentColumn = matchOpen[0].length + context.column;
    context.advance(line.length);
    reader.advance();
    const lines = [];
    while (!reader.eof()) {
      const line = reader.current();
      const matchClose = line.match(this.pattern_close);
      if (matchClose && matchClose[2] === matchOpen[2]) {
        break;
      }
      lines.push(line);
      reader.advance();
    }
    const textNode = new Node("TEXT");
    textNode.value = lines.join("\n");
    textNode.fields = {
      inline: false,
    };
    const child = new Node(this.type);
    child.appendChild(textNode);
    child.fields = {
      markerColumn: markerColumn,
      contentColumn: contentColumn,
      language: matchOpen[3] ? matchOpen[3].trim() : ""
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
      const result = rule.start(node, reader, context);
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

class TableRule extends BlockRule {
  constructor() {
    super("TABLE");
    this.pattern_row = /^[\s\S]+\|[\s\S]+$/;
    this.pattern_delimiter = /^\|?[-:]+\|[-:]+/;
  }

  start(parent, reader, context) {
    const headerLine = context.remains();
    const matchHeader = headerLine?.match(this.pattern_row);
    if (!matchHeader) return null;
    reader.advance();
    const delimiterLine = reader.current();
    const matchDelimiter = delimiterLine?.match(this.pattern_delimiter);
    reader.retreat();
    if (!delimiterLine || !matchDelimiter) return null;
    const numHeaderColumns = this.getNumColumns(headerLine);
    const numDelimiterColumns = this.getNumColumns(delimiterLine);
    if (numHeaderColumns !== numDelimiterColumns) return null;
    reader.advance();
    reader.advance();
    // Matched a table header and delimiter
    const tableNode = new Node(this.type);
    const alignments = this.getCellAlignments(delimiterLine);
    const headerRowNode = this.buildTableHeaderRowNode(headerLine, alignments);
    tableNode.appendChild(headerRowNode);
    while (!reader.eof()) {
      const line = reader.current();
      if (!line.match(this.pattern_row)) break;
      if (this.getNumColumns(line) !== numHeaderColumns) break;
      const rowNode = this.buildTableRowNode(line, alignments);
      tableNode.appendChild(rowNode);
      reader.advance();
    }
    context.advance(headerLine.length);
    reader.retreat();
    return tableNode;
  }

  getNumColumns(line) {
    const normalizedLine = line.trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "");
    const cells = normalizedLine.split("|");
    return cells.length;
  }

  getCellContents(line) {
    const normalizedLine = line.trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "");
    const cells = normalizedLine.split("|")
      .map(cell => cell.trim());
    return cells;
  }

  getCellAlignments(delimiterLine) {
    const normalizedLine = delimiterLine.trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "");
    const cells = normalizedLine.split("|")
      .map(cell => cell.trim());
    const alignments = cells.map(cell => {
      if (cell.startsWith(":") && cell.endsWith(":")) {
        return "center";
      } else if (cell.startsWith(":")) {
        return "left";
      } else if (cell.endsWith(":")) {
        return "right";
      } else {
        return "left";
      }
    });
    return alignments;
  }

  buildTableHeaderRowNode(headerLine, alignments) {
    const headerCells = this.getCellContents(headerLine);
    const headerRowNode = new Node("TABLE_ROW");
    for (let i = 0; i < headerCells.length; i++) {
      const cell = headerCells[i];
      const alignment = alignments[i];
      const headerCellNode = new Node("TABLE_HEADER");
      headerCellNode.fields = {
        align: alignment,
      };
      const textNode = new Node("TEXT");
      textNode.value = cell;
      textNode.fields = {
        inline: true,
      };
      headerCellNode.appendChild(textNode);
      headerRowNode.appendChild(headerCellNode);
    }
    return headerRowNode;
  }

  buildTableRowNode(line, alignments) {
    const cells = this.getCellContents(line);
    const rowNode = new Node("TABLE_ROW");
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const alignment = alignments[i];
      const cellNode = new Node("TABLE_DATA");
      cellNode.fields = {
        align: alignment,
      };
      const textNode = new Node("TEXT");
      textNode.value = cell;
      textNode.fields = {
        inline: true,
      };
      cellNode.appendChild(textNode);
      rowNode.appendChild(cellNode);
    }
    return rowNode;
  }
}

class GridTableRule extends BlockRule {
  constructor() {
    super("GRID_TABLE");
    this.patternDiv = /^(\s*)[|][\s\S]+[|]/;
    this.patternRow0 = /^(\s*)[|+][:'.]?[\s]+[:'.]?[|+]/;
    this.patternRow1 = /^(\s*)[|+][:'.]?[\-]+[:'.]?[|+]/;
    this.patternRow2 = /^(\s*)[|+][:'.]?[\=]+[:'.]?[|+]/;
    this.patternRow3 = /^(\s*)[|+][:'.]?[\s\S]+[:'.]?[|+]/;
  }

  parseColumns(rowLine) {
    const normalizedLine = rowLine.trim()
      .replace(/^[|+]/, "")
      .replace(/[|+]$/, "");
    const cells = normalizedLine.split(/[|+]/);
    const columns = [];
    let index = 0;
    for (const cell of cells) {
      index += cell.length + 1;
      columns.push(index);
    }
    return columns;
  }

  parseColSpans(divLine, columns) {
    const normalizedLine = divLine.trim();
    const colSpans = [];
    for (const column of columns) {
      if (/[|+]/.test(normalizedLine[column])) {
        colSpans.push(1); // line
      } else {
        colSpans.push(0); // no line
      }
    }
    return colSpans;
  }

  parseRowSpans(rowLine, columns) {
    const normalizedLine = rowLine.trim();
    const rowSpans = [];
    let curr = 1;
    for (const column of columns) {
      const chunk = normalizedLine.slice(curr, column);
      if (/\s+/.test(chunk)) {
        rowSpans.push(0); // no line
      } else {
        rowSpans.push(1);
      }
      curr = column + 1;
    }
    return rowSpans;
  }

  parseCells(divLine, columns, colSpans) {
    const normalizedLine = divLine.trim();
    const cells = [];
    let begin = 0;
    let count = 0;
    for (let i = 0; i < columns.length; i++) {
      if (colSpans[i] === 1) {
        const content = normalizedLine.slice(begin + 1, columns[i]).trim();
        cells.push(content);
        cells.push(...Array(count).fill(""));
        begin = columns[i];
        count = 0;
      } else {
        count++;
      }
    }
    return cells;
  }

  parseHorizontalAlignments(rowLine, columns) {
    const normalizedLine = rowLine.trim();
    const alignments = [];
    let curr = 0;
    for (const column of columns) {
      let markL = normalizedLine[curr + 1];
      let markR = normalizedLine[column - 1];
      if (/[:'.]/.test(markL) && /[:'.]/.test(markR) && markL !== markR) {
        alignments.push("");
        curr = column;
        continue;
      }
      if (/[:'.]/.test(markL)) markL = ":";
      if (/[:'.]/.test(markR)) markR = ":";
      let alignH;
      if (markL === ":" && markR === ":") {
        alignH = "center";
      } else if (markL === ":") {
        alignH = "left";
      } else if (markR === ":") {
        alignH = "right";
      } else {
        alignH = "";
      }
      alignments.push(alignH);
      curr = column;
    }
    return alignments;
  }

  parseVerticalAlignments(rowLine, columns) {
    const normalizedLine = rowLine.trim();
    const alignments = [];
    let curr = 0;
    for (const column of columns) {
      let markL = normalizedLine[curr + 1];
      let markR = normalizedLine[column - 1];
      if (/[:'.]/.test(markL) && /[:'.]/.test(markR) && markL !== markR) {
        alignments.push("");
        curr = column;
        continue;
      }
      let alignV;
      if (markL === ":") {
        alignV = "center";
      } else if (markL === "'") {
        alignV = "start";
      } else if (markL === ".") {
        alignV = "end";
      } else if (markR === ":") {
        alignV = "center";
      } else if (markR === "'") {
        alignV = "start";
      } else if (markR === ".") {
        alignV = "end";
      } else {
        alignV = "";
      }
      alignments.push(alignV);
      curr = column;
    }
    return alignments;
  }

  parseHeaders(rowLine, columns) {
    const normalizedLine = rowLine.trim();
    const headers = [];
    let curr = 0;
    for (const column of columns) {
      const chunk = normalizedLine.slice(curr, column + 1);
      if (chunk.includes("=")) {
        headers.push(true);
      } else {
        headers.push(false);
      }
      curr = column;
    }
    return headers;
  }

  start(parent, reader, context) {
    reader.capture();
    const openLine = context.remains();
    const openMatch = openLine.match(this.patternRow1);
    reader.advance();
    if (!openMatch) {
      reader.restore();
      return null;
    }
    const divLine = reader.current();
    const divMatch = divLine?.match(this.patternDiv);
    reader.advance();
    if (!divMatch) {
      reader.restore();
      return null;
    }
    const rowLine = reader.current();
    const rowMatch = rowLine?.match(this.patternRow3);
    reader.advance();
    if (!rowMatch) {
      reader.restore();
      return null;
    }
    // Matched a table header and delimiter
    const columns = this.parseColumns(openLine);
    const colSpans = this.parseColSpans(divLine, columns);
    const rowSpans = this.parseRowSpans(rowLine, columns);
    const divCells = this.parseCells(divLine, columns, colSpans);
    const rowCells = this.parseCells(rowLine, columns, colSpans);
    const alignH = this.parseHorizontalAlignments(rowLine, columns);
    const alignV = this.parseVerticalAlignments(rowLine, columns);
    const headers = this.parseHeaders(rowLine, columns);
    const tableColSpans = [colSpans];
    const tableRowSpans = [rowSpans];
    const tableDivCells = [divCells];
    const tableRowCells = [rowCells];
    const tableAlignH = [alignH];
    const tableAlignV = [alignV];
    const tableHeaders = [headers];
    while (!reader.eof()) {
      reader.capture();
      const divLine = reader.current();
      const divLineMatch = divLine?.match(this.patternDiv);
      reader.advance();
      const rowLine = reader.current();
      const rowLineMatch = rowLine?.match(this.patternRow3);
      reader.advance();
      if (!divLineMatch || !rowLineMatch) {
        reader.restore();
        break;
      }
      const colSpans = this.parseColSpans(divLine, columns);
      const rowSpans = this.parseRowSpans(rowLine, columns);
      const divCells = this.parseCells(divLine, columns, colSpans);
      const rowCells = this.parseCells(rowLine, columns, colSpans);
      const alignH = this.parseHorizontalAlignments(rowLine, columns);
      const alignV = this.parseVerticalAlignments(rowLine, columns);
      const headers = this.parseHeaders(rowLine, columns);
      tableColSpans.push(colSpans);
      tableRowSpans.push(rowSpans);
      tableDivCells.push(divCells);
      tableRowCells.push(rowCells);
      tableAlignH.push(alignH);
      tableAlignV.push(alignV);
      tableHeaders.push(headers);
    }
    // Sweep cols to calculate col spans
    for (let row = 0; row < tableColSpans.length; row++) {
      let index = 0;
      for (let col = 0; col < colSpans.length; col++) {
        if (tableColSpans[row][col] === 0) continue;
        tableColSpans[row][col] = 0;
        tableColSpans[row][index] = col - index + 1;
        if (tableColSpans[row][index] > 1) {
          const alignHL = tableAlignH[row][index];
          const alignHR = tableAlignH[row][col];
          const alignVL = tableAlignV[row][index];
          const alignVR = tableAlignV[row][col];
          if (alignHL === "left" && alignHR === "right") {
            if (alignVL === alignVR) {
              tableAlignH[row][index] = "center";
              tableAlignV[row][index] = alignVL;
            } else {
              tableAlignH[row][index] = "";
              tableAlignV[row][index] = "";
            }
          } else if (alignHL === "left" && alignHR === "") {
            tableAlignH[row][index] = "left";
            tableAlignV[row][index] = alignVL;
          } else if (alignHL === "" && alignHR === "right") {
            tableAlignH[row][index] = "right";
            tableAlignV[row][index] = alignVR;
          } else {
            tableAlignH[row][index] = "";
            tableAlignV[row][index] = "";
          }
        }
        let header = tableHeaders[row][index];
        for (let i = index + 1; i <= col; i++) {
          header = header || tableHeaders[row][i];
        }
        tableHeaders[row][index] = header;
        index = col + 1;
      }
    }
    // Sweep rows to calculate row spans & merge cells
    for (let col = 0; col < columns.length; col++) {
      let index = 0;
      for (let row = 0; row < tableRowSpans.length; row++) {
        if (tableRowSpans[row][col] === 0) continue;
        tableRowSpans[row][col] = 0;
        tableRowSpans[index][col] = row - index + 1;
        for (let i = index + 1; i <= row; i++) {
          tableDivCells[index][col] += "\n" + tableRowCells[i - 1][col];
          tableRowCells[i - 1][col] = "";
          tableDivCells[index][col] += "\n" + tableDivCells[i][col];
          tableDivCells[i][col] = "";
        }
        // Carry alignments and headers from the bottom cell to the merged cell
        tableAlignH[index][col] = tableAlignH[row][col];
        tableAlignV[index][col] = tableAlignV[row][col];
        tableHeaders[index][col] = tableHeaders[row][col];
        index = row + 1;
      }
    }
    const tableNode = new Node("GRID_TABLE");
    tableNode.fields = {
      columns: columns.length,
    };
    for (let row = 0; row < tableRowSpans.length; row++) {
      const rowNode = new Node("GRID_TABLE_ROW");
      for (let col = 0; col < columns.length; col++) {
        const divCell = tableDivCells[row][col];
        const rowCell = tableRowCells[row][col];
        const colSpan = tableColSpans[row][col];
        const rowSpan = tableRowSpans[row][col];
        const alignH = tableAlignH[row][col];
        const alignV = tableAlignV[row][col];
        const header = tableHeaders[row][col];
        if (colSpan === 0 || rowSpan === 0) continue;
        const cellType = (header) ? "GRID_TABLE_HEADER" : "GRID_TABLE_DATA";
        const cellNode = new Node(cellType);
        cellNode.fields = {
          row: row + 1,
          col: col + 1,
          rowSpan: rowSpan,
          colSpan: colSpan,
          alignH: alignH,
          alignV: alignV,
        };
        const textNode = new Node("TEXT");
        textNode.value = divCell;
        textNode.fields = {
          inline: true,
        };
        cellNode.appendChild(textNode);
        rowNode.appendChild(cellNode);
      }
      tableNode.appendChild(rowNode);
    }
    context.advance(openLine.length);
    reader.retreat();
    return tableNode;
  }
}

export default ParserBlock;