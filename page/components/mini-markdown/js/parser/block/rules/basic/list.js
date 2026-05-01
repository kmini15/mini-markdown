import { Node, BlockRule, TextWidth } from "../block-rule.js";

class ListRule extends BlockRule {
  constructor() {
    super("LIST");
    this.pattern = /^((\s*)([-+*]|\d+[.)])\s)(\s*.*)/;
    this.textWidth = new TextWidth();
  }

  match(node, reader, context) {
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return false;
    const markerColumn = this.textWidth.measure(parsed[2]) + context.column;
    if (markerColumn < node.fields.markerColumn) return false;
    context.advance(parsed[2].length); // until marker
    return true;
  }

  start(parent, reader, context) {
    if (parent.type === this.type) return null;
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return null;
    const markerColumn = this.textWidth.measure(parsed[2]) + context.column;
    const contentColumn = this.textWidth.measure(parsed[1]) + context.column;
    context.advance(parsed[2].length); // until marker
    const child = new Node(this.type);
    child.fields = {
      markerColumn: markerColumn,
      contentColumn: contentColumn,
      ordered: /^\d+[.)]$/.test(parsed[3]),
    };
    return child;
  }

  carry(node, reader, context) {
    const parsed = context.remains().match(/^(\s*)/);
    if (!parsed) return false;
    const indentColumn = this.textWidth.measure(parsed[1]) + context.column;
    if (indentColumn < node.fields.contentColumn) return false;
    return true;
  }
}

class ListItemRule extends BlockRule {
  constructor() {
    super("LIST_ITEM");
    this.pattern = /^((\s*)([-+*]|\d+[.)])\s)(\s*.*)/;
    this.textWidth = new TextWidth();
  }

  match(node, reader, context) {
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return false;
    const markerColumn = this.textWidth.measure(parsed[2]) + context.column;
    if (markerColumn < node.fields.contentColumn) return false;
    context.advance(parsed[2].length); // until marker
    return true;
  }

  start(parent, reader, context) {
    if (parent.type !== "LIST") return null;
    if (parent.type === this.type) return null;
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return null;
    const markerColumn = this.textWidth.measure(parsed[2]) + context.column;
    const contentColumn = this.textWidth.measure(parsed[1]) + context.column;
    context.advance(parsed[1].length); // until content
    const child = new Node(this.type);
    child.fields = {
      markerColumn: markerColumn,
      contentColumn: contentColumn
    };
    return child;
  }

  carry(node, reader, context) {
    const parsed = context.remains().match(/^(\s*)/);
    if (!parsed) return false;
    const contentColumn = this.textWidth.measure(parsed[1]) + context.column;
    if (contentColumn < node.fields.contentColumn) return false;
    context.advance(node.fields.contentColumn - context.column);
    return true;
  }
}

export { ListRule, ListItemRule };