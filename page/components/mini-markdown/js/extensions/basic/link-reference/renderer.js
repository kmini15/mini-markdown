import Renderer from "../../renderer.js";

class LinkReferenceRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return text;
  }
}

export { LinkReferenceRenderer };