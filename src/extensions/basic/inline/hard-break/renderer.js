import Renderer from "../../../renderer.js";

class HardBreakRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<br>`;
  }
}

export { HardBreakRenderer };