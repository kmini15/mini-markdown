import { Node, BlockRule, TextWidth } from "../block-rule.js";

class JustifiedRow extends BlockRule {
  constructor() {
    super("JUSTIFIED_ROW");
    this.pattern = /^((\s*)====)\[([^\]:]+)(:[^\]:]+)?\](.*)$/;
    this.pattern_item = /^((\s*)(\[[:.' ]{2}\]))(.*)/;
    this.textWidth = new TextWidth();
  }

  match(node, reader, context) {
    const parsed = context.remains().match(this.pattern_item);
    if (!parsed) return false;
    const markerColumn = this.textWidth.measure(parsed[2]) + context.column;
    if (markerColumn < node.fields.markerColumn) return false;
    context.advance(node.fields.markerColumn - context.column); // until marker
    return true;
  }

  start(parent, reader, context) {
    if (parent.type === this.type) return null;
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return null;
    const markerColumn = this.textWidth.measure(parsed[2]) + context.column;
    const contentColumn = this.textWidth.measure(parsed[1]) + context.column;
    const width = parsed[3].trim();
    const gap = parsed[4] ? parsed[4].slice(1).trim() : 0;
    const child = new Node(this.type);
    child.fields = {
      markerColumn: markerColumn,
      contentColumn: contentColumn,
      width: width,
      gap: gap,
    };
    context.advance(context.remains().length);
    return child;
  }

  carry(node, reader, context) {
    const parsed = context.remains().match(this.pattern_item);
    if (parsed) {
      const markerColumn = this.textWidth.measure(parsed[2]) + context.column;
      if (markerColumn < node.fields.markerColumn) return false;
      return true; // new item starts, so current justified row can carry
    } else {
      const indent = context.remains().match(/^(\s*)/)[1];
      const contentColumn = this.textWidth.measure(indent) + context.column;
      if (contentColumn < node.fields.contentColumn) return false;
      context.advance(node.fields.contentColumn - context.column);
      return true;
    }
  }
}

class JustifiedRowItem extends BlockRule {
  constructor() {
    super("JUSTIFIED_ROW_ITEM");
    this.pattern = /^((\s*)(\[[:.' ]{2}\]))(.*)/;
    this.textWidth = new TextWidth();
  }

  match(node, reader, context) {
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return false;
    const markerColumn = this.textWidth.measure(parsed[2]) + context.column;
    if (markerColumn < node.fields.contentColumn) return false;
    context.advance(node.fields.contentColumn - context.column);
    return true;
  }

  start(parent, reader, context) {
    if (parent.type !== "JUSTIFIED_ROW") return null;
    if (parent.type === this.type) return null;
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return null;
    const markerColumn = this.textWidth.measure(parsed[2]) + context.column;
    const contentColumn = this.textWidth.measure(parsed[1]) + context.column;
    const child = new Node(this.type);
    child.fields = {
      markerColumn: markerColumn,
      contentColumn: contentColumn,
    };
    context.advance(parsed[1].length);
    return child;
  }

  carry(node, reader, context) {
    const indent = context.remains().match(/^(\s*)/)[1];
    const contentColumn = this.textWidth.measure(indent) + context.column;
    if (contentColumn < node.fields.contentColumn) return false;
    context.advance(node.fields.contentColumn - context.column);
    return true;
  }    
}

export { JustifiedRow, JustifiedRowItem };