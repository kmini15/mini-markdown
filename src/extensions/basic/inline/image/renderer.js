import Renderer from "../../../renderer.js";

class ImageRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<img class="${this.type}" src="${node.fields.src}" title="${node.fields.title}" alt="${text}">`;
  }
}

export { ImageRenderer };