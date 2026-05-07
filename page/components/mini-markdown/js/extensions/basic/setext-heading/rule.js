import Rule from '../../rule.js';
import Node from '../../../core/node.js';

class SetextHeadingRule extends Rule {
  constructor(type) {
    super(type);
    this.pattern = /^(\s*)([-=]+)(\s*)$/;
  }

  start(context, parent) {
    if (context.lines.length === 0) {
      return false;
    }
    const parsed = context.input.current().match(this.pattern);
    if (!parsed) {
      return false;
    }
    return true;
  }

  flush(context, parent) {
    if (context.lines.length === 0) {
      return null;
    }
    const parsed = context.input.current().match(this.pattern);
    if (!parsed) {
      return null;
    }
    const text = new Node("text");
    text.value = context.lines.join("\n");
    const child = new Node(this.type);
    child.fields = {
      level: (parsed[2][0] === "=") ? 1 : 2,
    };
    child.appendChild(text);
    context.input.consume(context.input.current().length);
    context.lines = [];
    return child;
  }

  parse(context, parent) {
    return null;
  }
}

export { SetextHeadingRule };