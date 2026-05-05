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
    this.root = null;
  }

  async mount(root) {
    this.root = root;
    this.root.classList.add("mini-markdown");
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

  async applyJS() {
    if (!this.root) return;
    await this.waitImagesLoaded();
    this.applyImageRatios();
    this.applyJustifiedRowVariables();
    this.applyJustifiedColVariables();
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

  waitImagesLoaded() {
    if (!this.root) return Promise.resolve();
    const images = this.root.querySelectorAll("img");
    const promises = Array.from(images).map(img => {
      if (img.complete && img.naturalWidth > 0) {
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    });
    return Promise.all(promises);
  }

  applyImageRatios() {
    if (!this.root) return;
    this.root.querySelectorAll("img").forEach(img => {
      const apply = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (!w || !h) return;
        img.style.setProperty("--image-ratio", w / h);
      };
      // 1. 이미 로드된 경우
      if (img.complete && img.naturalWidth > 0) {
        apply();
        return;
      }
      // 2. 앞으로 로드될 경우
      img.addEventListener("load", apply, { once: true });
      // 3. 실패 fallback (선택)
      img.addEventListener("error", () => {
        img.style.setProperty("--image-ratio", 1);
      }, { once: true });
    });
  }

  applyJustifiedRowVariables() {
    if (!this.root) return;
    this.root.querySelectorAll(".justified-row").forEach(row => {
      const items = row.querySelectorAll(".justified-row-item");
      const gap = parseFloat(getComputedStyle(row).getPropertyValue("--gap")) || 0;      
      items.forEach(item => {
        const width = item.offsetWidth;
        const height = item.offsetHeight;
        console.log("item size", width, height);
        if (width > 0 && height > 0) {
          item.style.setProperty("--item-ratio", width / height);
          return;
        } else {
          item.style.setProperty("--item-ratio", 1);
        }
      })
    });
  }

  applyJustifiedColVariables() {
    if (!this.root) return;
    this.root.querySelectorAll(".justified-col").forEach(col => {
      const items = col.querySelectorAll(".justified-col-item");
      const gap = parseFloat(getComputedStyle(col).getPropertyValue("--gap")) || 0;      
      items.forEach(item => {
        const width = item.offsetWidth;
        const height = item.offsetHeight;
        console.log("item size", width, height);
        if (width > 0 && height > 0) {
          item.style.setProperty("--item-ratio", width / height);
          return;
        } else {
          item.style.setProperty("--item-ratio", 1);
        }
      })
    });
  }
}

export default MiniMarkdown;