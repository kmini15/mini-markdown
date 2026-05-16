import { Inline } from "../../../../core/inline.js";
import { Node } from "../../../../core/node.js";

export class SoftBreakRule extends Inline {
  constructor(type) {
    super(type);
  }

  parse(node) {
    for (let child = node.firstChild; child; child = child.next) {
      this.parse(child);
    }
    this.split(node, /(\n)/);
    this.match(node);
    this.merge(node);
  }

  match(node) {
    for (let child = node.firstChild; child; child = child.next) {
      if (child.data.type !== "text") continue;
      if (/\n/.test(child.data.token.text)) {
        child.data.type = this.type;
      }
    }
  }
}
