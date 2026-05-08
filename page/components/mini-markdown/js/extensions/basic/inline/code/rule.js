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
    if (node.type === "text" && node.fields.inline) {
      const content = node.value;
      const chunks = content.split(/(`+)(.+?)\1/);
      const first = node;
      for (let i = 0; i < chunks.length; i++) {
        if (/^`+/.test(chunks[i])) {
          const codeNode = new Node(this.type);
          codeNode.value = chunks[i + 1];
          node.insertAfter(codeNode);
          node = codeNode;
          i++;
        } else if (chunks[i] !== "") {
          const textNode = new Node("text");
          textNode.value = chunks[i];
          textNode.fields = {
            inline: true
          };
          node.insertAfter(textNode);
          node = textNode;
        }
      }
      first.unlink();
    }
  }
}

export { CodeRule };