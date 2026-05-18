import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

export class GridRule extends Block {
  constructor(type) {
    super(type);
    this.pattern = /^(\s*)(::::)(\[)([^\]]+)(:)([^\]]+)(:)([^\]]+)(\])({.*?})?(\s*)$/;
    this.patternItem = /^(\s*)(\[[:.' ]{2}\])({.*?})?/;
    this.patternIndent = /^(\s*)/;
  }

  continue(context, node) {
    const input = context.input.current();
    const refer = this.patternItem.test(input)
      ? node.content.start.col
      : node.content.end.col;
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
    if (parent.type === this.type) return null;
    const input = context.input.current();
    const match = this.pattern.exec(input);
    if (!match) return null;
    const cursor0 = context.input.capture();
    context.input.consume(match[1].length); // indent
    const cursor1 = context.input.capture();
    context.input.consume(match[2].length); // marker
    const cursor2 = context.input.capture();
    context.input.consume(match[3].length); // opening bracket
    const cursor3 = context.input.capture();
    context.input.consume(match[4].length); // width
    const cursor4 = context.input.capture();
    context.input.consume(match[5].length); // colon
    const cursor5 = context.input.capture();
    context.input.consume(match[6].length); // gap
    const cursor6 = context.input.capture();
    context.input.consume(match[7].length); // colon
    const cursor7 = context.input.capture();
    context.input.consume(match[8].length); // columns
    const cursor8 = context.input.capture();
    context.input.consume(match[9]?.length || 0); // closing bracket
    const cursor9 = context.input.capture();
    context.input.consume(match[10]?.length || 0); // style
    const cursor10 = context.input.capture();
    context.input.consume(match[11].length); // trailing spaces
    const cursor11 = context.input.capture();
    const child = new Node(this.type);
    child.content = {
      text: match[2],
      start: cursor1,
      end: cursor2,
    };
    child.data.fields = {
      width: match[4].trim(),
      gap: match[6].trim(), // remove leading colon
      columns: match[8].trim(), // remove leading colon
      style: match[10] || "{}",
    };
    child.data.tokens.push({
      type: "marker",
      text: match[3],
      start: cursor1,
      end: cursor2,
    },
    {
      type: "keyword",
      text: match[4],
      start: cursor3,
      end: cursor4,
    },
    {
      type: "marker",
      text: match[5],
      start: cursor4,
      end: cursor5,
    },
    {
      type: "keyword",
      text: match[6],
      start: cursor5,
      end: cursor6,
    },
    {
      type: "marker",
      text: match[7],
      start: cursor6,
      end: cursor7,
    },
    {
      type: "keyword",
      text: match[8],
      start: cursor7,
      end: cursor8,
    });
    if (match[9]) {
      child.data.tokens.push({
        type: "marker",
        text: match[9],
        start: cursor8,
        end: cursor9,
      });
    }
    return child;
  }
}

export class GridItemRule extends Block {
  constructor(type) {
    super(type);
    this.patternItem = /^(\s*)(\[[:.' ]{2}\])({.*?})?/;
    this.patternIndent = /^(\s*)/;
  }

  continue(context, node) {
    const input = context.input.current();
    const refer = node.content.end.col; // end
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
    if (parent.type !== "grid") return null;
    if (parent.type === this.type) return null;
    const input = context.input.current();
    const match = this.patternItem.exec(input);
    if (!match) return null;
    const cursor0 = context.input.capture();
    context.input.consume(match[1].length); // indent
    const cursor1 = context.input.capture();
    context.input.consume(match[2].length); // marker
    const cursor2 = context.input.capture();
    context.input.consume(match[3]?.length || 0); // style
    const cursor3 = context.input.capture();
    const child = new Node(this.type, true);
    child.content = {
      text: match[2],
      start: cursor1,
      end: cursor2,
    };
    child.data.fields = {
      align: match[2],
      style: match[3] || "{}",
    };
    child.data.tokens.push({
      type: "marker",
      text: match[2],
      start: cursor1,
      end: cursor2,
    });
    if (match[3]) {
      child.data.tokens.push({
        type: "marker",
        text: match[3],
        start: cursor2,
        end: cursor3,
      });
    }
    return child;
  }
}
