import { Inline } from "../../../../core/inline.js";
import { Node } from "../../../../core/node.js";

export class EmphasisRule extends Inline {
  constructor(type) {
    super(type);
    this.stack = [];
  }

  parse(node) {
    this.stack = [];
    this.dfs(node, (child) => {
      this.split(child, /(\*+|\_+)/);
      this.match(child);
      this.merge(child);
    });
  }

  match(node) {
    const markerList = this.buildMarkerList(node);
    while (markerList.firstChild) {
      markerList.firstChild.data.fields.close = false;
      markerList.lastChild.data.fields.open = false;
      let on = markerList.firstChild;
      let cn = markerList.firstChild.next;
      let matched = false;
      while (on && cn) {
        // Check if the markers are in the same parent node.
        if (on.data.fields.refer.parent !== cn.data.fields.refer.parent) break;
        // Check if the open marker is actually an open marker.
        if (!on.data.fields.open) break;
        // Check if the open and close markers can form a valid emphasis.
        const match = on.data.fields.mark === cn.data.fields.mark;
        if (!cn.data.fields.close || !match || this.isRuleOf3(on, cn)) {
          if (cn.data.fields.open && match) {
            on = cn;
          }
          cn = cn.next;
          continue;
        }
        // convert the matched markers to BOLD or ITALIC nodes.
        if (on.data.fields.refer.data.token.text.length >= 2 &&
          cn.data.fields.refer.data.token.text.length >= 2) {
          this.buildBold(on, cn);
        } else if (on.data.fields.refer.data.token.text.length >= 1 &&
          cn.data.fields.refer.data.token.text.length >= 1) {
          this.buildItalic(on, cn);
        }
        // remove the markers if their count drops to 0.
        if (on.data.fields.refer.data.token.text.length === 0) {
          on.data.fields.refer.unlink();
          on.unlink();
        }
        if (cn.data.fields.refer.data.token.text.length === 0) {
          cn.data.fields.refer.unlink();
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

  isRuleOf3(on, cn) {
    const rule0 = on.data.fields.open && on.data.fields.close;
    const rule1 = cn.data.fields.open && cn.data.fields.close;
    const rule2 = (on.data.fields.count + cn.data.fields.count) % 3 === 0;
    const rule3 = on.data.fields.count % 3 !== 0;
    const rule4 = cn.data.fields.count % 3 !== 0;
    return (rule0 || rule1) && rule2 && (rule3 || rule4);
  }

  buildBold(openMarker, closeMarker) {
    const onNode = this.splitMarkerOpen(openMarker, 2);
    const cnNode = this.splitMarkerClose(closeMarker, 2);
    onNode.data.type = this.type + "-open";
    cnNode.data.type = this.type + "-close";
    const emphasisNode = new Node(this.type);
    emphasisNode.data.token = {
      text: "",
      start: onNode.data.token.start,
      end: onNode.data.token.start,
    };
    emphasisNode.data.fields = {
      type: "bold"
    };
    for (let curr = onNode.next; curr !== cnNode;) {
      let temp = curr.next;
      emphasisNode.appendChild(curr);
      curr = temp;
    }
    emphasisNode.prependChild(onNode);
    emphasisNode.appendChild(cnNode);
    openMarker.data.fields.refer.insertAfter(emphasisNode);
  }

  buildItalic(openMarker, closeMarker) {
    const onNode = this.splitMarkerOpen(openMarker, 1);
    const cnNode = this.splitMarkerClose(closeMarker, 1);
    onNode.data.type = this.type + "-open";
    cnNode.data.type = this.type + "-close";
    const emphasisNode = new Node(this.type);
    emphasisNode.data.token = {
      text: "",
      start: onNode.data.token.start,
      end: onNode.data.token.start,
    };
    emphasisNode.data.fields = {
      type: "italic"
    };
    for (let curr = onNode.next; curr !== cnNode;) {
      let temp = curr.next;
      emphasisNode.appendChild(curr);
      curr = temp;
    }
    emphasisNode.prependChild(onNode);
    emphasisNode.appendChild(cnNode);
    openMarker.data.fields.refer.insertAfter(emphasisNode);
  }

  buildMarkerList(node) {
    const markerList = new Node("marker-list");
    for (let child = node.firstChild; child; child = child.next) {
      const markerAstarisk = this.buildMarkerAstarisk(child);
      if (markerAstarisk) {
        markerList.appendChild(markerAstarisk);
        continue;
      }
      const markerUnderscore = this.buildMarkerUnderscore(child);
      if (markerUnderscore) {
        markerList.appendChild(markerUnderscore);
        continue;
      }
    }
    return markerList;
  }

  buildMarkerAstarisk(node) {
    if (node.data.type !== "text") return null;
    if (!/^\*+$/.test(node.data.token.text)) return null;
    const char_prev = !node.prev ? " " : (node.prev.data.token.text?.at(-1) ?? "");
    const char_next = !node.next ? " " : (node.next.data.token.text?.at(0) ?? "");
    const open = !/\s/.test(char_next);
    const close = !/\s/.test(char_prev);
    const marker = new Node("marker");
    marker.data.token = {
      text: node.data.token.text,
      start: node.data.token.start,
      end: node.data.token.end,
    }
    marker.data.fields = {
      mark: "*",
      count: node.data.token.text.length,
      open: open,
      close: close,
      refer: node,
    };
    return marker;
  }

  buildMarkerUnderscore(node) {
    if (node.data.type !== "text") return null;
    if (!/^\_+$/.test(node.data.token.text)) return null;
    const char_prev = !node.prev ? " " : (node.prev.data.token.text?.at(-1) ?? "");
    const char_next = !node.next ? " " : (node.next.data.token.text?.at(0) ?? "");
    const open = !/\s/.test(char_next) && /\s|_|\*/.test(char_prev);
    const close = !/\s/.test(char_prev) && /\s|_|\*/.test(char_next);
    const marker = new Node("marker");
    marker.data.token = {
      text: node.data.token.text,
      start: node.data.token.start,
      end: node.data.token.end,
    }
    marker.data.fields = {
      mark: "_",
      count: node.data.token.text.length,
      open: open,
      close: close,
      refer: node,
    };
    return marker;
  }

  splitMarkerOpen(marker, num) {
    const refer = marker.data.fields.refer;
    const count = marker.data.fields.refer.data.token.text.length;
    const [start, end] = this.splitText(refer, count - num);
    refer.insertBefore(start);
    refer.insertAfter(end);
    refer.unlink();
    marker.data.fields.refer = start;
    return end;
  }

  splitMarkerClose(marker, num) {
    const refer = marker.data.fields.refer;
    const count = marker.data.fields.refer.data.token.text.length;
    const [start, end] = this.splitText(refer, num);
    refer.insertBefore(start);
    refer.insertAfter(end);
    refer.unlink();
    marker.data.fields.refer = end;
    return start;
  }

  splitText(node, idx) {
    const start = new Node("text");
    start.data.token = {
      text: node.data.token.text.slice(0, idx),
      start: node.data.token.start,
      end: {
        row: node.data.token.start.row,
        col: node.data.token.start.col + idx,
        idx: node.data.token.start.idx + idx,
      }
    };
    start.data.fields = { ...node.data.fields };
    const end = new Node("text");
    end.data.token = {
      text: node.data.token.text.slice(idx),
      start: {
        row: node.data.token.start.row,
        col: node.data.token.start.col + idx,
        idx: node.data.token.start.idx + idx,
      },
      end: node.data.token.end,
    };
    end.data.fields = { ...node.data.fields };
    return [start, end];
  }
}
