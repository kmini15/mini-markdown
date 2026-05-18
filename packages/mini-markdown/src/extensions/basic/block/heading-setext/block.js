import { Block } from '../../../../core/block.js';
import { Node } from '../../../../core/node.js';

export class HeadingSetextRule extends Block {
  constructor(type) {
    super(type);
    this.pattern = /^(\s*)([-=]+)(\s*)$/;
  }

  start(context, parent) {
    if (context.lines.length === 0) return false;
    const input = context.input.current();
    const match = this.pattern.exec(input);
    if (!match) return false;
    return true;
  }

  flush(context, parent) {
    if (context.lines.length === 0) return null;
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
    child.content = {
      text: match[2],
      start: cursor1,
      end: cursor2,
    };
    child.data.fields = {
      level: (match[2][0] === "=") ? 1 : 2,
    };
    child.data.tokens.push({
      type: "marker",
      text: match[2],
      start: cursor1,
      end: cursor2,
    });
    for (let line of context.lines) {
      child.appendChild(line);
    }
    context.lines = [];
    return child;
  }
}
