import { Renderer } from "../../../../core/renderer.js";

export class ImageStyleRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    let style = "";
    if (node.data.fields.style) {
      style = `style="${node.data.fields.style.slice(1, -1)}"`;
    }
    const src = node.data.fields.src;
    const title = node.data.fields.title;
    return `<img class="${this.type}" src="${src}" title="${title}" alt="${text}" ${style}>`;
  }
}
