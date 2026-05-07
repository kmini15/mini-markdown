import Renderer from "../../renderer.js";

class SetextHeadingRenderer extends Renderer {
  constructor(type) {
    super(type);
  }
  
  render(text, node) {
    const level = node.fields.level;
    return `<h${level} class="setext-heading">${text}</h${level}>\n`;
  }
}

export { SetextHeadingRenderer };
    