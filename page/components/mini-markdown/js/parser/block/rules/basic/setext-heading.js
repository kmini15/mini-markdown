import { Node, BlockRule } from "../block-rule.js";

class SetextHeadingRule extends BlockRule {
  constructor() {
    super("SETEXT_HEADING");
    this.pattern = /^\s*(=+|-+)\s*$/;
  }

  apply(paragraph, reader, context) {
    if (paragraph.type !== "PARAGRAPH") return false;
    const match = context.remains().match(this.pattern);
    if (!match) return false;
    paragraph.type = "HEADING";
    paragraph.fields = {
      level: match[1][0] === "=" ? 1 : 2
    };
    context.advance(match[0].length);
    return true;
  }
}

export { SetextHeadingRule };