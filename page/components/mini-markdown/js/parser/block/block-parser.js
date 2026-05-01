import Node from "../../core/node.js";
import TextWidth from "../../core/text-width.js";
import LineReader from "../../core/line-reader.js";
import LineContext from "../../core/line-context.js";
import { DocumentRule } from "./rules/basic/document.js";
import { ParagraphRule } from "./rules/basic/paragraph.js";
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
    const paragraphRule = new ParagraphRule();
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
      new ParagraphRule(),
    ];
    this.rules.at(-1).setRules(this.rules);
    this.maxDepth = 20;
    this.DEBUG_MODE = true;
  }

  printStackInfo(message, stack, stackIndex) {
    console.log("        [" + message + "] stackIndex = " + stackIndex);
    console.log("        >> " + stack.map(node => node.type).join(" > "));
  }

  parse(text) {
    const reader = new LineReader(text);
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
      if (this.DEBUG_MODE) this.printStackInfo("Start Line", stack, stackIndex);
      stackIndex = this.match(stack, stackIndex, reader, context);
      if (this.DEBUG_MODE) this.printStackInfo("After Match", stack, stackIndex);
      stackIndex = this.carry(stack, stackIndex, reader, context);
      if (this.DEBUG_MODE) this.printStackInfo("After Carry", stack, stackIndex);
      stackIndex = this.close(stack, stackIndex, reader, context);
      if (this.DEBUG_MODE) this.printStackInfo("After Close", stack, stackIndex);
      stackIndex = this.start(stack, stackIndex, reader, context);
      if (this.DEBUG_MODE) this.printStackInfo("After Start", stack, stackIndex);
      reader.advance();
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
      const rule = this.getRule(node);
      if (!rule) continue; // No rule for this node type
      if (this.DEBUG_MODE) console.log("close", node.type, context.remains());
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
        if (!child) continue;
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
}



export default BlockParser;