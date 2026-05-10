import BlockParser from "./parser/block-parser.js";
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
    this.blockRules = this.extensions.flatMap(ext => ext.blockRules ?? []);
    this.inlineRules = this.extensions.flatMap(ext => ext.inlineRules ?? []);
    this.renderers = this.extensions.flatMap(ext => ext.renderers ?? []);
    this.behaviors = this.extensions.flatMap(ext => ext.behaviors ?? []);
    this.styles = this.extensions.flatMap(ext => ext.styles ?? []);

    this.blockRules.sort(this.comparePriority.bind(this));
    this.inlineRules.sort(this.comparePriority.bind(this));

    this.blockParser = new BlockParser(this.blockRules.map(rule => rule.rule));
    this.inlineParser = new InlineParser(this.inlineRules.map(rule => rule.rule));
    this.htmlRenderer = new HtmlRenderer(this.renderers);
    this.astRenderer = new AstRenderer();
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

  async mount(root) {
    this.root = root;
    this.root.classList.add("mini-markdown");
    for (const style of this.styles) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = style;
      document.head.prepend(link);
    }
  }

  parseAst(text) {
    var node = this.blockParser.parse(text);
    var node = this.inlineParser.parse(node);
    return node;
  }

  renderAst(node) {
    var text = this.astRenderer.render(node);
    return text;
  }

  renderHtml(node) {
    var text = this.htmlRenderer.render(node);
    return text;
  }

  render(text) {
    for (const behavior of this.behaviors) {
      behavior.unmount(this.root);
    }
    const node = this.parseAst(text);
    const html = this.renderHtml(node);
    this.root.innerHTML = html;
    for (const behavior of this.behaviors) {
      behavior.mount(this.root);
    }
  }
}

export default MiniMarkdown;