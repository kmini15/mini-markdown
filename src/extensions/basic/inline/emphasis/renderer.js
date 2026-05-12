import Renderer from "../../../renderer.js";

class EmphasisRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    if (node.fields.type === "bold") {
      return `<strong class="${this.type}">${text}</strong>`;
    } else if (node.fields.type === "italic") {
      return `<em class="${this.type}">${text}</em>`;
    }
    return text;
  }
}

export { EmphasisRenderer };