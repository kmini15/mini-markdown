import ParserBlock from "./parser-block.js";
import ParserInline from "./parser-inline.js";
import Renderer from "./renderer.js";

class MiniMarkdown {
  constructor() {
    this.parserBlock = new ParserBlock();
    this.parserInline = new ParserInline();
    this.renderer = new Renderer();
  }
  parse(text) {
    var node = this.parserBlock.parse(text);
    node = this.parseInline(node, node.fields.references);
    return node;
  }
  parseInline(node, references = {}) {
    for (let child = node.firstChild; child; child = child.next) {
      child = this.parseInline(child, references);
    }
    if (node.type === "INLINE") {
      const inlineNode = this.parserInline.parse(node.firstChild.value, references);
      node.insertAfter(inlineNode);
      node.unlink();
      node = inlineNode;
    }
    return node;
  }
  render(node) {
    var text = this.renderer.render(node);
    return text;
  }
}

export default MiniMarkdown;