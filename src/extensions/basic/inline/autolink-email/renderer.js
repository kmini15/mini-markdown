import Renderer from "../../../../core/renderer.js";

export class AutolinkEmailRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<a class="${this.type}" href="${node.data.fields.href}">${text}</a>`;
  }
}
