import Renderer from "../../../renderer.js";

class FencedCodeBlockRenderer extends Renderer {
  constructor(type) {
    super(type);
  }
  
  render(text, node) {
    let language = "";
    if (node.fields.language) {
      language = `language-${node.fields.language}`;
    }
    return `<pre class="${this.type}"><code class="${this.type} ${language}">${this.escapeHtml(text)}</code></pre>\n`;
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

export { FencedCodeBlockRenderer };
