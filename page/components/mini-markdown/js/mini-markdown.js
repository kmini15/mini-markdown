import BlockParser from "./parser/block/block-parser.js";
import InlineParser from "./parser/inline/inline-parser.js";
import HtmlRenderer from "./renderer/html-renderer.js";
import AstRenderer from "./renderer/ast-renderer.js";

class MiniMarkdown {
  constructor() {
    this.blockParser = new BlockParser();
    this.inlineParser = new InlineParser();
    this.htmlRenderer = new HtmlRenderer();
    this.astRenderer = new AstRenderer();
  }

  async mount(container) {
    this.container = container;
    this.container.classList.add("mini-markdown");
    await this.loadCSS();
  }

  parse(text) {
    var node = this.blockParser.parse(text);
    node = this.parseInline(node, node.fields.references);
    return node;
  }
  
  parseInline(node, references = {}) {
    for (let child = node.firstChild; child; child = child.next) {
      child = this.parseInline(child, references);
    }
    if (node.type === "TEXT" && node.fields.inline) {
      const inlineNode = this.inlineParser.parse(node.value, references);
      node.insertAfter(inlineNode);
      node.unlink();
    }
    return node;
  }
  
  renderHtml(node) {
    var text = this.htmlRenderer.render(node);
    return text;
  }

  renderAst(node) {
    var text = this.astRenderer.render(node);
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