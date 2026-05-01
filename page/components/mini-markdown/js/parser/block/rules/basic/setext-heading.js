import { Node, BlockRule } from "../block-rule.js";

class SetextHeadingRule extends BlockRule {
  constructor() {
    super("SETEXT_HEADING");
    this.pattern = /^\s*(=+|-+)\s*$/;
  }

  start(parent, reader, context) {
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return null;
    if (parent.type === "PARAGRAPH") {
      const child = new Node(this.type);
      child.fields = {
        level: parsed[1][0] === "=" ? 1 : 2,
      };
      context.advance(parsed[0].length);
      return child;
    } else if (parent.lastChild && parent.lastChild.type === "PARAGRAPH") {
      parent.lastChild.type = "HEADING";
      parent.lastChild.fields = {
        level: parsed[1][0] === "=" ? 1 : 2,
      };
      context.advance(parsed[0].length);
      return parent.lastChild;
    }
    return null;
  }
}

export { SetextHeadingRule };