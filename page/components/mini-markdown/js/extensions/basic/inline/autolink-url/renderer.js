import Renderer from "../../../renderer.js";

class AutolinkUrlRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<a class="${this.type}" href="${node.fields.href}">${node.fields.href}</a>`;
  }
}

export { AutolinkUrlRenderer };