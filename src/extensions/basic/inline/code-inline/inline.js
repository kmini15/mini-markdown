import { Inline } from "../../../../core/inline.js";
import { Node } from "../../../../core/node.js";

export class CodeInlineRule extends Inline {
  constructor(type) {
    super(type);
  }

  parse(node) {
    this.dfs(node, (child) => {
      this.split(child, /(`+)/);
      this.match(child);
      this.merge(child);
    });
  }

  match(node) {
    for (let child = node.firstChild; child; child = child.next) {
      if (child.data.type !== "text") continue;
      if (/`+/.test(child.data.token.text)) {
        const open = child;
        for (let next = open.next; next; next = next.next) {
          if (next.data.type !== "text") continue;
          if (next.data.token.text === open.data.token.text) {
            const close = next;
            const code = new Node(this.type);
            code.data.token = {
              text: "",
              start: open.data.token.start,
              end: open.data.token.start,
            };
            open.insertBefore(code);
            for (let between = open.next; between !== close;) {
              const next = between.next;
              if (between.data.type === "text") {
                between.data.type = "literal";
              }
              code.appendChild(between);
              between = next;
            }
            code.prependChild(open);
            code.appendChild(close);
            open.data.type = this.type + "-open";
            close.data.type = this.type + "-close";
          }
        }
      }
    }
  }
}
