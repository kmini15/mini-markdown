import Renderer from "../../../renderer.js";

class BlockquoteRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<blockquote class="${this.type}">\n${text}</blockquote>\n`;
  }
}

export { BlockquoteRenderer };