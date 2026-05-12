import Rule from "../../../rule.js";
import Node from "../../../../core/node.js";

class HorizontalRuleRule extends Rule {
  constructor(type) {
    super(type);
    this.pattern = /^\s*[-*_]{3,}\s*$/;
  }
  
  start(context, parent) {
    const line = context.input.current();
    const match = line.match(this.pattern);
    if (!match) {
      return false;
    }
    return true;
  }
  
  parse(context, parent) {
    const line = context.input.current();
    const match = line.match(this.pattern);
    if (!match) {
      return null;
    }
    const child = new Node(this.type);
    context.input.consume(line.length);
    return child;
  }
}

export { HorizontalRuleRule };