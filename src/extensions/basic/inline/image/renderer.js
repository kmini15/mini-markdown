import Renderer from "../../../../core/renderer.js";

class ImageRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    let title = "";
    if (node.data.fields.title) {
      title = ` title="${node.data.fields.title}"`;
    }
    return `<img class="${this.type}" src="${node.data.fields.src}"${title} alt="${text}">`;
  }
}

export { ImageRenderer };