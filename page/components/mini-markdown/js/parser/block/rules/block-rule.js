import Node from "../../../core/node.js";
import TextWidth from "../../../core/text-width.js";

class BlockRule {
  constructor(type) {
    this.type = type;
  }

  match(node, reader, context) {
    return false;
  }

  carry(node, reader, context) {
    return this.match(node, reader, context);
  }

  start(parent, reader, context) {
    return null;
  }

  close(node, reader, context) {
    return false;
  }

  apply(paragraph, reader, context) {
    return false;
  }

}

export { Node, TextWidth, BlockRule };