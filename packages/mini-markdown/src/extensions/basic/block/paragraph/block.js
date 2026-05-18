import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

export class ParagraphRule extends Block {
  constructor(type) {
    super(type);
  }

  start(context, parent) {
    /* If the current line is blank, it will flush the current paragraph. */
    return context.input.current().trim() === "";
  }

  flush(context, parent) {
    if (context.lines.length === 0) {
      return null;
    }
    const firstLine = context.lines[0];
    const child = new Node(this.type);
    child.content = {
      text: "",
      start: firstLine.content.start,
      end: firstLine.content.start,
    };
    for (let line of context.lines) {
      child.appendChild(line);
    }
    context.lines = [];
    return child;
  }
}
