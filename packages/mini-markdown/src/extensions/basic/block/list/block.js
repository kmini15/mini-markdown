import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

export class ListRule extends Block {
  constructor(type) {
    super(type);
    this.pattern = /^(\s*)([-+*]\s|\d+\.\s)/;
    this.patternItem = /^(\s*)([-+*]\s|\d+\.\s)/;
    this.patternIndent = /^(\s*)/;
    this.patternOrdered = /^\d+\.\s/;
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
    context.input.consume(match[1].length); // indent
    const cursor0 = context.input.capture();
    context.input.consume(match[2].length); // marker
    const cursor1 = context.input.capture();
    context.input.restore(cursor0);
    const child = new Node(this.type);
    child.content = {
      text: match[2],
      start: cursor0,
      end: cursor1,
    }
    child.data.fields = {
      ordered: this.patternOrdered.test(match[2]),
    }
    child.data.tokens.push({
      type: "marker",
      start: cursor0,
      end: cursor1,
    });
    return child;
  }
}

export class ListItemRule extends Block {
  constructor(type) {
    super(type);
    this.patternItem = /^(\s*)([-+*]\s|\d+\.\s)/;
    this.patternIndent = /^(\s*)/;
  }

  continue(context, node) {
    const input = context.input.current();
    const refer = node.content.end.col; // End
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
    const match = this.patternItem.exec(input);
    if (!match) return null;
    context.input.consume(match[1].length); // indent
    const cursor0 = context.input.capture();
    context.input.consume(match[2].length); // marker
    const cursor1 = context.input.capture();
    const child = new Node(this.type, true);
    child.content = {
      text: match[2],
      start: cursor0,
      end: cursor1,
    }
    child.data.tokens.push({
      type: "marker",
      start: cursor0,
      end: cursor1,
    });
    return child;
  }
}