import Rule from "../../../rule.js";
import Node from "../../../../core/node.js";

class EscapeRule extends Rule {
  constructor(type) {
    super(type);
  }

  parse(node) {
    for (let child = node.firstChild; child;) {
      const next = child.next;
      this.parse(child);
      child = next;
    }
    if (node.type === "text" && node.fields.inline) {
      const content = node.value;
      const chunks = content.split(/\\(.?)/);
      node.value = chunks[0];
      for (let i = 1; i < chunks.length; i += 2) {
        const escapeNode = new Node(this.type);
        escapeNode.value = chunks[i];
        node.insertAfter(escapeNode);
        node = escapeNode;
        if (chunks[i + 1] !== "") {
          const textNode = new Node("text");
          textNode.value = chunks[i + 1];
          textNode.fields = {
            inline: true
          };
          node.insertAfter(textNode);
          node = textNode;
        }
      }
    }
    return node;
  }
}

export { EscapeRule };