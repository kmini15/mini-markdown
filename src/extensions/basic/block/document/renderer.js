import Renderer from "../../../../core/renderer.js";

export class DocumentRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<div class="document">\n${text}</div>\n`;
  }
}
