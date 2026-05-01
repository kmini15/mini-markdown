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

  close(node, reader, context) {
    return false;
  }

  resolve(node, reader, context) {
    return null;
  }

  start(parent, reader, context) {
    return null;
  }
}

export { Node, TextWidth, BlockRule };