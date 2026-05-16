import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

export class HeadingAtxIdRule extends Block {
  constructor(type) {
    super(type);
    this.pattern = /^\s*(#{1,6})\s+(.*?)\s*\{#(.*)\}$/;
    this.pattern = /^(\s*)(#{1,6}\s)(.*?)(\s*)(\{#(.*)\})$/;
  }
  
  start(context, parent) {
    return this.pattern.test(context.input.current());
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
    context.input.consume(match[4].length); // space
    const cursor4 = context.input.capture();
    context.input.consume(match[5].length); // id
    const cursor5 = context.input.capture();
    const child = new Node(this.type);
    child.data.token = {
      text: match[2],
      start: cursor1,
      end: cursor2,
    };
    child.data.fields = {
      level: match[2].trim().length,
      id: match[6],
    };
    const args = new Node(this.type + "-args");
    args.data.token = {
      text: match[5],
      start: cursor4,
      end: cursor5,
    };
    child.appendChild(args);
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
