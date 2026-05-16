import { Inline } from "../../../../core/inline.js";
import { Node } from "../../../../core/node.js";

export class ImageRule extends Inline {
  constructor(type) {
    super(type);
    this.stack = [];
  }
  
  parse(node) {
    this.dfs(node, (child) => {
      this.split(child, /(!\[|\]|\(|\))/);
      this.match(child);
      this.merge(child);
    });
  }
  
  match(node) {
    for (let child = node.firstChild; child; child = child.next) {
      if (child.data.type === "text") {
        if (child.data.token.text === "![") {
          const node = this.parseBracketL(child);
          if (node) child = node;
        } else if (child.data.token.text === "]") {
          const node = this.parseBracketR(child);
          if (node) child = node;
        }
      }
    }
  }

  parseBracketL(nodeLabelOpen) {
    this.stack.push(nodeLabelOpen);
    return nodeLabelOpen;
  }

  parseBracketR(nodeLabelClose) {
    // ![....](....)
    // |    |||   |
    // |    |||   +-- nodeDestClose
    // |    ||+------ nodeDest
    // |    |+------- nodeDestOpen
    // |    +-------- nodeLabelClose
    // +------------- nodeLabelOpen
    if (this.stack.length === 0) return null; // No matching opening bracket
    const nodeLabelOpen = this.stack.pop();
    if (nodeLabelClose.next === null) return null; // No link destination
    const nodeDestOpen = nodeLabelClose.next;
    if (nodeDestOpen.next === null) return null; // No link destination
    const nodeDest = nodeDestOpen.next;
    if (nodeDest.next === null) return null; // No closing parenthesis
    const nodeDestClose = nodeDest.next;
    
    if (nodeDestOpen.data.type !== "text") return null;
    if (nodeDestClose.data.type !== "text") return null;
    if (nodeDest.data.type !== "text") return null;
    
    if (nodeDestOpen.data.token.text !== "(") return null;
    if (nodeDestClose.data.token.text !== ")") return null;
    
    const pattern = /^\s*([^\s]+)\s*("([^"]*)")?\s*$/
    const match = nodeDest.data.token.text.match(pattern);
    if (!match) return null;
    
    const nodeLink = new Node(this.type);
    nodeLink.data.token = {
      text: "",
      start: nodeLabelOpen.data.token.start,
      end: nodeLabelOpen.data.token.start,
    };
    nodeLink.data.fields = {
      src: match[1],
      title: match[3] || "",
    };
    
    nodeLabelOpen.insertBefore(nodeLink);
    for (let curr = nodeLabelOpen.next; curr !== nodeDestClose.next; curr = curr.next) {
      nodeLink.appendChild(curr.prev);
    }
    nodeLink.appendChild(nodeDestClose);
    nodeLabelOpen.data.type = this.type + "-label-open";
    nodeLabelClose.data.type = this.type + "-label-close";
    nodeDestOpen.data.type = this.type + "-destination-open";
    nodeDestClose.data.type = this.type + "-destination-close";
    nodeDest.data.type = this.type + "-destination";
    return nodeLink;
  }
}
