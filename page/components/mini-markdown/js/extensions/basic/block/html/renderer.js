import Renderer from "../../../renderer.js";

class HtmlRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<div class="${this.type}">\n${text}</div>\n`;
  }
}

export { HtmlRenderer };