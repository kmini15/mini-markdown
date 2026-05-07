import Renderer from "../../renderer.js";

class HeadingRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    const level = node.fields.level;
    return `<h${level} class="heading">${text}</h${level}>\n`;
  }
}

export { HeadingRenderer };
