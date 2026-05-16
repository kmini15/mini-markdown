import Renderer from "../../../../core/renderer.js";

export class HtmlRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return node.data.token.text;
  }
}
