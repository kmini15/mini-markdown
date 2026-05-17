import { Renderer } from "../../../../core/renderer.js";

export class SoftBreakRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `\n`;
  }
}
