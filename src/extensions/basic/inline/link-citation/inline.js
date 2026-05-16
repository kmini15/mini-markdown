import { Inline } from "../../../../core/inline.js";
import { Node } from "../../../../core/node.js";

export class LinkCitationRule extends Inline {
  constructor(type) {
    super(type);
    this.stack = [];
    this.references = {};
  }

  parse(node) {
    this.bfs(node, child => this.search(child));
    this.dfs(node, child => {
      this.split(child, /(\[|\])/);
      this.match(child);
      this.merge(child);
    });
  }
  
  search(node) {
    for (let child = node.firstChild; child; child = child.next) {
      if (child.data.type === "link-reference") {
        const label = child.data.fields.label.trim();
        this.references[label] = {
          href: child.data.fields.href,
          title: child.data.fields.title,
        };
      }
    }
  }

  match(node) {
    for (let child = node.firstChild; child; child = child.next) {
      if (child.data.type === "text") {
        if (child.data.token.text === "[") {
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
    // [....][....]
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

    if (nodeDestOpen.data.token.text !== "[") return null;
    if (nodeDestClose.data.token.text !== "]") return null;

    const label = nodeDest.data.token.text.trim();
    const reference = this.references[label];
    if (!reference) return null; // No matching reference

    const nodeLink = new Node(this.type);
    nodeLink.data.token = {
      text: "",
      start: nodeLabelOpen.data.token.start,
      end: nodeLabelOpen.data.token.start,
    };
    nodeLink.data.fields = {
      href: reference.href,
      title: reference.title || "",
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
