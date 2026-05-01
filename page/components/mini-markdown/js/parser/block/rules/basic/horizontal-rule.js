import { Node, BlockRule } from "../block-rule.js";

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

export { HorizontalRuleRule };