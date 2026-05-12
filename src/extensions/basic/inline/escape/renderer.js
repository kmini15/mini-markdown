import Renderer from "../../../renderer.js";

class EscapeRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return node.value;
  }
}

export { EscapeRenderer };