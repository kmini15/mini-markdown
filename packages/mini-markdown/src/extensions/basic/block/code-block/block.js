import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

export class CodeBlockRule extends Block {
  constructor(type) {
    super(type);
    this.pattern = /^(\s{4})([\s\S]*)$/;
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
    node.data.tokens.push({
      type: "marker",
      text: match[1],
      start: cursor0,
      end: cursor1,
    });
    node.data.tokens.push({
      type: "code",
      text: "",
      start: cursor1,
      end: cursor2,
    });
    const literal = new Node("literal");
    literal.content = {
      text: match[2],
      start: cursor1,
      end: cursor2,
    };
    node.appendChild(literal);
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
    child.content = {
      text: match[1],
      start: cursor0,
      end: cursor1,
    }
    child.data.tokens.push({
      type: "marker",
      text: match[1],
      start: cursor0,
      end: cursor1,
    });
    child.data.tokens.push({
      type: "code",
      text: "",
      start: cursor1,
      end: cursor2,
    });
    const literal = new Node("literal");
    literal.content = {
      text: match[2],
      start: cursor1,
      end: cursor2,
    };
    child.appendChild(literal);
    return child;
  }
}