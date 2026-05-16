import Renderer from "../../../../core/renderer.js";

class FencedCodeBlockRenderer extends Renderer {
  constructor(type) {
    super(type);
  }
  
  render(text, node) {
    let language = "";
    if (node.data.fields.language) {
      language = `language-${node.data.fields.language}`;
    }
    return `<pre class="${this.type}"><code class="${this.type} ${language}">${this.escapeHtml(text)}</code></pre>`;
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
