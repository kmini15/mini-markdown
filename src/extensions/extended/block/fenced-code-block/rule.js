import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

export class FencedCodeBlockRule extends Block {
  constructor(type) {
    super(type);
    this.pattern = /^(\s*)(```)(\w+)?(\s*)$/;
    this.patternIndent = /^(\s*)(.*)$/;
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
    context.input.consume(match[3] ? match[3].length : 0); // language
    const cursor3 = context.input.capture();
    context.input.consume(match[4].length); // trailing spaces
    const cursor4 = context.input.capture();
    context.input.advance();
    const child = new Node(this.type);
    child.data.token = {
      start: cursor1,
      end: cursor2,
    }
    child.data.fields = {
      language: match[3] || "",
    }
    let isClosed = false;
    while (!context.input.eof()) {
      const input = context.input.current();
      const match = this.patternIndent.exec(input);
      if (!match) break;
      if (match[1].length < child.data.token.start.col) {
        isClosed = false;
        break;
      }
      if (match[2].trim() === "```") {
        context.input.advance();
        isClosed = true;
        break;
      }
      context.input.consume(child.data.token.start.idx);
      const line = context.input.current();
      context.input.advance();
      const text = new Node("text");
      text.data.text = line;
      text.data.token = {
        start: cursor1,
        end: cursor2,
      };
      child.appendChild(text);
    }
    if (!isClosed) {
      context.input.restore(cursor0);
      return null;
    }
    return child;
  }
}
