import { Renderer } from "../../../../core/renderer.js";

export class CodeInlineRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<code class="${this.type}">${text}</code>`;
  }
}
