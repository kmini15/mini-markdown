import Rule from "../../../rule.js";
import Node from "../../../../core/node.js";

class ParagraphRule extends Rule {
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
    const text = new Node("text");
    text.value = context.lines.join("\n");
    text.fields = {
      inline: true,
    };
    const child = new Node(this.type);
    child.appendChild(text);
    context.lines = [];
    return child;
  }
}

export { ParagraphRule };