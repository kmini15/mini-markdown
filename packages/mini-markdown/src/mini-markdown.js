import { OrderResolver } from "./core/order-resolver.js";

import { BlockParser } from "./parser/block-parser.js";
import { InlineParser } from "./parser/inline-parser.js";
import { AstRenderer } from "./renderer/ast-renderer.js";
import { HtmlRenderer } from "./renderer/html-renderer.js";
import { TokenRenderer } from "./renderer/token-renderer.js";

import { TokenSegmentBuilder } from "./renderer/token-segment-builder.js";
import { SyntaxHighlightRenderer } from "./renderer/syntax-highlight-renderer.js";

import { Basic } from "./extensions/basic/index.js";
import { Extended } from "./extensions/extended/index.js";
import { Custom } from "./extensions/custom/index.js";

export class MiniMarkdown {
  constructor(extensions = MiniMarkdown.defaultExtensions()) {
    this.root = null;
    this.extensions = extensions;
    this.blocks = this.extensions.flatMap(ext => ext.blocks ?? []);
    this.inlines = this.extensions.flatMap(ext => ext.inlines ?? []);
    this.renderers = this.extensions.flatMap(ext => ext.renderers ?? []);
    this.behaviors = this.extensions.flatMap(ext => ext.behaviors ?? []);
    this.styles = this.extensions.flatMap(ext => ext.styles ?? []);

    this.blocks = new OrderResolver(this.blocks).resolve();
    this.inlines = new OrderResolver(this.inlines).resolve();

    this.blockParser = new BlockParser(this.blocks.map(rule => rule.rule));
    this.inlineParser = new InlineParser(this.inlines.map(rule => rule.rule));
    this.astRenderer = new AstRenderer();
    this.htmlRenderer = new HtmlRenderer(this.renderers);
    this.tokenRenderer = new TokenRenderer();

    this.tokenSegmentBuilder = new TokenSegmentBuilder();
    this.syntaxHighlightRenderer = new SyntaxHighlightRenderer();

    this.text_markdown = null;
    this.node_ast = null;
    this.html_html = null;
  }

  static defaultExtensions() {
    return [
      Basic,
      Extended,
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
    
    this.html_html = this.htmlRenderer.render(this.parse(text));
    this.root.innerHTML = this.html_html;
    for (const behavior of this.behaviors) {
      behavior.mount(this.root);
    }
  }
  
  parse(text) {
    this.text_markdown = text;
    this.node_ast = this.blockParser.parse(text);
    this.node_ast = this.inlineParser.parse(this.node_ast);
    return this.node_ast;
  }
  
  parseSegments(node) {
    return this.tokenSegmentBuilder.build(node);
  }

  getPreviewAst() {
    return this.astRenderer.render(this.node_ast);
  }

  getPreviewHtml() {
    return this.escapeHtml(this.html_html);
  }

  getPreviewToken() {
    return this.tokenRenderer.render(this.node_ast, this.text_markdown);
  }
  
  getPreviewSyntax() {
    return this.syntaxHighlightRenderer.render(this.node_ast, this.text_markdown);
  }

  getPreviewMarkdown() {
    return this.escapeHtml(this.text_markdown);
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
}