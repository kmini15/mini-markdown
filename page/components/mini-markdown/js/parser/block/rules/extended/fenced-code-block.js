import { Node, BlockRule, TextWidth } from "../block-rule.js";

class FencedCodeBlockRule extends BlockRule {
  constructor() {
    super("CODE_BLOCK");
    this.pattern_open = /^(\s*)(`{3,}|~{3,})([a-zA-Z0-9-]*)?\s*$/;
    this.pattern_close = /^(\s*)(`{3,}|~{3,})\s*$/;
    this.textWidth = new TextWidth();
  }

  start(parent, reader, context) {
    const line = context.remains();
    const matchOpen = line.match(this.pattern_open);
    if (!matchOpen) return null;
    const markerColumn = this.textWidth.measure(matchOpen[1]) + context.column;
    const contentColumn = this.textWidth.measure(matchOpen[0]) + context.column;
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

export { FencedCodeBlockRule };