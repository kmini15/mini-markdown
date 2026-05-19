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
      if (child.type === "text") {
        if (child.content.text === "![") {
          const node = this.parseBracketL(child);
          if (node) child = node;
        } else if (child.content.text === "]") {
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
    // |     |||   |
    // |     |||   +--- nodeDestClose
    // |     ||+------- nodeDest
    // |     |+-------- nodeDestOpen
    // |     +--------- nodeLabelClose
    // +--------------- nodeLabelOpen
    if (this.stack.length === 0) return null; // No matching opening bracket
    const nodeLabelOpen = this.stack.pop();
    if (nodeLabelClose.next === null) return null; // No link destination
    const nodeDestOpen = nodeLabelClose.next;
    if (nodeDestOpen.next === null) return null; // No link destination
    const nodeDest = nodeDestOpen.next;
    if (nodeDest.next === null) return null; // No closing parenthesis
    const nodeDestClose = nodeDest.next;

    if (nodeDestOpen.type !== "text") return null;
    if (nodeDestClose.type !== "text") return null;
    if (nodeDest.type !== "text") return null;

    if (nodeDestOpen.content.text !== "(") return null;
    if (nodeDestClose.content.text !== ")") return null;

    const pattern = /^\s*([^\s]+)\s*("([^"]*)")?\s*$/
    const match = nodeDest.content.text.match(pattern);
    if (!match) return null;
    const nodeLink = new Node(this.type);
    nodeLink.content = {
      text: "",
      start: nodeLabelOpen.content.start,
      end: nodeLabelOpen.content.start,
    };
    nodeLink.data.fields = {
      src: match[1],
      title: match[3] || "",
    };
    nodeLink.data.tokens.push({
      type: "marker",
      start: nodeLabelOpen.content.start,
      end: nodeLabelOpen.content.end,
    });
    for (let curr = nodeLabelOpen.next; curr !== nodeLabelClose;) {
      const next = curr.next;
      nodeLink.data.tokens.push({
        type: "content",
        start: curr.content.start,
        end: curr.content.end,
      });
      nodeLink.appendChild(curr);
      curr = next;
    }
    nodeLink.data.tokens.push(
      {
        type: "marker",
        start: nodeLabelClose.content.start,
        end: nodeLabelClose.content.end,
      },
      {
        type: "marker",
        start: nodeDestOpen.content.start,
        end: nodeDestOpen.content.end,
      },
      {
        type: "param",
        start: nodeDest.content.start,
        end: nodeDest.content.end,
      },
      {
        type: "marker",
        start: nodeDestClose.content.start,
        end: nodeDestClose.content.end,
      });
    nodeLabelOpen.insertBefore(nodeLink);
    nodeLabelOpen.unlink();
    nodeLabelClose.unlink();
    nodeDestOpen.unlink();
    nodeDest.unlink();
    nodeDestClose.unlink();
    return nodeLink;
  }
}
