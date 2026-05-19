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
      if (child.type !== "text") continue;
      if (/\\./.test(child.content.text)) {
        child.type = this.type;
        child.data.tokens.push({
          type: "marker",
          text: child.content.text[0],
          start: child.content.start,
          end: {
            row: child.content.start.row,
            col: child.content.start.col + 1,
            idx: child.content.start.idx + 1,
          }
        });
        child.data.tokens.push({
          type: "content",
          text: child.content.text[1],
          start: {
            row: child.content.start.row,
            col: child.content.start.col + 1,
            idx: child.content.start.idx + 1,
          },
          end: child.content.end,
        });
      }
    }
  }
}
