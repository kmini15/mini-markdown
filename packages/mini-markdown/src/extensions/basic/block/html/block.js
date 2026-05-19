import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

export class HtmlRule extends Block {
  constructor(type) {
    super(type);
    this.pattern = /^(\s*)<([a-zA-Z][a-zA-Z0-9-]*)(\s[^>]*)?>/;
    this.patternOpen = /<([a-zA-Z][a-zA-Z0-9-]*)(\s[^>]*)?>/g;
    this.patternClose = /<\/([a-zA-Z][a-zA-Z0-9-]*)>/g;
    this.selfClosingTags = new Set([
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
    ]);
  }

  parse(context, parent) {
    const cursor = context.input.capture();
    const input = context.input.current();
    const match = this.pattern.exec(input);
    if (!match) return null;
    let stack = [];
    let lines = [];
    while (!context.input.eof()) {
      const cursor0 = context.input.capture();
      const input = context.input.current();
      context.input.advance();
      const cursor1 = context.input.capture();
      const text = new Node(this.type + "-text");
      text.content = {
        text: input,
        start: cursor0,
        end: cursor1,
      };
      lines.push(text);
      const openTags = [...input.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)(\s[^>]*)?>/g)];
      const closeTags = [...input.matchAll(/<\/([a-zA-Z][a-zA-Z0-9-]*)>/g)];
      for (const m of openTags) {
        const tag = m[1].toLowerCase();
        if (!m[0].endsWith("/>") && !this.selfClosingTags.has(tag)) {
          stack.push(tag);
        }
      }
      for (const m of closeTags) {
        const tag = m[1].toLowerCase();
        if (stack.length && stack[stack.length - 1] === tag) {
          stack.pop();
        }
      }
      if (stack.length === 0) break;
    }
    if (lines.length === 0) {
      context.input.restore(cursor);
      return null;
    }
    const child = new Node(this.type);
    child.content = {
      text: "",
      start: lines[0].content.start,
      end: lines[0].content.start,
    };
    for (const line of lines) {
      child.appendChild(line);
    }
    context.input.retreat();
    context.input.consume(context.input.current().length);
    return child;
  }
}
