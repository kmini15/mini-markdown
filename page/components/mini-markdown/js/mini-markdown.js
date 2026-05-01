import ParserBlock from "./parser-block.js";
import ParserInline from "./parser-inline.js";
import Renderer from "./renderer.js";

class MiniMarkdown {
  constructor() {
    this.parserBlock = new ParserBlock();
    this.parserInline = new ParserInline();
    this.renderer = new Renderer();
  }

  async mount(container) {
    this.container = container;
    this.container.classList.add("mini-markdown");
    await this.loadCSS();
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
    if (node.type === "TEXT" && node.fields.inline) {
      const inlineNode = this.parserInline.parse(node.value, references);
      node.insertAfter(inlineNode);
      node.unlink();
    }
    return node;
  }
  render(node) {
    var text = this.renderer.render(node);
    return text;
  }

  async loadCSS() {
    const url = new URL("../css/markdown.css", import.meta.url).href;
    if (document.querySelector(`link[href="${url}"]`)) return;
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      link.onload = () => resolve();
      link.onerror = () => {
        reject(new Error(`Failed to load CSS: ${url}`));
      };
      document.head.appendChild(link);
    });
  }
}

export default MiniMarkdown;