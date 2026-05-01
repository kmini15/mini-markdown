import { Node, BlockRule } from "../block-rule.js";

class DocumentRule extends BlockRule {
  constructor() {
    super("DOCUMENT");
  }

  match(node, reader, context) {
    return true;
  }
}

export { DocumentRule };