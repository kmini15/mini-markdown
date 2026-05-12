import Renderer from "../../../renderer.js";

class LinkRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    let title = "";
    if (node.fields.title) {
      title = ` title="${node.fields.title}"`;
    }
    return `<a class="${this.type}" href="${node.fields.href}"${title}>${text}</a>`;
  }
}

export { LinkRenderer };