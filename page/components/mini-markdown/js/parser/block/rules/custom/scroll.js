import { Node, BlockRule, TextWidth } from "../block-rule.js";


class ScrollRule extends BlockRule {
  constructor() {
    super("SCROLL");
    this.pattern = /^((\s*)<::>)/;
    this.textWidth = new TextWidth();
  }

  match(node, reader, context) {
    const indent = context.remains().match(/^(\s*)/)[1];
    const contentColumn = this.textWidth.measure(indent) + context.column;
    if (contentColumn < node.fields.contentColumn) return false;
    context.advance(node.fields.contentColumn - context.column);
    return true;
  }

  start(parent, reader, context) {
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return null;
    const markerColumn = this.textWidth.measure(parsed[2]) + context.column;
    const contentColumn = this.textWidth.measure(parsed[1]) + context.column;
    const child = new Node(this.type);
    child.fields = {
      markerColumn: markerColumn,
      contentColumn: contentColumn
    };
    context.advance(parsed[1].length);
    return child;
  }
}

export { ScrollRule };