import Renderer from "../../renderer.js";

class ListRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<${node.fields.ordered ? 'ol' : 'ul'} class="${this.type}">\n${text}</${node.fields.ordered ? 'ol' : 'ul'}>\n`;
  }
}

class ListItemRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<li class="${this.type}">${text}</li>\n`;
  }
}

export { ListRenderer, ListItemRenderer };