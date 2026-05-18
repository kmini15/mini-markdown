import { Inline } from "../../../../core/inline.js";
import { Node } from "../../../../core/node.js";

export class ImageStyleRule extends Inline {
  constructor(type) {
    super(type);
    this.stack = [];
  }

  parse(node) {
    this.dfs(node, (child) => {
      this.split(child, /(!\[|\]|\(|\)|\{|\})/);
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
    // ![....](....){....}
    // |     |||   |||   |
    // |     |||   |||   +--- nodeStyleClose
    // |     |||   ||+------- nodeStyle
    // |     |||   |+-------- nodeStyleOpen
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
    if (nodeDestClose.next === null) return null; // No style content
    const nodeStyleOpen = nodeDestClose.next;
    if (nodeStyleOpen.next === null) return null; // No style content
    const nodeStyle = nodeStyleOpen.next;
    if (nodeStyle.next === null) return null; // No closing brace
    const nodeStyleClose = nodeStyle.next;
    
    if (nodeDestOpen.type !== "text") return null;
    if (nodeDestClose.type !== "text") return null;
    if (nodeDest.type !== "text") return null;
    if (nodeStyleOpen.type !== "text") return null;
    if (nodeStyleClose.type !== "text") return null;
    if (nodeStyle.type !== "text") return null;
    
    if (nodeDestOpen.content.text !== "(") return null;
    if (nodeDestClose.content.text !== ")") return null;
    if (nodeStyleOpen.content.text !== "{") return null;
    if (nodeStyleClose.content.text !== "}") return null;
    
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
      style: `{${nodeStyle.content.text.trim()}}`,
    };
    nodeLink.data.tokens.push({
      type: "marker",
      text: nodeLabelOpen.content.text,
      start: nodeLabelOpen.content.start,
      end: nodeLabelOpen.content.end,
    });
    for (let curr = nodeLabelOpen.next; curr !== nodeLabelClose;) {
      const next = curr.next;
      nodeLink.data.tokens.push({
        type: "keyword",
        text: curr.content.text,
        start: curr.content.start,
        end: curr.content.end,
      });
      nodeLink.appendChild(curr);
      curr = next;
    }
    nodeLink.data.tokens.push(
      {
        type: "marker",
        text: nodeLabelClose.content.text,
        start: nodeLabelClose.content.start,
        end: nodeLabelClose.content.end,
      },
      {
        type: "marker",
        text: nodeDestOpen.content.text,
        start: nodeDestOpen.content.start,
        end: nodeDestOpen.content.end,
      },
      {
        type: "keyword",
        text: nodeDest.content.text,
        start: nodeDest.content.start,
        end: nodeDest.content.end,
      },
      {
        type: "marker",
        text: nodeDestClose.content.text,
        start: nodeDestClose.content.start,
        end: nodeDestClose.content.end,
      },
      {
        type: "marker",
        text: nodeStyleOpen.content.text,
        start: nodeStyleOpen.content.start,
        end: nodeStyleOpen.content.end,
      },
      {
        type: "keyword",
        text: nodeStyle.content.text,
        start: nodeStyle.content.start,
        end: nodeStyle.content.end,
      },
      {
        type: "marker",
        text: nodeStyleClose.content.text,
        start: nodeStyleClose.content.start,
        end: nodeStyleClose.content.end,
      },
    );
    nodeLabelOpen.insertBefore(nodeLink);
    nodeLabelOpen.unlink();
    nodeLabelClose.unlink();
    nodeDestOpen.unlink();
    nodeDest.unlink();
    nodeDestClose.unlink();
    nodeStyleOpen.unlink();
    nodeStyle.unlink();
    nodeStyleClose.unlink();
    return nodeLink;
  }
}
