import { Inline } from "../../../../core/inline.js";
import { Node } from "../../../../core/node.js";

export class HardBreakRule extends Inline {
  constructor(type) {
    super(type);
  }

  parse(node) {
    this.dfs(node, (child) => {
      this.split(child, /(\ \ \n|\\\n)/);
      this.match(child);
      this.merge(child);
    });
  }
  
  match(node) {
    for (let child = node.firstChild; child; child = child.next) {
      if (child.data.type !== "text") continue;
      if (/\ \ \n|\\\n/.test(child.data.token.text)) {
        child.data.type = this.type;
      }
    }
  }
}
