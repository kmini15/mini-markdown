import { Inline } from "../../../../core/inline.js";
import { Node } from "../../../../core/node.js";
import { split } from "../../../../core/text-utils.js";

export class EscapeRule extends Inline {
  constructor(type) {
    super(type);
  }
  
  parse(node) {
    this.dfs(node, (child) => {
      this.split(child, /(\\.?)/);
      this.match(child);
      this.merge(child);
    });
  }
  
  match(node) {
    for (let child = node.firstChild; child; child = child.next) {
      if (child.data.type !== "text") continue;
      if (/\\./.test(child.data.token.text)) {
        child.data.type = this.type;
        child.data.token.text = child.data.token.text;
      }
    }
  }
}
