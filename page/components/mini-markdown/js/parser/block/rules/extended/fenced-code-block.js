import { Node, BlockRule, TextWidth } from "../block-rule.js";

class FencedCodeBlockRule extends BlockRule {
  constructor() {
    super("FENCED_CODE_BLOCK");
    this.pattern_open = /^(\s*)(`{3,}|~{3,})([a-zA-Z0-9-]*)?\s*$/;
    this.pattern_close = /^(\s*)(`{3,}|~{3,})\s*$/;
    this.textWidth = new TextWidth();
  }

  match(node, reader, context) {
    return false;
  }

  start(parent, reader, context) {
    if (parent.type === this.type) return null;
    const line = context.remains();
    const matchOpen = line.match(this.pattern_open);
    if (!matchOpen) return null;
    const markerColumn = this.textWidth.measure(matchOpen[1]) + context.column;
    const contentColumn = this.textWidth.measure(matchOpen[1]) + context.column;
    context.advance(line.length);
    const textNode = new Node("TEXT");
    textNode.value = "";
    textNode.fields = {
      inline: false,
    };
    const child = new Node(this.type);
    child.appendChild(textNode);
    child.fields = {
      markerColumn: markerColumn,
      contentColumn: contentColumn,
      language: matchOpen[3] ? matchOpen[3].trim() : "",
    };
    return child;
  }

  carry(node, reader, context) {
    const line = context.remains();
    const matchClose = line.match(this.pattern_close);
    if (!matchClose) {
      const indent = line.match(/^\s*/)[0];
      const contentColumn = this.textWidth.measure(indent) + context.column;
      if (contentColumn < node.fields.contentColumn) {
        return false;
      }
      context.advance(node.fields.contentColumn - context.column);
      if (node.firstChild.value) node.firstChild.value += "\n";
      node.firstChild.value += context.remains();
      context.advance(context.remains().length);
      return true;
    }
    const markerColumn = this.textWidth.measure(matchClose[1]) + context.column;
    if (markerColumn !== node.fields.markerColumn) {
      context.advance(node.fields.contentColumn - context.column);
      if (node.firstChild.value) node.firstChild.value += "\n";
      node.firstChild.value += context.remains();
      context.advance(context.remains().length);
      return true;
    }
    context.advance(context.remains().length);
    return false;
  }
}

export { FencedCodeBlockRule };