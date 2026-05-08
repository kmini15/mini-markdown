import Rule from "../../../rule.js";
import Node from "../../../../core/node.js";

class ImageRule extends Rule {
  constructor(type) {
    super(type);
    this.input = "";
    this.stack = [];
  }

  parse(node) {
    this.parseRecursive(node);
    this.input = "";
    this.stack = [];
  }

  parseRecursive(node) {
    for (let child = node.firstChild; child;) {
      const next = child.next;
      this.parseRecursive(child);
      child = next;
    }
    this.splitTextNode(node);
    this.parseBrackets(node);
    this.mergeTextNode(node);
  }

  splitTextNode(node) {
    // Split text nodes by "!", "[", and "]" to identify potential image syntax
    for (let child = node.firstChild; child;) {
      const next = child.next;
      if (child.type === "text" && child.fields.inline) {
        const content = child.value;
        const chunks = content.split(/(\!|\[|\])/);
        for (const chunk of chunks) {
          if (chunk === "") continue;
          const textNode = new Node("text");
          textNode.value = chunk;
          textNode.fields = {
            inline: true
          };
          child.insertBefore(textNode);
        }
        child.unlink();
      }
      child = next;
    }
  }

  mergeTextNode(node) {
    // Merge adjacent text nodes to simplify the tree
    let child = node.firstChild;
    while (child && child.next) {
      if (child.type === "text" && child.fields.inline &&
        child.next.type === "text" && child.next.fields.inline) {
        child.value += child.next.value;
        const toRemove = child.next;
        toRemove.unlink();
      } else {
        child = child.next;
      }
    }
  }

  parseBrackets(node) {
    for (let child = node.firstChild; child;) {
      const next = child.next;
      if (child.type === "text" && child.fields.inline) {
        if (child.value === "[") {
          this.parseBracketL(child);
        } else if (child.value === "]") {
          this.parseBracketR(child);
        }
      }
      child = next;
    }
  }

  parseBracketL(openNode) {
    this.stack.push(openNode);
  }

  parseBracketR(closeNode) {
    // No matching open bracket, treat as literal
    if (this.stack.length === 0) {
      return;
    }
    const openNode = this.stack.pop();
    if (!openNode.prev || openNode.prev.value !== "!") {
      return;
    }
    if (!closeNode.next) {
      return;
    }
    const pattern = /^\(([^\]"\)\s]*)\s*("([^\]"\)]*)")?\s*\)(.*)$/;
    const match = closeNode.next.value.match(pattern);
    if (!match) {
      return;
    }
    const [m_all, m_src, , m_title, m_remaining] = match;
    closeNode.next.value = m_remaining;
    const imageNode = new Node(this.type);
    imageNode.fields.src = m_src;
    imageNode.fields.title = m_title || "";
    for (let curr = openNode.next; curr !== closeNode; curr = curr.next) {
      imageNode.appendChild(curr);
      curr = openNode;
    }
    closeNode.insertBefore(imageNode);
    openNode.prev.unlink();
    openNode.unlink();
    closeNode.unlink();
  }
}

export { ImageRule };