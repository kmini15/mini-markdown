import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

class HorizontalRuleRule extends Block {
  constructor(type) {
    super(type);
    this.pattern = /^(\s*)([-*_]{3,})(\s*)$/;
  }

  parse(context, parent) {
    const input = context.input.current();
    const match = this.pattern.exec(input);
    if (!match) return null;
    const cursor0 = context.input.capture();
    context.input.consume(match[1].length);
    const cursor1 = context.input.capture();
    context.input.consume(match[2].length);
    const cursor2 = context.input.capture();
    context.input.consume(match[3].length);
    const cursor3 = context.input.capture();
    const child = new Node(this.type);
    child.data.token = {
      text: match[2],
      start: cursor1,
      end: cursor2,
    }
    return child;
  }
}

export { HorizontalRuleRule };