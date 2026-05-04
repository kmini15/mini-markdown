import { Node, BlockRule } from "../block-rule.js";

class HtmlRule extends BlockRule {
  constructor() {
    super("HTML");
    this.pattern = /^(\s*)<([a-zA-Z][a-zA-Z0-9\-]*)(\s[^>]*)?>/;
    this.SELF_CLOSING_TAGS = new Set([
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

  start(parent, reader, context) {
    const parsed = context.remains().match(this.pattern);
    if (!parsed) return null;
    let stack = [];
    let lines = [];
    let isFirstLine = true;
    while (!reader.eof()) {
      let line;
      if (isFirstLine) {
        line = context.remains();
        isFirstLine = false;
      } else {
        line = reader.current();
      }
      const openTags = [...line.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)(\s[^>]*)?>/g)];
      const closeTags = [...line.matchAll(/<\/([a-zA-Z][a-zA-Z0-9-]*)>/g)];
      for (const m of openTags) {
        const tag = m[1].toLowerCase();
        if (!m[0].endsWith("/>") && !this.SELF_CLOSING_TAGS.has(tag)) {
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
      reader.advance();
      if (stack.length === 0) break;
    }
    if (lines.length === 0) return null;
    const textNode = new Node("TEXT");
    textNode.value = lines.join("\n");
    textNode.fields = {
      inline: false,
    };
    const htmlNode = new Node(this.type);
    htmlNode.appendChild(textNode);
    context.advance(context.remains().length);
    reader.retreat();
    return htmlNode;
  }
}

export { HtmlRule };