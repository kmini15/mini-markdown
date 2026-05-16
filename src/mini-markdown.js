import { BlockParser } from "./parser/block-parser.js";
import InlineParser from "./parser/inline-parser.js";
import HtmlRenderer from "./renderer/html-renderer.js";
import AstRenderer from "./renderer/ast-renderer.js";

import Basic from "./extensions/basic/index.js";
import Extended from "./extensions/extended/index.js";
import Custom from "./extensions/custom/index.js";

class MiniMarkdown {
  constructor(extensions = MiniMarkdown.defaultExtensions()) {
    this.root = null;
    this.extensions = extensions;
    this.blocks = this.extensions.flatMap(ext => ext.blocks ?? []);
    this.inlines = this.extensions.flatMap(ext => ext.inlines ?? []);
    this.renderers = this.extensions.flatMap(ext => ext.renderers ?? []);
    this.behaviors = this.extensions.flatMap(ext => ext.behaviors ?? []);
    this.styles = this.extensions.flatMap(ext => ext.styles ?? []);

    this.blocks.sort(this.comparePriority.bind(this));
    this.inlines.sort(this.comparePriority.bind(this));

    this.blockParser = new BlockParser(this.blocks.map(rule => rule.rule));
    this.inlineParser = new InlineParser(this.inlines.map(rule => rule.rule));
    this.htmlRenderer = new HtmlRenderer(this.renderers);
    this.astRenderer = new AstRenderer();

    this.node_ast = null;
    this.text_ast = "";
    this.text_html = "";
    this.text_markdown = "";
  }

  static defaultExtensions() {
    return [
      Basic,
      // Extended,
      Custom,
    ];
  }

  comparePriority(a, b) {
    return (
      a.priority.major - b.priority.major ||
      a.priority.minor - b.priority.minor
    );
  }

  mount(root) {
    this.root = root;
    this.root.classList.add("mini-markdown");
  }

  style() {
    for (const style of this.styles) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = style;
      if (!document.head.querySelector(`link[href="${style}"]`)) {
        document.head.prepend(link);
      }
    }
  }

  render(text) {
    for (const behavior of this.behaviors) {
      behavior.unmount(this.root);
    }
    this.node_ast = this.blockParser.parse(text);
    this.node_ast = this.inlineParser.parse(this.node_ast);
    this.text_ast = this.astRenderer.render(this.node_ast);
    this.text_html = this.htmlRenderer.render(this.node_ast);
    this.text_markdown = text;
    this.root.innerHTML = this.text_html;
    for (const behavior of this.behaviors) {
      behavior.mount(this.root);
    }
  }

  getTextAst() {
    return this.text_ast;
  }

  getTextHtml() {
    return this.text_html;
  }

  getTextMarkdown() {
    return this.text_markdown;
  }
}

export default MiniMarkdown;