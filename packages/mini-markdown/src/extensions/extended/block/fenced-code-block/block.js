import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

export class FencedCodeBlockRule extends Block {
  constructor(type) {
    super(type);
    this.pattern = /^(\s*)(```)(\w+)?(\s*)$/;
    this.patternIndent = /^(\s*)([\s\S]*)$/;
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
    child.content = {
      text: match[2],
      start: cursor1,
      end: cursor2,
    }
    child.data.fields = {
      language: match[3] || "",
    }
    child.data.tokens.push({
      type: "marker",
      start: cursor1,
      end: cursor2,
    });
    if (match[3]) {
      child.data.tokens.push({
        type: "param",
        start: cursor2,
        end: cursor3,
      });
    }
    let isClosed = false;
    while (!context.input.eof()) {
      const input = context.input.current();
      const match = this.patternIndent.exec(input);
      if (!match) break;
      if (match[1].length < child.content.start.col) {
        isClosed = false;
        break;
      }
      if (match[2].trim() === "```") {
        const cursor0 = context.input.capture();
        context.input.consume(match[1].length); // indent
        const cursor1 = context.input.capture();
        context.input.consume(match[2].length); // marker
        const cursor2 = context.input.capture();
        child.data.tokens.push({
          type: "marker",
          start: cursor1,
          end: cursor2,
        });
        isClosed = true;
        break;
      }
      const cursor0 = context.input.capture();
      context.input.consume(child.content.start.col); // indent
      const cursor1 = context.input.capture();
      const line = context.input.current();
      context.input.consume(line.length); // line
      const cursor2 = context.input.capture();
      context.input.advance();
      child.data.tokens.push({
        type: "code",
        start: cursor1,
        end: cursor2,
      });
      const text = new Node("literal");
      text.content = {
        text: line,
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
