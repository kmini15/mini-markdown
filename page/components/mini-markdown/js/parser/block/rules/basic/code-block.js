import { Node, BlockRule, TextWidth } from "../block-rule.js";

class CodeBlockRule extends BlockRule {
  constructor() {
    super("CODE_BLOCK");
    this.pattern = /^(\s{4})(.*)$/;
    this.textWidth = new TextWidth();
  }

  match(node, reader, context) {
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return false;
    const contentColumn = this.textWidth.measure(parsed[1]) + context.column;
    if (contentColumn < node.fields.contentColumn) return false;
    context.advance(parsed[1].length); // until content
    const textNode = node.firstChild;
    textNode.value += "\n" + context.remains();
    context.advance(context.remains().length);
    return true;
  }

  start(parent, reader, context) {
    if (parent.type === this.type) return null;
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return null;
    const markerColumn = context.column;
    const contentColumn = this.textWidth.measure(parsed[1]) + context.column;
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

export { CodeBlockRule };