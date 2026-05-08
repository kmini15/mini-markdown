import Renderer from "../../../renderer.js";

class AutolinkEmailRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<a class="${this.type}" href="mailto:${node.fields.href}">${node.fields.href}</a>`;
  }
}

export { AutolinkEmailRenderer };