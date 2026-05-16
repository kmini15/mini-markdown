import Renderer from "../../../../core/renderer.js";

export class LinkCitationRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    let title = "";
    if (node.data.fields.title) {
      title = ` title="${node.data.fields.title}"`;
    }
    return `<a class="${this.type}" href="${node.data.fields.href}"${title}>${text}</a>`;
  }
}
