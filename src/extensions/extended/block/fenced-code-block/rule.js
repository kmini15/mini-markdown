import Rule from "../../../rule.js";
import Node from "../../../../core/node.js";
import TextWidth from "../../../../core/text-width.js";

class FencedCodeBlockRule extends Rule {
  constructor(type) {
    super(type);
    this.patternOpen = /(\s*)```(\w+)?\s*$/;
    this.patternLine = /(\s*)(.*)$/;
    this.patternClose = /(\s*)```\s*$/;
    this.textWidth = new TextWidth();
  }

  start(context, parent) {
    const capture = context.input.capture();
    const node = this.parse(context, parent);
    context.input.restore(capture);
    if (!node) return false;
    return true;
  }

  parse(context, parent) {
    const line = context.input.current();
    if (!line) return null;
    const matchOpen = line.match(this.patternOpen);
    if (!matchOpen) return null;
    const [m_all, m_indent, m_language] = matchOpen;
    const language = m_language || "";
    const indent = m_indent.length + context.input.column();
    const column = indent;
    const lines = [];
    let isClosed = false;
    while (!context.input.eof()) {
      const capture = context.input.capture();
      context.input.advance();
      const line = context.input.current();
      const matchLine = line.match(this.patternLine);
      if (matchLine[1].length < column) {
        context.input.restore(capture);
        return null;
      }
      const matchClose = line.match(this.patternClose);
      if (matchClose && matchClose[1].length === column) {
        isClosed = true;
        break;
      } else {
        lines.push(line.slice(column));
      }
    }
    if (!isClosed) {
      return null;
    }
    context.input.consume(context.input.current().length);
    const textNode = new Node("text");
    textNode.value = lines.join("\n");
    const codeNode = new Node(this.type);
    codeNode.fields = {
      language: language,
    }
    codeNode.appendChild(textNode);
    return codeNode;
  }
}

export { FencedCodeBlockRule };