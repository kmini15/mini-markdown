import { Node, BlockRule } from "../block-rule.js";

class ParagraphRule extends BlockRule {
  constructor(rules) {
    super("PARAGRAPH");
    this.rules = [];
  }

  match(node, reader, context) {
    if (context.eof()) return false;
    for (let rule of this.rules) {
      if (rule.type === "DOCUMENT") continue;
      if (rule.type === "PARAGRAPH") continue;
      context.capture();
      const result = rule.start(node, reader, context);
      context.restore();
      if (result) {
        return false;
      }
    }
    if (context.remains().trim() === "") return false;
    const textNode = node.firstChild;
    textNode.value += "\n" + context.remains();
    context.advance(context.remains().length);
    return true;
  }

  start(parent, reader, context) {
    if (parent.type === this.type) return null;
    if (context.remains().trim() === "") return null;
    const textNode = new Node("TEXT");
    textNode.value = context.remains();
    textNode.fields = {
      inline: true,
    };
    context.advance(context.remains().length);
    const child = new Node(this.type);
    child.appendChild(textNode);
    return child;
  }

  setRules(rules) {
    this.rules = rules;
  }
}

export { ParagraphRule };