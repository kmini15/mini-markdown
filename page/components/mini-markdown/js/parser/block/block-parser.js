import Node from "../../core/node.js";
import TextWidth from "../../core/text-width.js";
import LineReader from "../../core/line-reader.js";
import LineContext from "../../core/line-context.js";
import { DocumentRule } from "./rules/basic/document.js";
import { HtmlRule } from "./rules/basic/html.js";
import { LinkReferenceDefinitionRule } from "./rules/basic/link-reference-definition.js";
import { CodeBlockRule } from "./rules/basic/code-block.js";
import { FencedCodeBlockRule } from "./rules/extended/fenced-code-block.js";
import { BlockquoteRule } from "./rules/basic/blockquote.js";
import { ListRule, ListItemRule } from "./rules/basic/list.js";
import { HeadingRule } from "./rules/basic/heading.js";
import { SetextHeadingRule } from "./rules/basic/setext-heading.js";
import { HorizontalRuleRule } from "./rules/basic/horizontal-rule.js";
import { GridRule, GridItemRule } from "./rules/custom/grid.js";
import { TableRule } from "./rules/extended/table.js";
import { GridTableRule } from "./rules/custom/grid-table.js";
import { ScrollRule } from "./rules/custom/scroll.js";

const textWidth = new TextWidth();

class BlockParser {
  constructor() {
    this.rules = [
      new DocumentRule(),
      new LinkReferenceDefinitionRule(),
      new HtmlRule(),
      new CodeBlockRule(),
      new FencedCodeBlockRule(),
      new BlockquoteRule(),
      new ListRule(),
      new ListItemRule(),
      new HeadingRule(),
      new SetextHeadingRule(),
      new HorizontalRuleRule(),
      new TableRule(),
      new GridRule(),
      new GridItemRule(),
      new GridTableRule(),
      new ScrollRule(),
    ];
    this.maxDepth = 20;
    this.DEBUG_MODE = false;
  }

  parse(text) {
    const reader = new LineReader(text + "\n");
    const stack = [];
    const node = new Node("DOCUMENT");
    node.fields = {
      markerColumn: 0,
      contentColumn: 0,
    };
    stack.push(node);
    while (!reader.eof()) {
      const line = reader.current();
      const context = new LineContext(line);
      let stackIndex = 0;
      stackIndex = this.match(stack, stackIndex, reader, context);
      stackIndex = this.carry(stack, stackIndex, reader, context);
      stackIndex = this.apply(stack, stackIndex, reader, context);
      stackIndex = this.continue(stack, stackIndex, reader, context);
      stackIndex = this.close(stack, stackIndex, reader, context);
      stackIndex = this.start(stack, stackIndex, reader, context);
      stackIndex = this.fallback(stack, stackIndex, reader, context);
      reader.advance();
      if (this.DEBUG_MODE) console.log("stack", stack.map(node => node.type).join(" > "));
    }
    const documentNode = stack[0];
    const references = {};
    for (let child = documentNode.firstChild; child; child = child.next) {
      if (child.type === "LINK_REFERENCE_DEFINITION") {
        references[child.fields.label] = {
          destination: child.fields.destination,
          title: child.fields.title,
        };
      }
    }
    documentNode.fields.references = references;
    return documentNode;
  }

  getRule(node) {
    return this.rules.find(rule => rule.type === node.type);
  }

  match(stack, stackIndex, reader, context) {
    for (let i = 0; i < stack.length; i++) {
      const node = stack[i];
      const rule = this.getRule(node);
      if (!rule) break; // No rule for this node type
      if (rule.match(node, reader, context)) {
        if (this.DEBUG_MODE) console.log("match", node.type, context.remains());
        stackIndex = i;
      } else {
        break;
      }
    }
    return stackIndex;
  }

  carry(stack, stackIndex, reader, context) {
    for (let i = stackIndex + 1; i < stack.length; i++) {
      const node = stack[i];
      const rule = this.getRule(node);
      if (!rule) break; // No rule for this node type
      if (rule.carry(node, reader, context)) {
        if (this.DEBUG_MODE) console.log("carry", node.type, context.remains());
        stackIndex = i;
      } else {
        break;
      }
    }
    return stackIndex;
  }

  close(stack, stackIndex, reader, context) {
    while (stack.length > stackIndex + 1) {
      const node = stack.pop();
      if (this.DEBUG_MODE) console.log("close", node.type, context.remains());
      const rule = this.getRule(node);
      if (!rule) continue; // No rule for this node type
      rule.close(node, reader, context);
    }
    return stackIndex;
  }

  start(stack, stackIndex, reader, context) {
    for (let i = 0; i < this.maxDepth; i++) {
      const parent = stack[stack.length - 1];
      let started = false;
      for (let rule of this.rules) {
        const child = rule.start(parent, reader, context);
        if (!child) continue; // This rule does not start a new node
        if (this.DEBUG_MODE) console.log("start", child.type, context.remains());
        parent.appendChild(child);
        stack.push(child);
        started = true;
        break;
      }
      if (!started) break;
    }
    stackIndex = stack.length - 1;
    return stackIndex;
  }

  apply(stack, stackIndex, reader, context) {
    const lastNode = stack[stack.length - 1];
    if (lastNode.type !== "PARAGRAPH") return stackIndex;
    for (let rule of this.rules) {
      if (rule.apply(lastNode, reader, context)) {
        if (this.DEBUG_MODE) console.log("apply", lastNode.type, context.remains());
        break;
      }
    }
    return stackIndex;
  }

  continue(stack, stackIndex, reader, context) {
    const lastNode = stack[stack.length - 1];
    if (lastNode.type !== "PARAGRAPH") return stackIndex;
    if (context.remains().trim() === "") return stackIndex;
    const currNode = stack[stackIndex];
    for (let rule of this.rules) {
      reader.capture();
      context.capture();
      const newNode = rule.start(currNode, reader, context);
      context.restore();
      reader.restore();
      if (newNode) return stackIndex;
    }
    return stack.length - 1;
  }

  fallback(stack, stackIndex, reader, context) {
    if (context.remains().trim() === "") {
      if (stack[stackIndex].type !== "PARAGRAPH") {
        return stackIndex;
      }
      stack.pop();
      stackIndex = stack.length - 1;
      return stackIndex;
    }
    if (stack[stackIndex].type === "PARAGRAPH") {
      const textNode = stack[stackIndex].firstChild;
      textNode.value += "\n" + context.remains();
      context.advance(context.remains().length);
      return stackIndex;
    } else {
      const parent = stack[stackIndex];
      const textNode = new Node("TEXT");
      textNode.value = context.remains();
      textNode.fields = {
        inline: true,
      };
      const paragraphNode = new Node("PARAGRAPH");
      paragraphNode.appendChild(textNode);
      parent.appendChild(paragraphNode);
      context.advance(context.remains().length);
      stack.push(paragraphNode);
      stackIndex = stack.length - 1;
      return stackIndex;
    }
  }
}

export default BlockParser;