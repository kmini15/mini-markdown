import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

export class GridRule extends Block {
  constructor(type) {
    super(type);
    this.pattern = /^(\s*)(::::)((\[)([^\]]+)(:[^\]]+)(:[^\]]+)(\])({.*?})?)(\s*)$/;
    this.patternItem = /^(\s*)((\[)([:.' ]{2})(\])({.*?})?)/;
    this.patternIndent = /^(\s*)/;
  }

  continue(context, node) {
    const input = context.input.current();
    const refer = this.patternItem.test(input)
      ? node.data.token.start.col
      : node.data.token.end.col;
    const match = this.patternIndent.exec(input);
    if (!match) return false;
    const cursor0 = context.input.capture();
    context.input.consume(match[1].length);
    const cursor1 = context.input.capture();
    context.input.restore(cursor0);
    const state = cursor1.col;
    if (state < refer) {
      return false;
    }
    context.input.consume(refer - cursor0.col);
    return true;
  }

  parse(context, parent) {
    if (parent.data.type === this.type) return null;
    const input = context.input.current();
    const match = this.pattern.exec(input);
    if (!match) return null;
    const cursor0 = context.input.capture();
    context.input.consume(match[1].length); // indent
    const cursor1 = context.input.capture();
    context.input.consume(match[2].length); // marker
    const cursor2 = context.input.capture();
    context.input.consume(match[4].length); // opening bracket
    const cursor3 = context.input.capture();
    context.input.consume(match[5].length); // width
    const cursor4 = context.input.capture();
    context.input.consume(match[6].length); // gap
    const cursor5 = context.input.capture();
    context.input.consume(match[7].length); // columns
    const cursor6 = context.input.capture();
    context.input.consume(match[8].length); // closing bracket
    const cursor7 = context.input.capture();
    context.input.consume(match[9]?.length || 0); // style
    const cursor8 = context.input.capture();
    context.input.consume(match[10].length); // trailing spaces
    const cursor9 = context.input.capture();
    const child = new Node(this.type);
    child.data.token = {
      text: match[2],
      start: cursor1,
      end: cursor2,
    };
    child.data.fields = {
      width: match[5].trim(),
      gap: match[6].trim().slice(1), // remove leading colon
      columns: match[7].trim().slice(1), // remove leading colon
      style: match[9] || "{}",
    };
    const args = new Node(this.type + "-args");
    args.data.token = {
      text: match[3],
      start: cursor2,
      end: cursor7,
    };
    child.appendChild(args);
    context.input.consume(match[0].length);
    return child;
  }
}

export class GridItemRule extends Block {
  constructor(type) {
    super(type);
    // this.pattern_item = /^(((\s*)(\[[:.' ]{2}\]))({.*?})?)(.*)$/;
    this.pattern = /^(\s*)(\[[:.' ]{2}\])({.*?})?/;
    this.patternIndent = /^(\s*)/;
  }

  continue(context, node) {
    const input = context.input.current();
    const refer = node.data.token.end.col; // end
    const match = this.patternIndent.exec(input);
    if (!match) return false;
    const cursor0 = context.input.capture();
    context.input.consume(match[1].length);
    const cursor1 = context.input.capture();
    context.input.restore(cursor0);
    const state = cursor1.col;
    if (state < refer) {
      return false;
    }
    context.input.consume(refer - cursor0.col);
    return true;
  }

  parse(context, parent) {
    if (parent.data.type !== "grid") return null;
    if (parent.data.type === this.type) return null;
    const input = context.input.current();
    const match = this.pattern.exec(input);
    if (!match) return null;
    const cursor0 = context.input.capture();
    context.input.consume(match[1].length); // indent
    const cursor1 = context.input.capture();
    context.input.consume(match[2].length); // marker
    const cursor2 = context.input.capture();
    context.input.consume(match[3]?.length || 0); // style
    const cursor3 = context.input.capture();
    const child = new Node(this.type, true);
    child.data.token = {
      text: match[2],
      start: cursor1,
      end: cursor2,
    };
    child.data.fields = {
      align: match[2],
      style: match[3] || "{}",
    };
    const args = new Node(this.type + "-args");
    args.data.token = {
      text: match[3] || "",
      start: cursor2,
      end: cursor3,
    };
    child.appendChild(args);
    return child;
  }
}
