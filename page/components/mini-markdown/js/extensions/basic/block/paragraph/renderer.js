import Renderer from "../../../renderer.js";

class ParagraphRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<p class="paragraph">${text}</p>\n`;
  }
}

export { ParagraphRenderer };