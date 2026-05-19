import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

export class BlockquoteRule extends Block {
  constructor(type) {
    super(type);
    this.pattern = /^(\s*)(>\s?)/;
  }

  continue(context, node) {
    const input = context.input.current();
    const match = this.pattern.exec(input);
    if (!match) return false;
    const cursor0 = context.input.capture();
    context.input.consume(match[1].length); // indent
    const cursor1 = context.input.capture();
    context.input.consume(match[2].length); // marker
    const cursor2 = context.input.capture();
    node.data.tokens.push({
      type: "marker",
      text: match[2],
      start: cursor1,
      end: cursor2,
    });
    return true;
  }

  parse(context, parent) {
    const input = context.input.current();
    const match = this.pattern.exec(input);
    if (!match) return null;
    const cursor0 = context.input.capture();
    context.input.consume(match[1].length); // indent
    const cursor1 = context.input.capture();
    context.input.consume(match[2].length); // marker
    const cursor2 = context.input.capture();
    const child = new Node(this.type, true);
    child.content = {
      text: match[2],
      start: cursor1,
      end: cursor2,
    };
    child.data.tokens.push({
      type: "marker",
      text: match[2],
      start: cursor1,
      end: cursor2,
    });
    return child;
  }
}
