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
      if (child.type !== "text") continue;
      if (/`+/.test(child.content.text)) {
        const open = child;
        for (let next = open.next; next; next = next.next) {
          if (next.type !== "text") continue;
          if (next.content.text === open.content.text) {
            const close = next;
            const code = new Node(this.type);
            code.content = {
              text: "",
              start: open.content.start,
              end: open.content.start,
            };
            code.data.tokens.push({
              type: "marker",
              text: open.content.text,
              start: open.content.start,
              end: open.content.end,
            });
            for (let between = open.next; between !== close;) {
              const next = between.next;
              if (between.type === "text") {
                between.type = "literal";
              }
              code.appendChild(between);
              code.data.tokens.push({
                type: "keyword",
                text: between.content.text,
                start: between.content.start,
                end: between.content.end,
              });
              between = next;
            }
            code.data.tokens.push({
              type: "marker",
              text: close.content.text,
              start: close.content.start,
              end: close.content.end,
            });
            open.insertBefore(code);
            open.unlink();
            close.unlink();
          }
        }
      }
    }
  }
}
