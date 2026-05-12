import Renderer from "../renderer.js";

class TemplateRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return text;
  }
}

export { TemplateRenderer };