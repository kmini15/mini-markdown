import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

export class CodeBlockRule extends Block {
  constructor(type) {
    super(type);
    this.pattern = /^(\s{4})(.*)$/;
  }

  continue(context, node) {
    const input = context.input.current();
    const match = this.pattern.exec(input);
    if (!match) return false;
    const cursor0 = context.input.capture();
    context.input.consume(match[1].length); // marker
    const cursor1 = context.input.capture();
    context.input.consume(match[2].length); // content
    const cursor2 = context.input.capture();
    const text = new Node("literal");
    text.data.token = {
      text: match[2] + "\n",
      start: cursor1,
      end: cursor2,
    };
    node.appendChild(text);
    return true;
  }

  parse(context, parent) {
    if (parent.data.type === this.type) return null;
    const input = context.input.current();
    const match = this.pattern.exec(input);
    if (!match) return null;
    const cursor0 = context.input.capture();
    context.input.consume(match[1].length); // marker
    const cursor1 = context.input.capture();
    context.input.consume(match[2].length); // content
    const cursor2 = context.input.capture();    
    const child = new Node(this.type);
    child.data.token = {
      text: match[1],
      start: cursor0,
      end: cursor1,
    }
    const text = new Node("literal");
    text.data.token = {
      text: match[2] + "\n",
      start: cursor1,
      end: cursor2,
    };
    child.appendChild(text);
    return child;
  }
}