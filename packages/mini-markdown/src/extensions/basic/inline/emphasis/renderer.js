import { Renderer } from "../../../../core/renderer.js";

export class EmphasisRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    if (node.data.fields.type === "bold") {
      return `<strong class="${this.type}">${text}</strong>`;
    } else if (node.data.fields.type === "italic") {
      return `<em class="${this.type}">${text}</em>`;
    }
    return text;
  }
}
