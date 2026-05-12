import Rule from "../../../rule.js";
import Node from "../../../../core/node.js";
  
class SoftBreakRule extends Rule {
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
      const chunks = content.split("\n");
      node.value = chunks[0];
      for (let i = 1; i < chunks.length; i++) {
        const softBreakNode = new Node(this.type);
        node.insertAfter(softBreakNode);
        node = softBreakNode;
        const textNode = new Node("text");
        textNode.value = chunks[i];
        textNode.fields = {
          inline: true
        };
        node.insertAfter(textNode);
        node = textNode;
      }
    }
    return node;
  }
}

export { SoftBreakRule };