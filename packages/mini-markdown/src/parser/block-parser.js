import { Node } from "../core/node.js";
import { NodeStack } from "../core/node-stack.js";
import { TextContext } from "../core/text-context.js";

export class BlockParser {
  constructor(rules) {
    this.rules = rules;
    this.maxDepth = 40;
    this.DEBUG_MODE = false;
  }

  parse(text) {
    const context = {
      input: new TextContext(text + "\n"),
      stack: new NodeStack(),
      index: -1,
      lines: [],
    };
    while (!context.input.eof()) {
      context.index = -1;
      this.continueBlocks(context);
      this.closeLeafBlocks(context);
      if (this.startBlocks(context)) {
        this.flushBlocks(context);
        this.closeBlocks(context);
        this.parseBlocks(context);
      }
      if (context.input.current().trim() !== "") {
        const input = context.input.current();
        const match = /^(\s*)/.exec(input);
        const indent = match ? match[1].length : 0;
        context.input.consume(indent);
        const cursor0 = context.input.capture();
        const line = context.input.current();
        context.input.consume(line.length);
        const cursor1 = context.input.capture();
        const text = new Node("text");
        text.content = {
          text: line + "\n",
          start: cursor0,
          end: cursor1,
        };
        context.lines.push(text);
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
    if (!node) return null;
    return this.rules.find(rule => rule.type === node.type);
  }

  continueBlocks(context) {
    for (let index = context.index; index < context.stack.size(); index++) {
      const node = context.stack.at(index);
      if (!node) continue;
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
        parent?.appendChild(child);
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

  closeLeafBlocks(context) {
    while (context.stack.size() > context.index + 1) {
      const node = context.stack.top();
      if (node.lazy) break;
      const rule = this.getRule(node);
      if (!rule) break;
      const result = rule.close(context, node);
      if (result) {
        this.debugRule("close leaf", node.type, context);
        context.stack.pop();
      } else {
        break;
      }
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
        parent?.appendChild(node);
        context.stack.push(node);
        context.index++;
      } else {
        break;
      }
    }
  }

  debugRule(action, type, context) {
    if (this.DEBUG_MODE) {
      console.log(`${action} | ${type} | "${context.input.current()}"`);
    }
  }

  debugStack(context) {
    if (this.DEBUG_MODE) {
      console.log("stack", context.stack.stack.map(node => node.type).join(" > "));
    }
  }
}
