import Node from "../core/node.js";
import TextContext from "../core/text-context.js";
import NodeStack from "../core/node-stack.js";

class BlockParser {
  constructor(rules) {
    console.log(rules);
    this.rules = rules;
    this.maxDepth = 20;
    this.DEBUG_MODE = false;
  }

  parse(text) {
    const context = {
      input: new TextContext(text + "\n"),
      stack: new NodeStack(),
      index: 0,
      lines: [],
    };
    const node = new Node("document");
    node.fields = {
      indent: 0,
      column: 0,
    };
    context.stack.push(node);
    while (!context.input.eof()) {
      context.index = 0;
      this.continueBlocks(context);
      if (this.startBlocks(context)) {
        this.flushBlocks(context);
        this.closeBlocks(context);
        this.parseBlocks(context);
      }
      if (context.input.current().trim() !== "") {
        context.lines.push(context.input.current());
      }
      this.debugStack(context);
      context.input.advance();
    }
    context.index = 0;
    this.flushBlocks(context);
    this.closeBlocks(context);
    const documentNode = context.stack.top();
    return documentNode;
  }

  getRule(node) {
    return this.rules.find(rule => rule.type === node.type);
  }

  continueBlocks(context) {
    for (let index = context.index; index < context.stack.size(); index++) {
      const node = context.stack.at(index);
      const rule = this.getRule(node);
      if (!rule) break;
      const result = rule.continue(context, node);
      if (result) {
        this.debugRule("continue", node.type, context);
        context.index = index;
      } else {
        break;
      }
    }
  }

  flushBlocks(context) {
    const parent = context.stack.top();
    for (let rule of this.rules) {
      const child = rule.flush(context, parent);
      if (child) {
        this.debugRule("flush", child.type, context);
        parent.appendChild(child);
        break;
      }
    }
  }

  startBlocks(context) {
    const parent = context.stack.at(context.index);
    const rule = this.rules.find(rule => rule.start(context, parent));
    if (rule) {
      this.debugRule("start", rule.type, context);
      return true;
    } else {
      return false;
    }
  }

  closeBlocks(context) {
    while (context.stack.size() > context.index + 1) {
      const node = context.stack.pop();
      const rule = this.getRule(node);
      if (!rule) break;
      const result = rule.close(context, node);
      if (result) {
        this.debugRule("close", node.type, context);
        continue;
      } else {
        break;
      }
    }
  }

  parseBlocks(context) {
    for (let depth = 0; depth < this.maxDepth; depth++) {
      const parent = context.stack.top();
      const rule = this.rules.find(rule => rule.start(context, parent));
      if (!rule) break;
      const node = rule.parse(context, parent);
      if (node) {
        this.debugRule("parse", node.type, context);
        parent.appendChild(node);
        context.stack.push(node);
        context.index++;
      } else {
        break;
      }
    }
  }

  debugRule(action, type, context) {
    if (this.DEBUG_MODE) {
      console.log(action, type, context.input.current());
    }
  }
  
  debugStack(context) {
    if (this.DEBUG_MODE) {
      console.log("stack", context.stack.stack.map(node => node.type).join(" > "));
    }
  }
}

export default BlockParser;