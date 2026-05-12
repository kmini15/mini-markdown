import Rule from "../../../rule.js";
import Node from "../../../../core/node.js";

class HtmlRule extends Rule {
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

  start(context, parent) {
    const line = context.input.current();
    const match = line.match(this.pattern);
    if (!match) return false;
    return true;
  }

  parse(context, parent) {
    const line = context.input.current();
    const match = line.match(this.pattern);
    if (!match) return null;
    let stack = [];
    let lines = [];
    while (!context.input.eof()) {
      const line = context.input.current();
      const openTags = [...line.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)(\s[^>]*)?>/g)];
      const closeTags = [...line.matchAll(/<\/([a-zA-Z][a-zA-Z0-9-]*)>/g)];
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
      lines.push(line);
      context.input.advance();
      if (stack.length === 0) break;
    }
    if (lines.length === 0) return null;
    const text = new Node("TEXT");
    text.value = lines.join("\n") + "\n";
    text.fields = {
      inline: false,
    };
    const child = new Node(this.type);
    child.appendChild(text);
    context.input.retreat();
    context.input.consume(context.input.current().length);
    return child;
  }
}

export { HtmlRule };