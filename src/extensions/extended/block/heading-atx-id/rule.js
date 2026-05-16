import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

class HeadingAtxIdRule extends Block {
  constructor(type) {
    super(type);
    this.pattern = /^\s*(#{1,6})\s+(.*?)\s*\{#(.*)\}$/;
  }
  
  start(context, parent) {
    return this.pattern.test(context.input.current());
  }

  parse(context, parent) {
    const parsed = context.input.current().match(this.pattern);
    if (!parsed) return null;
    const text = new Node("text");
    text.value = parsed[2];
    text.fields = {
      inline: true,
    };
    const child = new Node(this.type);
    child.appendChild(text);
    child.fields = {
      level: parsed[1].length,
      id: parsed[3] || null,
    };
    context.input.consume(parsed[0].length);
    return child;
  }
}

export { HeadingAtxIdRule };