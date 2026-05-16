import Renderer from "../../../../core/renderer.js";

class HeadingAtxIdRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    const level = node.fields.level;
    let id = "";
    if (node.fields.id) {
      id = node.fields.id;
    }
    if (id) {
      id = ` id="${id}"`;
    }
    return `<h${level}${id} class="heading-atx-id">${text}</h${level}>\n`;
  }
}

export { HeadingAtxIdRenderer };
