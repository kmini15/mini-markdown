import Renderer from "../../renderer.js";

class CodeBlockRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<pre class="${this.type}"><code class="${this.type}">${text}</code></pre>\n`;
  }
}

export { CodeBlockRenderer };