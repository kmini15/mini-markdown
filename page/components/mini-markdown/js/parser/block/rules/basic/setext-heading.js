import { Node, BlockRule } from "../block-rule.js";

class SetextHeadingRule extends BlockRule {
  constructor() {
    super("SETEXT_HEADING");
    this.pattern = /^([\s\S]+)\n\s*(=+|-+)\s*$/;
  }

  resolve(node, reader, context) {
    if (node.type !== "PARAGRAPH") return null;
    const textNode = node.firstChild;
    const parsed = textNode.value.match(this.pattern);
    if (!parsed) return null;
    textNode.value = parsed[1];
    const headingNode = new Node("HEADING");
    headingNode.appendChild(textNode);
    headingNode.fields = {
      level: parsed[2][0] === "=" ? 1 : 2,
    };
    node.insertAfter(headingNode);
    node.unlink();
    return headingNode;
  }
}

export { SetextHeadingRule };