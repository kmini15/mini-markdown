import Renderer from "../../../../core/renderer.js";

export class ParagraphRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<p class="paragraph">${text.trim()}</p>\n`;
  }
}