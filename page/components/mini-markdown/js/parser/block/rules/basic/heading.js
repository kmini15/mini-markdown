import { Node, BlockRule } from "../block-rule.js";

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

export { HeadingRule };