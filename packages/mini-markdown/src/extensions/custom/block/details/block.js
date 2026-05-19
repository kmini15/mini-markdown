import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";
import { TextRuler } from "../../../../core/text-ruler.js";

export class DetailsRule extends Block {
  constructor(type) {
    super(type);
    // this.pattern = /^(((\s*)(<\.\.>|<\'\'>))\[([^\]]+)\]\s*)$/;
    this.pattern = /^(\s*)(<\.\.>|<\'\'>)(\[)([^\]]+)(\])(\s*)$/;
    this.patternIndent = /^(\s*)/;
  }

  continue(context, node) {
    const input = context.input.current();
    const refer = node.content.end.col;
    const match = this.patternIndent.exec(input);
    if (!match) return false;
    const cursor0 = context.input.capture();
    context.input.consume(match[1].length);
    const cursor1 = context.input.capture();
    context.input.restore(cursor0);
    const state = cursor1.col;
    if (state < refer) {
      return false;
    }
    context.input.consume(refer - cursor0.col);
    return true;
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
    context.input.consume(match[3].length); // open bracket
    const cursor3 = context.input.capture();
    context.input.consume(match[4].length); // summary
    const cursor4 = context.input.capture();
    context.input.consume(match[5].length); // close bracket
    const cursor5 = context.input.capture();
    context.input.consume(match[6].length); // trailing spaces
    const cursor6 = context.input.capture();
    const child = new Node(this.type);
    child.content = {
      text: match[2],
      start: cursor1,
      end: cursor2,
    };
    child.data.fields = {
      open: match[2] === "<\'\'>",
    };
    child.data.tokens.push({
      type: "marker",
      start: cursor1,
      end: cursor2,
    });
    child.data.tokens.push({
      type: "marker",
      start: cursor2,
      end: cursor3,
    });
    child.data.tokens.push({
      type: "content",
      start: cursor3,
      end: cursor4,
    });
    child.data.tokens.push({
      type: "marker",
      start: cursor4,
      end: cursor5,
    });
    const summary = new Node(this.type + "-summary");
    summary.content = {
      text: "",
      start: cursor3,
      end: cursor3,
    };
    const text = new Node("text");
    text.content = {
      text: match[4],
      start: cursor3,
      end: cursor4,
    };
    summary.appendChild(text);
    child.appendChild(summary);
    return child;
  }
}
