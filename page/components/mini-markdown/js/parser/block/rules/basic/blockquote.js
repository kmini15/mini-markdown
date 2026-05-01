import { Node, BlockRule, TextWidth } from "../block-rule.js";

class BlockquoteRule extends BlockRule {
  constructor() {
    super("BLOCKQUOTE");
    this.pattern = /^((\s*)>)/;
    this.textWidth = new TextWidth();
  }

  match(node, reader, context) {
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return false;
    const markerColumn = this.textWidth.measure(parsed[2]) + context.column;
    if (markerColumn < node.fields.markerColumn) return false;
    context.advance(parsed[1].length);
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

export { BlockquoteRule };