import Renderer from "../../../renderer.js";

class ImageStyleRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    let style = "";
    if (node.fields.style) {
      style = `style="${node.fields.style.slice(1, -1)}"`;
    }
    return `<img class="${this.type}" src="${node.fields.src}" title="${node.fields.title}" alt="${text}" ${style}>`;
  }
}

export { ImageStyleRenderer };