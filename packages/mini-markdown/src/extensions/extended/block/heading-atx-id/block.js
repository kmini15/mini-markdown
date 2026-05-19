import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

export class HeadingAtxIdRule extends Block {
  constructor(type) {
    super(type);
    this.pattern = /^(\s*)(#{1,6}\s)(.*?)(\s*)(\{)(#)(.*)(\})(\s*)$/;
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
    context.input.consume(match[5].length); // open brace
    const cursor5 = context.input.capture();
    context.input.consume(match[6].length); // hash
    const cursor6 = context.input.capture();
    context.input.consume(match[7].length); // id
    const cursor7 = context.input.capture();
    context.input.consume(match[8].length); // close brace
    const cursor8 = context.input.capture();
    const child = new Node(this.type);
    child.content = {
      text: match[2],
      start: cursor1,
      end: cursor2,
    };
    child.data.fields = {
      level: match[2].trim().length,
      id: match[7],
    };
    child.data.tokens.push({
      type: "marker",
      text: match[2],
      start: cursor1,
      end: cursor2,
    });
    child.data.tokens.push({
      type: "content",
      text: match[3],
      start: cursor2,
      end: cursor3,
    });
    child.data.tokens.push({
      type: "marker",
      text: match[5],
      start: cursor4,
      end: cursor5, 
    });
    child.data.tokens.push({
      type: "param",
      text: match[6] + match[7],
      start: cursor5,
      end: cursor7,
    });
    child.data.tokens.push({
      type: "marker",
      text: match[8],
      start: cursor7,
      end: cursor8,
    });
    const text = new Node("text");
    text.content = {
      text: match[3],
      start: cursor2,
      end: cursor3,
    };
    child.appendChild(text);
    return child;
  }
}
