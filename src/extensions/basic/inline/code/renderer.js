import Renderer from "../../../renderer.js";

class CodeRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<code class="${this.type}">${this.escapeHtml(node.value)}</code>`;
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

export { CodeRenderer };