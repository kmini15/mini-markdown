import { Inline } from "../../../../core/inline.js";
import { Node } from "../../../../core/node.js";

export class CodeInlineRule extends Inline {
  constructor(type) {
    super(type);
  }

  parse(node) {
    this.dfs(node, null, (child) => {
      this.split(child, /(`+)/);
      this.match(child);
      this.merge(child);
    });
  }

  match(node) {
    for (let child = node.firstChild; child;) {
      if (!this.isBackticks(child)) {
        child = child.next;
        continue;
      }
      const close = this.findClosingBackticks(child);
      if (!close) {
        child = child.next;
        continue;
      }
      const code = this.buildCodeNode(child, close);
      const next = close.next;
      child.insertBefore(code);
      child.unlink();
      close.unlink();
      child = next;
    }
  }


  isBackticks(node) {
    return node.type === "text" && /`+/.test(node.content.text);
  }

  findClosingBackticks(node) {
    for (let next = node.next; next; next = next.next) {
      if (this.isBackticks(next) && next.content.text === node.content.text) {
        return next;
      }
    }
    return null;
  }

  buildCodeNode(open, close) {
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
        type: "code",
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
    return code;
  }
}
