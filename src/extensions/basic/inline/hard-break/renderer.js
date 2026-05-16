import Renderer from "../../../../core/renderer.js";

export class HardBreakRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<br>`;
  }
}
