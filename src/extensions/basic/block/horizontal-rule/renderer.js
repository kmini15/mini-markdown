import Renderer from "../../../../core/renderer.js";

export class HorizontalRuleRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<hr class="${this.type}"/>\n`;
  }
}
