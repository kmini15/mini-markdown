import { Node, BlockRule, TextWidth } from "../block-rule.js";

class GridRule extends BlockRule {
  constructor() {
    super("GRID");
    this.pattern = /^((\s*):{4})\[([^\]:]+)(:[^\]:]+)?\](.*)$/;
    this.pattern_item = /^((\s*)(\[[:.' ]{2}\]))(.*)/;
    this.textWidth = new TextWidth();
  }

  match(node, reader, context) {
    const parsed = context.remains().match(this.pattern);
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
    const columns = parsed[3].trim();
    const gap = parsed[4] ? parsed[4].slice(1).trim() : 0;
    const child = new Node(this.type);
    child.fields = {
      markerColumn: markerColumn,
      contentColumn: contentColumn,
      columns: columns,
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
      return true; // new item starts, so current grid can carry
    } else {
      const indent = context.remains().match(/^(\s*)/)[1];
      const contentColumn = this.textWidth.measure(indent) + context.column;
      if (contentColumn < node.fields.contentColumn) return false;
      context.advance(node.fields.contentColumn - context.column);
      return true;
    }
  }
}

class GridItemRule extends BlockRule {
  constructor() {
    super("GRID_ITEM");
    this.pattern = /^((\s*)(\[[:.' ]{2}\]))(.*)/;
    // [  ]: default
    // [::]: middle center
    // [: ]: middle left
    // [ :]: middle right
    // ['']: top center
    // [' ]: top left
    // [ ']: top right
    // [..]: bottom center
    // [. ]: bottom left
    // [ .]: bottom right
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
    if (parent.type !== "GRID") return null;
    if (parent.type === this.type) return null;
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return null;
    const markerColumn = this.textWidth.measure(parsed[2]) + context.column;
    const contentColumn = this.textWidth.measure(parsed[1]) + context.column;
    let alignTextH, alignTextV, alignItemH, alignItemV;
    switch (parsed[3].slice(1, 3)) {
      case "::":
        alignTextH = "center";
        alignTextV = "middle";
        alignItemH = "center";
        alignItemV = "center";
        break;
      case ": ":
        alignTextH = "left";
        alignTextV = "middle";
        alignItemH = "start";
        alignItemV = "center";
        break;
      case " :":
        alignTextH = "right";
        alignTextV = "middle";
        alignItemH = "end";
        alignItemV = "center";
        break;
      case "''":
        alignTextH = "center";
        alignTextV = "top";
        alignItemH = "center";
        alignItemV = "start";
        break;
      case "' ":
        alignTextH = "left";
        alignTextV = "top";
        alignItemH = "start";
        alignItemV = "start";
        break;
      case " '":
        alignTextH = "right";
        alignTextV = "top";
        alignItemH = "end";
        alignItemV = "start";
        break;
      case "..":
        alignTextH = "center";
        alignTextV = "bottom";
        alignItemH = "center";
        alignItemV = "end";
        break;
      case ". ":
        alignTextH = "left";
        alignTextV = "bottom";
        alignItemH = "start";
        alignItemV = "end";
        break;
      case " .":
        alignTextH = "right";
        alignTextV = "bottom";
        alignItemH = "end";
        alignItemV = "end";
        break;
      default:
        alignTextH = "";
        alignTextV = "";
        alignItemH = "";
        alignItemV = "";
    }
    const child = new Node(this.type);
    child.fields = {
      markerColumn: markerColumn,
      contentColumn: contentColumn,
      alignTextH: alignTextH,
      alignTextV: alignTextV,
      alignItemH: alignItemH,
      alignItemV: alignItemV,
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

export { GridRule, GridItemRule };