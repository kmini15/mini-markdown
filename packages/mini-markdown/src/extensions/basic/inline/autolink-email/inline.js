import { Inline } from "../../../../core/inline.js";
import { Node } from "../../../../core/node.js";

export class AutolinkEmailRule extends Inline {
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
      if (child.data.type !== "text") continue;
      if (/\</.test(child.data.token.text)) {
        const open = child;
        const text = child?.next;
        const close = text?.next;
        if (!text || !close) continue;
        if (/\>/.test(close.data.token.text)) {
          const pattern = /^[^\s@]+@[^\s@]+$/;
          const match = pattern.test(text.data.token.text);
          if (!match) continue;
          const linkNode = new Node(this.type);
          linkNode.data.token = {
            text: "",
            start: open.data.token.start,
            end: open.data.token.start,
          };
          linkNode.data.fields = {
            href: "mailto:" + text.data.token.text,
          }
          open.data.type = this.type + "-open";
          text.data.type = "literal";
          close.data.type = this.type + "-close";
          open.insertBefore(linkNode);
          linkNode.appendChild(open);
          linkNode.appendChild(text);
          linkNode.appendChild(close);
        }
      }
    }
  }
}
