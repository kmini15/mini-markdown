import { Inline } from "../../../../core/inline.js";
import { Node } from "../../../../core/node.js";

export class AutolinkUrlRule extends Inline {
  constructor(type) {
    super(type);
  }
  
  parse(node) {
    this.dfs(node, (child) => {
      this.split(child, /(\<|\>)/);
      this.match(child);
      this.merge(child);
    });
  }
  
  match(node) {
    for (let child = node.firstChild; child; child = child.next) {
      if (child.type !== "text") continue;
      if (/\</.test(child.content.text)) {
        const open = child;
        const text = child?.next;
        const close = text?.next;
        if (!text || !close) continue;
        if (/\>/.test(close.content.text)) {
          const pattern = /^[^\s:]+:[^\s:]+$/;
          const match = pattern.test(text.content.text);
          if (!match) continue;
          const linkNode = new Node(this.type);
          linkNode.content = {
            text: "",
            start: open.content.start,
            end: open.content.start,
          };
          linkNode.data.fields = {
            href: text.content.text,
          }
          linkNode.data.tokens.push({
            type: "marker",
            start: open.content.start,
            end: open.content.end,
          },
          {
            type: "content",
            start: text.content.start,
            end: text.content.end,
          },
          {
            type: "marker",
            start: close.content.start,
            end: close.content.end,
          });
          text.type = "literal";
          open.insertBefore(linkNode);
          linkNode.appendChild(text);
          open.unlink();
          close.unlink();
        }
      }
    }
  }
}
