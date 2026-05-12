import Rule from "../../../rule.js";
import Node from "../../../../core/node.js";

class EmphasisRule extends Rule {
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
    this.parseMarkers(node);
    // this.mergeTextNode(node);
  }

  splitTextNode(node) {
    // Split text nodes by "*", to identify potential bold syntax
    for (let child = node.firstChild; child;) {
      const next = child.next;
      if (child.type === "text" && child.fields.inline) {
        const content = child.value;
        const chunks = content.split(/(\*+|\_+)/);
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

  parseMarkers(node) {
    const markerList = this.buildMarkerList(node);
    while (markerList.firstChild) {
      markerList.firstChild.close = false;
      markerList.lastChild.open = false;
      let on = markerList.firstChild;
      let cn = markerList.firstChild.next;
      let matched = false;
      while (on && cn) {
        // Check if the markers are in the same parent node.
        if (on.child.parent !== cn.child.parent) break;
        // Check if the open marker is actually an open marker.
        if (!on.open) break;
        // Check if the open and close markers can form a valid emphasis.
        const match = on.mark === cn.mark;
        const rule0 = on.open && on.close;
        const rule1 = cn.open && cn.close;
        const rule2 = (on.cnt_origin + cn.cnt_origin) % 3 === 0;
        const rule3 = on.cnt_origin % 3 !== 0;
        const rule4 = cn.cnt_origin % 3 !== 0;
        const ruleOf3 = (rule0 || rule1) && rule2 && (rule3 || rule4);
        if (!cn.close || !match || ruleOf3) {
          if (cn.open && match) {
            on = cn;
          }
          cn = cn.next;
          continue;
        }
        // convert the matched markers to BOLD or ITALIC nodes.
        if (on.cnt >= 2 && cn.cnt >= 2) {
          const emphasisNode = new Node("emphasis");
          emphasisNode.fields = {
            type: "bold"
          };
          for (let curr = on.child.next; curr !== cn.child;) {
            let temp = curr.next;
            emphasisNode.appendChild(curr);
            curr = temp;
          }
          on.cnt -= 2;
          cn.cnt -= 2;
          on.child.value = on.child.value.slice(0, -2);
          cn.child.value = cn.child.value.slice(0, -2);
          on.child.insertAfter(emphasisNode);
        } else if (on.cnt >= 1 && cn.cnt >= 1) {
          const emphasisNode = new Node("emphasis");
          emphasisNode.fields = {
            type: "italic"
          };
          for (let curr = on.child.next; curr !== cn.child;) {
            let temp = curr.next;
            emphasisNode.appendChild(curr);
            curr = temp;
          }
          on.cnt -= 1;
          cn.cnt -= 1;
          on.child.value = on.child.value.slice(0, -1);
          cn.child.value = cn.child.value.slice(0, -1);
          on.child.insertAfter(emphasisNode);
        }
        // remove the markers if their count drops to 0.
        if (on.cnt === 0) {
          on.child.unlink();
          on.unlink();
        }
        if (cn.cnt === 0) {
          cn.child.unlink();
          cn.unlink();
        }
        matched = true;
        break;
      }
      if (!matched) {
        on.unlink();
      }
    }
  }

  buildMarkerList(node) {
    const markerList = new Node("marker-list");
    for (let child = node.firstChild; child; child = child.next) {
      if (child.type !== "text" || !child.fields.inline) continue;
      /* Astarisk */
      if (/^\*+$/.test(child.value)) {
        const char_prev = !child.prev ? " " : (child.prev.value?.at(-1) ?? "");
        const char_next = !child.next ? " " : (child.next.value?.at(0) ?? "");
        const open = !/\s/.test(char_next);
        const close = !/\s/.test(char_prev);
        const node = new Node("marker");
        node.mark = "*";
        node.cnt = child.value.length;
        node.cnt_origin = child.value.length;
        node.open = open;
        node.close = close;
        node.child = child;
        markerList.appendChild(node);
      }
      /* Underscore */
      if (/^\_+$/.test(child.value)) {
        const char_prev = !child.prev ? " " : (child.prev.value?.at(-1) ?? "");
        const char_next = !child.next ? " " : (child.next.value?.at(0) ?? "");
        const open = !/\s/.test(char_next) && /\s|_|\*/.test(char_prev);
        const close = !/\s/.test(char_prev) && /\s|_|\*/.test(char_next);
        const node = new Node("marker");
        node.mark = "_";
        node.cnt = child.value.length;
        node.cnt_origin = child.value.length;
        node.open = open;
        node.close = close;
        node.child = child;
        markerList.appendChild(node);
      }
    }
    return markerList;
  }
}

export { EmphasisRule };