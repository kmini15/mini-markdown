import Rule from "../../../rule.js";
import Node from "../../../../core/node.js";
import link from "../link/index.js";

class AutolinkEmailRule extends Rule {
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
    // Split text nodes by "<", and ">" to identify potential link syntax
    for (let child = node.firstChild; child;) {
      const next = child.next;
      if (child.type === "text" && child.fields.inline) {
        const content = child.value;
        const chunks = content.split(/(\<|\>)/);
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
        if (child.value === "<") {
          this.parseBracketL(child);
        } else if (child.value === ">") {
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
    // <A@B>
    if (closeNode.prev === openNode) {
      return;
    }
    if (closeNode.prev.prev !== openNode) {
      return;
    }
    const match = openNode.next.value.match(/^[^\s@]+@[^\s@]+$/);
    if (!match) {
      return;
    }
    const linkNode = new Node(this.type);
    linkNode.fields = {
      href: openNode.next.value,
    };
    closeNode.insertBefore(linkNode);
    openNode.next.unlink();
    openNode.unlink();
    closeNode.unlink();
  }
}

export { AutolinkEmailRule };