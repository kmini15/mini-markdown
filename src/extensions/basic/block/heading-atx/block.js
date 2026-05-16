import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

class HeadingAtxRule extends Block {
  constructor(type) {
    super(type);
    this.pattern = /^(\s*)(#{1,6}\s)(.*)$/;
  }

  parse(context, parent) {
    const input = context.input.current();
    const match = this.pattern.exec(input);
    if (!match) return null;
    const cursor0 = context.input.capture();
    context.input.consume(match[1].length); // indent
    const cursor1 = context.input.capture();
    context.input.consume(match[2].length); // marker
    const cursor2 = context.input.capture()
    context.input.consume(match[3].length); // text
    const cursor3 = context.input.capture();
    const child = new Node(this.type);
    child.data.token = {
      text: match[2],
      start: cursor1,
      end: cursor2,
    };
    child.data.fields = {
      level: match[2].trim().length,
    };
    const text = new Node("text");
    text.data.token = {
      text: match[3],
      start: cursor2,
      end: cursor3,
    };
    child.appendChild(text);
    return child;
  }
}

export { HeadingAtxRule };