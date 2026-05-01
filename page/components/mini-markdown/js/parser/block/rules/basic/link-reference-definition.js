import { Node, BlockRule } from "../block-rule.js";

class LinkReferenceDefinitionRule extends BlockRule {
  constructor() {
    super("LINK_REFERENCE_DEFINITION");
    this.pattern = /^\s*\[([^\]]+)\]:\s*(\S+)(?:\s+"([^"]+)")?\s*$/;
  }

  start(parent, reader, context) {
    if (parent.type !== "DOCUMENT") return null;
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return null;
    context.advance(parsed[0].length);
    const child = new Node(this.type);
    child.fields = {
      label: parsed[1].trim(),
      destination: parsed[2].trim(),
      title: parsed[3] ? parsed[3].trim() : "",
    };
    return child;
  }
}

export { LinkReferenceDefinitionRule };