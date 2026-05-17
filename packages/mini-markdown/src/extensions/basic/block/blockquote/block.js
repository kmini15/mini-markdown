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
    context.input.consume(match[1].length); // indent
    context.input.consume(match[2].length); // marker
    return true;
  }

  parse(context, parent) {
    const input = context.input.current();
    const match = this.pattern.exec(input);
    if (!match) return null;
    context.input.consume(match[1].length); // indent
    const cursor0 = context.input.capture();
    context.input.consume(match[2].length); // marker
    const cursor1 = context.input.capture();
    const child = new Node(this.type, true);
    child.data.token = {
      text: match[2],
      start: cursor0,
      end: cursor1,
    };
    return child;
  }
}
