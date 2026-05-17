import { Renderer } from "../../../../core/renderer.js";

export class FencedCodeBlockRenderer extends Renderer {
  constructor(type) {
    super(type);
  }
  
  render(text, node) {
    let language = "";
    if (node.data.fields.language) {
      language = `language-${node.data.fields.language}`;
    }
    return `<pre class="${this.type}"><code class="${this.type} ${language}">${text}</code></pre>`;
  }
}
