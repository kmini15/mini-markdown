import BlockParser from "./parser/block-parser.js";
import InlineParser from "./parser/inline/inline-parser.js";
import HtmlRenderer from "./renderer/html-renderer.js";
import AstRenderer from "./renderer/ast-renderer.js";

import Document from "./extensions/basic/document/index.js";
import Heading from "./extensions/basic/heading/index.js";
import SetextHeading from "./extensions/basic/setext-heading/index.js";
import Paragraph from "./extensions/basic/paragraph/index.js";
import HorizontalRule from "./extensions/basic/horizontal-rule/index.js";
import Blockquote from "./extensions/basic/blockquote/index.js";
import CodeBlock from "./extensions/basic/code-block/index.js";
import List from "./extensions/basic/list/index.js";
import LinkReference from "./extensions/basic/link-reference/index.js";
import Html from "./extensions/basic/html/index.js";
import Grid from "./extensions/custom/grid/index.js";
import JustifiedRow from "./extensions/custom/justified-row/index.js";

class MiniMarkdown {
  constructor(extensions = MiniMarkdown.defaultExtensions()) {
    this.extensions = extensions;
    this.blockParser = new BlockParser(
      this.extensions.flatMap(ext => ext.blockRules ?? [])
    );
    this.inlineParser = new InlineParser();
    const rendererMap = Object.fromEntries(
      this.extensions.flatMap(ext => Object.entries(ext.renderers ?? {}))
    );
    console.log("HtmlRenderer map", rendererMap);
    this.htmlRenderer = new HtmlRenderer(rendererMap);
    this.astRenderer = new AstRenderer();
    this.root = null;
    
    this.behaviors = this.extensions.flatMap(ext => ext.behaviors ?? []);

    this.styles = this.extensions.flatMap(ext => ext.styles ?? []);
    for (const style of this.styles) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = style;
      document.head.prepend(link);
    }
  }

  static defaultExtensions() {
    return [
      Document,
      CodeBlock,
      Blockquote,
      List,
      LinkReference,
      Grid,
      JustifiedRow,
      Html,
      Heading,
      SetextHeading,
      HorizontalRule,
      Paragraph,
    ];
  }

  async mount(root) {
    this.root = root;
    this.root.classList.add("mini-markdown");
  }
  
  parseInline(node, references = {}) {
    for (let child = node.firstChild; child; child = child.next) {
      child = this.parseInline(child, references);
    }
    if (node.type === "text" && node.fields.inline) {
      const inlineNode = this.inlineParser.parse(node.value, references);
      node.insertAfter(inlineNode);
      node.unlink();
    }
    return node;
  }
    
  parseAst(text) {
    var node = this.blockParser.parse(text);
    node = this.parseInline(node);
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
  
  render(text) {
    for (const behavior of this.behaviors) {
      behavior.unmount(this.root);
    }
    const ast = this.parseAst(text);
    const html = this.renderHtml(ast);
    this.root.innerHTML = html;
    for (const behavior of this.behaviors) {
      behavior.mount(this.root);
    }
  }
}

export default MiniMarkdown;