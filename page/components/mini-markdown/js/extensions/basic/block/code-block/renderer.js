import Renderer from "../../../renderer.js";

class CodeBlockRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<pre class="${this.type}"><code class="${this.type}">${this.escapeHtml(text)}</code></pre>\n`;
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

export { CodeBlockRenderer };