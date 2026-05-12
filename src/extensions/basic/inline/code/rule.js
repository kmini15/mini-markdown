import Rule from "../../../rule.js";
import Node from "../../../../core/node.js";

class CodeRule extends Rule {
  constructor(type) {
    super(type);
  }

  parse(node) {
    for (let child = node.firstChild; child;) {
      const next = child.next;
      this.parse(child);
      child = next;
    }
    if (node.type !== "text" || !node.fields.inline) return;
    const parts = this.parseCodeSpans(node.value);
    if (parts.length === 1 && parts[0].type === "text") return;
    let current = node;
    for (const part of parts) {
      const nextNode = new Node(part.type === "code" ? this.type : "text");
      nextNode.value = part.value;
      if (part.type === "text") {
        nextNode.fields = { inline: true };
      }
      current.insertAfter(nextNode);
      current = nextNode;
    }
    node.unlink();
  }

  parseCodeSpans(text) {
    const parts = [];
    let pos = 0;
    while (pos < text.length) {
      const openMatch = text.slice(pos).match(/`+/);
      if (!openMatch) {
        this.pushText(parts, text.slice(pos));
        break;
      }
      const openStart = pos + openMatch.index;
      const openTicks = openMatch[0];
      const openEnd = openStart + openTicks.length;
      this.pushText(parts, text.slice(pos, openStart));
      const closeStart = text.indexOf(openTicks, openEnd);
      if (closeStart === -1) {
        this.pushText(parts, openTicks);
        pos = openEnd;
        continue;
      }
      parts.push({
        type: "code",
        value: text.slice(openEnd, closeStart),
      });
      pos = closeStart + openTicks.length;
    }
    return parts;
  }

  pushText(parts, value) {
    if (value === "") return;
    const last = parts.at(-1);
    if (last?.type === "text") {
      last.value += value;
    } else {
      parts.push({
        type: "text",
        value,
      });
    }
  }
}

export { CodeRule };