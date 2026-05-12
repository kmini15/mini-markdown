import Renderer from "../../../renderer.js";

class SoftBreakRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `\n`;
  }
}

export { SoftBreakRenderer };