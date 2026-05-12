import Rule from "../../../rule.js";
import Node from "../../../../core/node.js";

class LinkCitationRule extends Rule {
  constructor(type) {
    super(type);
    this.input = "";
    this.stack = [];
    this.references = {};
  }

  parse(node) {
    this.parseRecursive(node);
    this.input = "";
    this.stack = [];
    this.references = {};
  }

  parseRecursive(node) {
    this.searchReferences(node);
    for (let child = node.firstChild; child;) {
      const next = child.next;
      this.parseRecursive(child);
      child = next;
    }
    this.splitTextNode(node);
    this.parseBrackets(node);
    this.mergeTextNode(node);
  }

  searchReferences(node) {
    for (let child = node.firstChild; child; child = child.next) {
      if (child.type === "link-reference") {
        const label = child.fields.label.trim();
        this.references[label] = {
          href: child.fields.href,
          title: child.fields.title,
        };
      }
    }
  }

  splitTextNode(node) {
    // Split text nodes by "[", and "]" to identify potential link syntax
    for (let child = node.firstChild; child;) {
      const next = child.next;
      if (child.type === "text" && child.fields.inline) {
        const content = child.value;
        const chunks = content.split(/(\[|\])/);
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
    if (!closeNode.next || closeNode.next.value !== "[") {
      return;
    }
    if (!closeNode.next.next) {
      return;
    }
    if (!closeNode.next.next.next || closeNode.next.next.next.value !== "]") {
      return;
    }
    const label = closeNode.next.next.value.trim();
    const reference = this.references[label];
    if (!reference) {
      return;
    }
    const linkNode = new Node(this.type);
    linkNode.fields.label = label;
    linkNode.fields.href = reference.href;
    linkNode.fields.title = reference.title;
    for (let curr = openNode.next; curr !== closeNode; curr = curr.next) {
      linkNode.appendChild(curr);
      curr = openNode;
    }
    closeNode.insertBefore(linkNode);
    openNode.unlink();
    closeNode.next.next.next.unlink();
    closeNode.next.next.unlink();
    closeNode.next.unlink();
    closeNode.unlink();
  }
}

export { LinkCitationRule };