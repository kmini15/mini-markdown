import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

export class DocumentRule extends Block {
  constructor(type) {
    super(type);
  }

  continue(context, node) {
    return true;
  }

  parse(context, parent) {
    if (parent) return null;
    const cursor = context.input.capture();
    const child = new Node(this.type, true);
    child.content = {
      text: "",
      start: cursor,
      end: cursor,
    };
    return child;
  }
}
