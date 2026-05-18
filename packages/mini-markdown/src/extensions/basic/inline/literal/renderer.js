import { Renderer } from "../../../../core/renderer.js";

export class LiteralRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return this.escapeHtml(node.content.text);
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
