import Renderer from "../../../renderer.js";

class BlockquoteRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<div class="${this.type}">\n${text}</div>\n`;
  }
}

export { BlockquoteRenderer };