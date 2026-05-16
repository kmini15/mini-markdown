import Renderer from "../../../../core/renderer.js";

export class ListRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    if (node.data.fields.ordered) {
      return `<ol class="${this.type}">\n${text}</ol>\n`;
    } else {
      return `<ul class="${this.type}">\n${text}</ul>\n`;
    }
  }
}

export class ListItemRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<li class="${this.type}">\n${text}</li>\n`;
  }
}
